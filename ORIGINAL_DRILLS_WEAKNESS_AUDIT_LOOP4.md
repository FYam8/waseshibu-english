# ORIGINAL_DRILLS_WEAKNESS_AUDIT_LOOP4

実施日時: 2026-09-02 16:47+01 以後の4回目精査ループ  
基準入力: `waseshibu-english-v0.18.2-detail-hold-loop3.zip`  
出力: `waseshibu-english-v0.18.2-detail-hold-loop4.zip`

## 判定

- 今回の修正対象（content_match / insertion / reference）: **CLEAN x2**
- プロジェクト全体: **NOT CLEAN継続**
- CLEAN連続回数（全体）: **0**

理由: 今回の3分野は修正・精査・独立再精査でCLEANに達したが、context / emotion / detail解説 / reorder解説 / pronunciation・stress最終一意性確認など未修正または未確定の分野が残っているため。

## 今回の修正内容

前回Loop3で残った高Severity項目から、次を修正した。

| 分野 | 非破壊retire | 新ID置換 | 主な修正 |
|---|---:|---:|---|
| content_match | 16 | 16 | 短文1文照合を退避し、1択・2つ選択・NOT型を含む複数文照合へ置換 |
| insertion | 14 | 14 | 接続語1個で即答できる旧問を退避し、指示語・時系列・因果・段落論理の2根拠以上で位置を決める問題へ置換 |
| reference | 9 | 9 | 単純名詞照応中心の旧問を退避し、前文全体・行動・計画・概念・原因を指す問題へ置換 |
| 合計 | 39 | 39 | active数維持 |

追加ファイル: `original-drills-loop4.js`

## 非破壊方針

旧IDは削除せず、以下を付与した。

- `retired: true`
- `retiredReason`
- `legacyCompletion: true`

新規問題は新IDで追加した。

- content_match: `lcm01`〜`lcm16`
- insertion: `lin01`〜`lin14`
- reference: `lrf01`〜`lrf09`

UI上の弱点分野は維持。

- `content_match` は内容一致
- `insertion` は文挿入
- `reference` は指示語

内部細分化は `targetId` / `focusTag` で行った。

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

### Loop4専用監査

`node tests/original-loop4-audit.mjs`

結果: **PASS**

出力:

```text
loop4 audit ok: content_match/insertion/reference retired 39 + new 39; active 283; UI skills preserved; explanations 8 fields; formats and answer distributions checked
```

## 独立再精査

完成ZIPを再展開し、同じ3テストを再実行。

- `node tests/audit.mjs`: PASS
- `node tests/detail-audit.mjs`: PASS
- `node tests/original-loop4-audit.mjs`: PASS

さらに別観点でruntimeをロードして確認。

| 項目 | 結果 |
|---|---:|
| total DRILLS | 378 |
| active DRILLS | 283 |
| retired DRILLS | 95 |
| Loop4 retire対象がactiveに残っていない | PASS |
| Loop4追加39問がactive | PASS |
| active skill countsがLoop3と同じ | PASS |
| `insertion-cohesion` がskillとして独立していない | PASS |
| active insertionのskillが全て `insertion` | PASS |
| content_matchの内訳が1択11問・2つ選択5問 | PASS |
| content_match / insertion / referenceの全新問に8項目解説 | PASS |

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

### content_match

- 旧 `cm01`〜`cm03`, `xcm1`〜`xcm8`, `ncm01`〜`ncm05` をretire。
- `lcm01`〜`lcm16` を追加。
- 本番で見られる形式差を反映。
  - 2つ選択型: 5問
  - 1択型: 9問
  - NOT / 一致しないもの: 2問
- 旧問のような1文言い換えではなく、複数文から時系列・予定変更・実験条件・研究結果の限界・only / all / most / notを照合する形式へ変更。
- 全問に8項目解説を付与。

判定: **CLEAN**

### insertion

- 旧 `in02`, `in03`, `xin1`〜`xin7`, `nin01`〜`nin05` をretire。
- `lin01`〜`lin14` を追加。
- UI skillは `insertion` のまま維持。
- 位置決定に最低2要素を要求するように作成。
  - 指示語
  - 接続語
  - 時系列
  - 因果
  - 対比
  - 段落論理
  - 具体例導入
- 旧問の「However / For exampleだけで即答」寄りのものはactiveから外した。
- 全問に8項目解説を付与。

判定: **CLEAN**

### reference

- 旧 `re01`, `re02`, `xrf1`, `xrf2`, `xrf3`, `xrf5`, `xrf6`, `xrf7`, `xrf8` をretire。
- `lrf01`〜`lrf09` を追加。
- 単純名詞照応だけでなく、次を扱う。
  - 前文全体
  - 一連の行動
  - 計画
  - 行動理由
  - 概念・行動パターン
  - 複数行動
- 全問に8項目解説を付与。

判定: **CLEAN**

## まだNOT CLEANの理由

未修正・未確定の分野が残る。

| 分野 | 残課題 |
|---|---|
| detail | mapping方向性は改善済みだが、全20問の解説8項目と一部mappingの再照合が未完 |
| context | 心情語補充と文脈語彙が混在。内部再分類が必要 |
| emotion | 単純感情語当てが残る。行動・状況・心情変化から判断する問題へ寄せる必要 |
| connector | 単文の接続詞練習が多く、過去問相当の根拠範囲か未確認 |
| paraphrase / extract / example / sentence_completion | 元問とのmapping qualityと解説最低基準の全件監査が未完 |
| reorder | 素材は比較的良いが、本番同様の指定位置回答と解説の強化が未完 |
| pronunciation / stress | KEEP候補だが、発音・強勢位置・正解一意性の最終確認が未完 |

## 次ループの推奨対象

Severity × User impact × 戦略重要度で、次は以下を推奨。

1. `context / emotion`
2. `detail` の解説8項目・mapping再照合
3. `connector`
4. `reorder` の指定位置回答・解説強化

特に `context / emotion` はUI上は別分野だが、現行旧問では単純感情語当てが重複しているため、次に整理する価値が高い。
