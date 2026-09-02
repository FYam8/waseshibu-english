# REBUTTAL16 AUDIT LOOP3 CLEAN

対象: 要約＋反論 `rebuttal` 16問（`lrb01`〜`lrb16`）

## 背景

前回の精査後、2024〜2026年度の過去問構成と比較した結果、現行16問は「相手の主張 → 空所」で終わっており、過去問にある「空所後の相手の反応」が不足していた。

過去問側では、空所後に相手が `That might work` / `benefit you mentioned` / `That is a good point` のように反応し、受験者の答案が後続発言へ自然につながる必要がある。

## 修正内容

`lrb01`〜`lrb16` の全問に、空所後のB発言を1文追加した。

- active類題数: 283維持
- retired類題数: 100維持
- active rebuttal: 16問維持
- 旧 `nrb01`〜`nrb05`: 非破壊retire維持
- 問題ID: `lrb01`〜`lrb16` 維持
- `postBlankResponse` を各問へ付与
- 解説へ `【後続発言】` を追加

## 代表例

### lrb02

```text
A: Should students be allowed to use mobile phones at school?
B: I do not think so. Phones may ring during lessons, and students might send messages when they should be listening. During breaks, they may play games instead of talking with friends. Phones would make the school less focused.
A: (                              )
B: That sounds reasonable. If schools make clear rules and students can use phones only for study or emergencies, the problems I mentioned might be reduced.
```

### lrb10

```text
A: What do you think about zoos?
B: I think they should be closed. Some animals are brought from faraway places and kept in small spaces. They cannot hunt or move as they would in the wild. It is unfair to keep animals only for visitors’ entertainment.
A: (                              )
B: I see. I did not think much about the benefit you mentioned. Maybe improving zoos is better than closing all of them.
```

### lrb11

```text
A: What do you think about cleaning time at school?
B: Students are already busy with homework, club activities, and tests. Professional cleaners know how to clean quickly and well. Students should use that time for studying or resting instead of doing extra work.
A: (                              )
B: Hmm, that is a good point. If cleaning teaches responsibility and helps the school save money, it may not be just extra work.
```

## 精査1

実行:

- `node tests/audit.mjs`
- `node tests/detail-audit.mjs`
- `node tests/detail20-loop1-audit.mjs`
- `node tests/original-loop4-audit.mjs`
- `node tests/rebuttal16-loop2-audit.mjs`
- `node tests/rebuttal16-loop3-audit.mjs`

結果: CLEAN

## 独立再精査

ZIP化前のディレクトリを別ディレクトリへコピーし、同じテストを再実行。

確認内容:

- 16問すべてが `A: ( )` の後に `B:` 発言を持つ
- `postBlankResponse` とprompt内の後続発言が一致
- Bの最初の主張は主張＋理由＋補足を持つ
- 後続発言が答案方向を制約する
- `lrb02` はrules/study/emergenciesへ接続
- `lrb10` はbenefit/improving/closingへ接続
- `lrb11` はresponsibility/save money/extra workへ接続
- active 283 / retired 100 維持
- 既存履歴保護のため旧IDのretire状態維持

結果: CLEAN

## 判定

要約＋反論16問については、

修正 → 精査 → CLEAN → 独立再精査 → CLEAN

を達成。

ただし、これは `rebuttal` 16問に限る。プロジェクト全体CLEANではない。
