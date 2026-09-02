# 早稲渋 英語｜過去問 × 弱点克服

2019〜2026年度の早稲田渋谷シンガポール校・英語入試をベースにした GitHub Pages 向け静的アプリです。

## 今回の設計

### PDFビューアは使いません
実際の問題冊子PDFをアプリ内表示する方式はやめました。
問題冊子から抽出した **実際の筆記本文・設問** を、アプリの画面にテキストとして収録しています。

### 過去問を解いた後が本体
1. 実際の過去問を解く
2. 公式解答で採点
3. 誤答を分野・A/B/C・論点・原因で記録
4. 元設問と同じ論点の類題を反復
5. **3問連続正解** まで続ける
6. 翌日に **2問連続正解** の定着チェック
7. ここまで通れば「克服済み」

間違えると連続正解数は0に戻るため、「たまたま1回当たった」で弱点を消しません。

学習目標は A 60点・B 70点・C 75点。毎日の必須分は、実際に解答した類題を最大10問まで数えます。目標を途中で変えても当日の解答数はリセットしません。必須分を終えた後も、任意の次の問題を表示します。翌日確認は予定日前に開始できません。

## 弱点ドリル対象
- 発音
- アクセント
- 語句整序
- 言い換え
- 文脈
- 心情
- 理由
- 本文抜出
- 内容一致
- 英語完成
- 指示語
- 接続語
- 文挿入
- 内容把握
- 具体例
- 短文完成
- 要約
- 要約＋反論

通常の英単語学習・リスニングは別アプリ想定です。

## 得点戦略
- A 60点：A問題を最優先にして合格ラインを守る。
- B 70点：Aを固めたうえでB問題まで補強する。
- C 75点：A・Bを確実にした後、取れるC問題を選ぶ。

目標を変更しても、過去の得点・正誤・克服履歴は変更しません。「今日やること」の推奨だけを再計算します。

## データ保存
ブラウザの `localStorage` に保存します。サーバー・ログイン不要です。保存キーは今後のバージョンでも変更せず、`schemaVersion` ごとの自動移行で学習履歴を引き継ぎます。旧版データは初回起動時に自動移行し、移行前データも復旧用コピーとして端末内に残します。バックアップには検査値を付け、復元前の状態も端末内に3世代まで退避します。

## GitHub Pages
1. ZIPを展開
2. GitHubの公開リポジトリへ全ファイルをアップロード
3. `Settings` → `Pages`
4. `Deploy from a branch`
5. `main` / `(root)`

ビルド不要です。


## v0.18.2-detail-hold-loop3

HOLD版。summary / rebuttal / reason / vocab_definition の高Severity旧問39件を非破壊retireし、同数の新IDオリジナル類題へ置換。active 283問は維持。全分野CLEANではない。


## v0.18.2-detail-hold-loop4

HOLD版。Loop3に続き、content_match / insertion / reference の旧39件を非破壊retireし、同数の新IDオリジナル類題へ置換。active 283問は維持。今回修正3分野はCLEAN x2。ただし全分野CLEANではない。


## v0.18.2 rebuttal16 loop2

要約＋反論16問に限り、nrb01〜nrb05を非破壊retireし、lrb12〜lrb16を追加。lrb01〜lrb11は解説8項目を補強。CLEAN ×2。


## v0.18.2 rebuttal16 loop3

要約＋反論16問について、2024〜2026過去問構成に合わせ、全問に空所後の相手発言を追加。`postBlankResponse` と `【後続発言】` 解説を付与。CLEAN ×2。


## v0.18.2-summary15-loop2

要約 `summary` 15問を個別修正。旧 `nsu01〜nsu05 / lsu01〜lsu10` は非破壊retireし、新 `lsu11〜lsu25` をactive化。2022〜2023年度大問4の要約形式に合わせ、まとまった英文・不要情報・重要情報選択・40/50語制限を再現。詳細は `SUMMARY15_AUDIT_LOOP2_CLEAN.md`。


## v0.18.2 reason10 loop2

`reason` 10問について、過去問の理由問題（2024大問5問2、2025大問5問5、2026大問7問3）と比較し、LIGHT_EDIT対象4問を非破壊retire、新ID4問を追加。active 283問は維持。理由10問はCLEAN×2。


## Reason10 loop4 clean

理由10問について、前回NOT CLEANだった lrs02 / lrs04 を非破壊retireし、lrs15 / lrs16 を追加。精査・独立再精査ともCLEAN。


## emotion10 loop4
- `lem07` retired due to topic proximity to 2024 大問5.
- `lem11` added as active replacement.
- emotion active count remains 10; total active drills remain 283.


## v0.18.2 reading50-loop2 clean

読解ミニセットA（connector/content_match/insertion/reference）50問について、過去問比較を行い、connectorの範囲を過去問主要型に締め直し、insertionの根拠英文和訳を修正した版。
active 283問を維持し、retired 176問を非破壊保持。


## reading50-loop3

読解ミニセットAの追加精査で、connector正解位置偏りとinsertion正解位置偏りを非破壊修正。READING50_AUDIT_LOOP3_CLEAN.md を参照。


## v0.18.2 grammar77 loop3
文法・完成セット77問を過去問再比較後に修正。reorderに2026型番号空欄を10問追加し、writing_completionを2空所・本文量強化型へ置換。CLEAN ×2。


## v0.18.2 sound30 loop2
音声知識セット30問（発音16・アクセント14）をCLEAN ×2。


## sound30-loop3

過去問比較後にCLEAN解除した音声知識3問を修正。`lpr03` / `lst01` / `lst14` を非破壊retireし、`lpr17` / `lst15` / `lst16` を追加。過去問4語完全一致を解消。
