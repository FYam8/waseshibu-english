#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [goldDir, ...reportPaths] = process.argv.slice(2);
if (!goldDir || reportPaths.length < 2) {
  console.error('Usage: node compare-evals.mjs <gold-dir> <report-A.json> <report-B.json> [report-C.json ...]');
  process.exit(2);
}

const pricingPath = path.join(goldDir, 'pricing-snapshot.json');
const pricing = fs.existsSync(pricingPath) ? JSON.parse(fs.readFileSync(pricingPath, 'utf8')) : {};

function pctNumber(v) {
  if (typeof v === 'number') return v;
  const n = Number(String(v ?? '').replace('%',''));
  return Number.isFinite(n) ? n : NaN;
}

function validateReport(reportPath) {
  const validator = path.join(goldDir, 'validate.mjs');
  const run = spawnSync(process.execPath, [validator, goldDir, reportPath], { encoding: 'utf8' });
  if (!run.stdout?.trim()) throw new Error(`validator produced no output for ${reportPath}: ${run.stderr}`);
  const metrics = JSON.parse(run.stdout);
  return { metrics, exitCode: run.status ?? 1, stderr: run.stderr || '' };
}

function costFor(report) {
  const p = pricing.models?.[report.model];
  if (!p) return { usd: null, pricing_snapshot: null };
  const input = Number(report.usage?.input_tokens || 0);
  const output = Number(report.usage?.output_tokens || 0);
  const usd = input / 1_000_000 * Number(p.input_usd_per_m_tokens) + output / 1_000_000 * Number(p.output_usd_per_m_tokens);
  return { usd, pricing_snapshot: { model: report.model, ...p, snapshot_date: pricing.snapshot_date, source: pricing.source } };
}

const rows = reportPaths.map(reportPath => {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const { metrics, exitCode, stderr } = validateReport(reportPath);
  const cost = costFor(report);
  const cases = Number(report.cases || metrics.ai_cases || 0) || 1;
  const totalTokens = Number(report.usage?.total_tokens || 0);
  const highSeverityPass =
    pctNumber(metrics.prediction_coverage) === 100 &&
    pctNumber(metrics.major_contradiction_miss_or_unresolved_rate) === 0 &&
    pctNumber(metrics.false_semantic_complete_rate_on_expected_noncomplete) === 0;
  return {
    candidate: report.candidate,
    model: report.model,
    provider: report.provider,
    validator_exit_code: exitCode,
    validator_stderr: stderr.trim() || null,
    high_severity_pass: highSeverityPass,
    semantic_accuracy_all_ai_cases: metrics.semantic_accuracy_S1_to_R2_all_ai_cases,
    exact_case_match_all_ai_cases: metrics.exact_case_match_all_ai_cases,
    prediction_coverage: metrics.prediction_coverage,
    contradiction_miss_or_unresolved_rate: metrics.major_contradiction_miss_or_unresolved_rate,
    false_semantic_complete_rate: metrics.false_semantic_complete_rate_on_expected_noncomplete,
    missed_or_unresolved_escalation_rate: metrics.missed_or_unresolved_escalation_rate,
    escalated_to_l2: Number(report.escalated_to_l2 || 0),
    escalation_rate: Number(report.escalation_rate || 0),
    input_tokens: Number(report.usage?.input_tokens || 0),
    output_tokens: Number(report.usage?.output_tokens || 0),
    total_tokens: totalTokens,
    avg_total_tokens_per_answer: totalTokens / cases,
    estimated_cost_usd: cost.usd,
    estimated_cost_per_1000_answers_usd: cost.usd == null ? null : cost.usd / cases * 1000,
    pricing_snapshot: cost.pricing_snapshot
  };
});

const eligible = rows.filter(r => r.high_severity_pass && r.validator_exit_code === 0);
const ranked = [...eligible].sort((a,b) => {
  const sa = pctNumber(a.semantic_accuracy_all_ai_cases), sb = pctNumber(b.semantic_accuracy_all_ai_cases);
  if (sa !== sb) return sb - sa;
  const ea = pctNumber(a.exact_case_match_all_ai_cases), eb = pctNumber(b.exact_case_match_all_ai_cases);
  if (ea !== eb) return eb - ea;
  return a.total_tokens - b.total_tokens;
});

const output = {
  status: 'development-only',
  warning: 'This ranking is from the provisional development set. Do not claim production accuracy or choose a final production prompt until blind adjudication and unseen holdout evaluation are complete.',
  candidates: rows,
  development_leader: ranked[0]?.candidate || null,
  ranking_rule: 'First require 100% coverage, zero major-contradiction miss/unresolved, and zero false-semantic-complete; then maximize semantic accuracy, then exact case match, then minimize total tokens.'
};

console.log(JSON.stringify(output, null, 2));
if (!eligible.length) process.exitCode = 1;
