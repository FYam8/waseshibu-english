# ORIGINAL_DRILLS_WEAKNESS_AUDIT_LOOP3

実施日時: 2026-09-02 16:47+01 以後の3回目精査ループ  
基準入力: `waseshibu-english-v0.18.2-detail-hold-loop2.zip`  
出力: `waseshibu-english-v0.18.2-detail-hold-loop3.zip`

## 判定

- 今回の修正対象（summary / rebuttal / reason / vocab_definition）: **CLEAN x2**
- プロジェクト全体: **NOT CLEAN継続**
- CLEAN連続回数（全体）: **0**

理由: 今回の高Severity 4分野は修正・再精査・独立再精査でCLEANに達したが、content_match / insertion / reference / context / emotion / detail解説など未修正の分野が残っているため。

## 修正内容

前回Loop2で残った高Severity項目から、次を修正した。

| 分野 | 非破壊retire | 新ID置換 | 主な修正 |
|---|---:|---:|---|
| summary | 10 | 10 | 要約済み日本語・圧縮英文を退避し、まとまった英文＋不要情報＋重要情報選択型に置換 |
| rebuttal | 11 | 11 | 一文圧縮意見を退避し、主張＋理由2つ程度＋補足を含む会話型に置換 |
| reason | 10 | 10 | `because / so that / to` 直示型を退避し、2〜4文の状況から理由を復元する選択式に置換 |
| vocab_definition | 8 | 8 | 四択定義問題を退避し、本番寄せの頭文字＋自力記述へ置換 |
| 合計 | 39 | 39 | active数維持 |

追加ファイル: `original-drills-loop3.js`

## 非破壊方針

旧IDは削除せず、以下を付与した。

- `retired: true`
- `retiredReason`
- `legacyCompletion: true`

新規問題は新IDで追加した。

- summary: `lsu01`〜`lsu10`
- rebuttal: `lrb01`〜`lrb11`
- reason: `lrs01`〜`lrs10`
- vocab_definition: `lvd01`〜`lvd08`

## 実行確認

### 監査1

`node tests/audit.mjs`

結果: **PASS**

出力:

```text
audit ok: schema8 migration/recovery, A/B/C goals, actual daily 10, 151 official answers, 283 drills, resume/merge, timeout/input, mobile/noindex
```

### detail監査

`node tests/detail-audit.mjs`

結果: **PASS**

出力:

```text
detail audit ok: 50 source mappings; 7 reused + 13 new; 4 pools x 5 families; 13 legacy items retired; history/mastery facts preserved
```

### 独立再精査

別途runtimeをロードして以下を確認。

| 項目 | 結果 |
|---|---:|
| total DRILLS | 339 |
| active DRILLS | 283 |
| retired DRILLS | 56 |
| Loop3 retire対象がactiveに残っていない | PASS |
| Loop3追加39問がactive | PASS |
| active skill countsがLoop2と同じ | PASS |
| active reasonに `because / so that / to` 直示プロンプトなし | PASS |
| `lrs01`〜`lrs10` に選択式8項目解説あり | PASS |
| `lvd01`〜`lvd08` がtext型・頭文字指定・定義解説あり | PASS |

active skill counts:

```text
reorder 47
detail 20
pronunciation 16
content_match 16
sentence_completion 16
rebuttal 16
summary 15
stress 14
insertion 14
writing_completion 14
vocab_definition 13
connector 11
paraphrase 11
extract 11
context 10
emotion 10
example 10
reason 10
reference 9
```

## 今回のCLEAN範囲

### summary

- 旧 `su01`, `su02`, `xsu1`〜`xsu8` をretire。
- `lsu01`〜`lsu10` を追加。
- 本文を読ませ、不要情報を捨て、重要情報を選ぶ形式に統一。
- 40語以内 / 50語以内のmodelが語数上限内であることを確認。

判定: **CLEAN**

### rebuttal

- 旧 `rb01`〜`rb03`, `xrb1`〜`xrb8` をretire。
- `lrb01`〜`lrb11` を追加。
- Bの発言に主張・理由・補足を入れ、相手要約→反論→理由の処理を要求。
- `However/But` の語そのものは必須化せず、論理転換をcheck項目化。

判定: **CLEAN**

### reason

- 旧 `rs01`, `rs02`, `xrs1`〜`xrs8` をretire。
- `lrs01`〜`lrs10` を追加。
- active reasonプロンプト内に `because / so that / to` などの直示理由マーカーがないことを機械確認。
- 全問、2〜4文程度から行動・判断理由を復元する形式。
- 選択式8項目解説を付与。

判定: **CLEAN**

### vocab_definition

- 旧 `xvd1`〜`xvd8` をretire。
- `lvd01`〜`lvd08` を追加。
- すべて `type: "text"` かつ頭文字指定。
- 定義文和訳・意味・品詞・例文を解説に含めた。

判定: **CLEAN**

## まだNOT CLEANの理由

未修正・未確定の分野が残る。

| 分野 | 残課題 |
|---|---|
| detail | mapping方向性は改善済みだが、全20問の解説8項目と一部mappingの再照合が未完 |
| content_match | 短文1〜3文の照合が多く、元問の根拠範囲・1択/2択/NOT形式の再現が不足 |
| insertion | 旧問に接続語1つで決まりやすい問題が残る。2根拠・位置一意性の全件監査が必要 |
| reference | 単純名詞照応が多く、前文全体・句・節・概念照応が不足 |
| context | 心情語補充と文脈語彙が混在。内部再分類が必要 |
| emotion | 単純感情語当てが残る。行動・状況・心情変化から判断する問題へ寄せる必要 |
| connector | 単文の接続詞練習が多く、過去問相当の根拠範囲か未確認 |
| paraphrase / extract / example / sentence_completion | 元問とのmapping qualityと解説最低基準の全件監査が未完 |
| reorder | 素材は比較的良いが、本番同様の指定位置回答と解説の強化が未完 |
| pronunciation / stress | KEEP候補だが、発音・強勢位置・正解一意性の最終確認が未完 |

## 次ループの推奨対象

Severity × User impact × 戦略重要度で、次は以下を推奨。

1. `content_match`
2. `insertion`
3. `reference`
4. `context / emotion`

特に `content_match` は本番の1択・2択・NOTの混同を防ぐ必要があり、優先度が高い。
