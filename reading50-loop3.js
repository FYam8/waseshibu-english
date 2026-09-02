(()=>{
'use strict';
const B=window.DRILLS||[];
const retireIds=new Set(["lco01", "lco02", "lco03", "lco12", "lco13", "lco14", "lco15", "lco16", "lco17", "lco18", "lco19", "lin02", "lin04", "lin05", "lin12"]);
for(const q of B){ if(retireIds.has(q.id)){ q.retired=true; q.retiredBy='reading50-loop3'; q.legacyCompletion=true; q.retiredReason='reading50 loop3: answer-position bias / final-position insertion balance を非破壊で修正。'; }}
const additions=[
  {
    "skill": "connector",
    "type": "choice",
    "targetId": "connector-logic",
    "examFormat": "choice",
    "id": "lco20",
    "focusTag": "connector-example",
    "level": 3,
    "sourceComparison": "2022大問6問2型: 前文の抽象説明を受け、次文で具体例を導入する接続関係。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】Many students now use more than one screen while studying. They may read a textbook on a desk, keep a chat app open on a phone, and check short videos whenever they feel bored. (     ), some students try to solve math problems while replying to messages from friends. Researchers say this habit can make it harder to stay focused.",
    "options": [
      "For example",
      "However",
      "In other words",
      "As a result"
    ],
    "answer": 0,
    "explanation": "【正解】For example\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Many students now use more than one screen while studying. / some students try to solve math problems while replying to messages from friends.\n【根拠英文和訳】多くの生徒は勉強中に複数の画面を使う。数学の問題を解きながら友人へのメッセージに返信する生徒もいる。\n【なぜ正解か】前文の一般説明に対して、後文が具体例を出しているので For example が適切。\n【他選択肢】However は逆接、In other words は言い換え、As a result は結果なので合わない。\n【元弱点とのつながり】接続関係: 抽象説明と具体例の関係を判断する。\n【戦略分類】A/B: 具体例導入を見抜けば取れる。"
  },
  {
    "skill": "connector",
    "type": "choice",
    "targetId": "connector-logic",
    "examFormat": "choice",
    "id": "lco21",
    "focusTag": "connector-contrast",
    "level": 3,
    "sourceComparison": "2021大問6問4型: 一般的な思い込みと本文で述べる実際の事実を対比する接続関係。 / reading50 loop2で選択肢を過去問主要セットへ締め直し。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】Many people imagine that school gardens are used only by science classes. (     ), teachers in other subjects also use them. Art students draw plants there, and English classes sometimes write short poems after observing the flowers.",
    "options": [
      "For example",
      "However",
      "As a result",
      "In other words"
    ],
    "answer": 1,
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Many people imagine that school gardens are used only by science classes. / teachers in other subjects also use them.\n【根拠英文和訳】多くの人は学校の庭は理科だけで使われると思っている。しかし他教科の先生もそれを使う。\n【なぜ正解か】『理科だけ』という思い込みに対して『他教科も使う』と反対内容が続くので However。\n【他選択肢】For example は具体例導入、Therefore は結果、In addition は追加で、ここでは対比を示せない。\n【元弱点とのつながり】接続関係: 思い込みと実際の事実の逆接を読む。\n【戦略分類】A/B: only と also の対比を拾う。"
  },
  {
    "skill": "connector",
    "type": "choice",
    "targetId": "connector-logic",
    "examFormat": "choice",
    "id": "lco22",
    "focusTag": "connector-contrast-limit",
    "level": 3,
    "sourceComparison": "2020大問6問4型: 前文で制限を述べ、後文でそれでも得られる利点を示す逆接。 / reading50 loop2で選択肢を過去問主要セットへ締め直し。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】The new reading app does not make students love books immediately. Some students still prefer games and videos after using it for a few weeks. (     ), the app helps many of them read a little longer each day because it shows their progress clearly.",
    "options": [
      "For example",
      "As a result",
      "However",
      "In other words"
    ],
    "answer": 2,
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】does not make students love books immediately / the app helps many of them read a little longer each day\n【根拠英文和訳】すぐに本好きにするわけではないが、多くの生徒が毎日少し長く読む助けになる。\n【なぜ正解か】限界を述べた後に利点を述べているため逆接の However が合う。\n【他選択肢】For example は例、Because は理由、Otherwise は『そうでなければ』で文脈に合わない。\n【元弱点とのつながり】接続関係: マイナス情報の後のプラス情報を読む。\n【戦略分類】B: 前後の評価の向きが変わることを読む。"
  },
  {
    "id": "lco23",
    "focusTag": "connector-example",
    "level": 3,
    "sourceComparison": "2022大問6問2型: 抽象説明のあとに具体例を導入する接続関係。選択肢は For example / However / In other words / As a result 系に限定。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】Some students do small actions to reduce waste at school. They bring their own water bottles, use both sides of each sheet of paper, and repair old files instead of buying new ones. (     ), one class collected notebooks that still had many blank pages and turned them into practice books for younger students.",
    "options": [
      "However",
      "In other words",
      "As a result",
      "For example"
    ],
    "answer": 3,
    "targetId": "connector-logic",
    "explanation": "【正解】For example\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Some students do small actions to reduce waste at school. They bring their own water bottles, use both sides of each sheet of paper, and repair old files instead of buying new ones. (     ), one class collected notebooks that still had many blank pages and turned them into practice books for younger students.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の文で一般的な内容を述べ、その後に具体例を出している。」\n【なぜ正解か】For example はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco24",
    "focusTag": "connector-contrast",
    "level": 3,
    "sourceComparison": "2021大問6問4型: 一般的な思い込みと実際の事実を対比する However 型。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】Many people think a library is a silent place where students only read books alone. (     ), the new city library also has discussion rooms, science workshops, and a corner where children can listen to stories read aloud.",
    "options": [
      "For example",
      "However",
      "As a result",
      "In other words"
    ],
    "answer": 1,
    "targetId": "connector-logic",
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Many people think a library is a silent place where students only read books alone. (     ), the new city library also has discussion rooms, science workshops, and a corner where children can listen to stories read aloud.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容と後の内容が対立・逆接の関係になっている。」\n【なぜ正解か】However はこの前後関係を最も自然につなぐ。\n【他選択肢】For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco25",
    "focusTag": "connector-contrast-limit",
    "level": 3,
    "sourceComparison": "2020大問6問4型: まだ制限が残る一方で、重要な利点があることを示す However 型。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】The school’s new lunch system cannot solve every problem. Students still have to wait in line, and popular meals sometimes run out before the last class arrives. (     ), the system helps the kitchen know in advance how many meals to prepare, so there is much less food waste.",
    "options": [
      "For example",
      "In other words",
      "However",
      "As a result"
    ],
    "answer": 2,
    "targetId": "connector-logic",
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】The school’s new lunch system cannot solve every problem. Students still have to wait in line, and popular meals sometimes run out before the last class arrives. (     ), the system helps the kitchen know in advance how many meals to prepare, so there is much less food waste.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容と後の内容が対立・逆接の関係になっている。」\n【なぜ正解か】However はこの前後関係を最も自然につなぐ。\n【他選択肢】For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco26",
    "focusTag": "connector-restatement",
    "level": 3,
    "sourceComparison": "2020〜2022説明文型: 前文の内容を別表現で言い換える関係。In other words は誤答選択肢としても出るため、使う場面を限定して判断させる。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】The new app does not teach students by giving long lectures. It watches which words each student often forgets and then gives extra practice only for those words. (     ), the app changes the lesson to match each learner’s weak points.",
    "options": [
      "However",
      "For example",
      "As a result",
      "In other words"
    ],
    "answer": 3,
    "targetId": "connector-logic",
    "explanation": "【正解】In other words\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】The new app does not teach students by giving long lectures. It watches which words each student often forgets and then gives extra practice only for those words. (     ), the app changes the lesson to match each learner’s weak points.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容を、後の文で別の表現に言い換えている。」\n【なぜ正解か】In other words はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco27",
    "focusTag": "connector-result",
    "level": 3,
    "sourceComparison": "2020〜2022説明文型: 前後の因果・結果を読む。As a result は接続語選択肢として現れるため、結果関係でのみ選ばせる。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】The town replaced the narrow road near the station with a wider walking path. It also added lights and painted a separate lane for bicycles. (     ), fewer students were late because of crowded sidewalks, and there were no bicycle accidents there the next month.",
    "options": [
      "As a result",
      "However",
      "For example",
      "In other words"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】As a result\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】The town replaced the narrow road near the station with a wider walking path. It also added lights and painted a separate lane for bicycles. (     ), fewer students were late because of crowded sidewalks, and there were no bicycle accidents there the next month.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の取り組み・変化が原因となり、後の結果が生じている。」\n【なぜ正解か】As a result はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco28",
    "focusTag": "connector-example",
    "level": 3,
    "sourceComparison": "2022大問6問2型: 定義・一般説明のあとに具体例を導入する For example 型。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】A community center can help elderly people stay connected with others. (     ), some centers hold morning exercise classes, teach smartphone use, and arrange small lunch groups for people who live alone.",
    "options": [
      "However",
      "As a result",
      "For example",
      "In other words"
    ],
    "answer": 2,
    "targetId": "connector-logic",
    "explanation": "【正解】For example\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】A community center can help elderly people stay connected with others. (     ), some centers hold morning exercise classes, teach smartphone use, and arrange small lunch groups for people who live alone.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の文で一般的な内容を述べ、その後に具体例を出している。」\n【なぜ正解か】For example はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco29",
    "focusTag": "connector-contrast",
    "level": 3,
    "sourceComparison": "2021大問6問4型: 『そう思われている』内容を、実際の説明でくつがえす However 型。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】At first, the animal shelter expected the oldest dogs to be the least popular. Many visitors said they wanted young pets that could run and play for many years. (     ), several older dogs were adopted quickly because families liked how calm and gentle they were.",
    "options": [
      "For example",
      "In other words",
      "As a result",
      "However"
    ],
    "answer": 3,
    "targetId": "connector-logic",
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】At first, the animal shelter expected the oldest dogs to be the least popular. Many visitors said they wanted young pets that could run and play for many years. (     ), several older dogs were adopted quickly because families liked how calm and gentle they were.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容と後の内容が対立・逆接の関係になっている。」\n【なぜ正解か】However はこの前後関係を最も自然につなぐ。\n【他選択肢】For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco30",
    "focusTag": "connector-result",
    "level": 3,
    "sourceComparison": "2020〜2022説明文型: 原因となる取り組みとその結果を複数文で結ぶ As a result 型。 / reading50-loop3で選択肢位置を偏らせないよう再配置。",
    "prompt": "【オリジナル類題】The school placed clear recycling boxes beside every classroom door and asked student leaders to check them every Friday. Teachers also explained which items belonged in each box. (     ), students made fewer mistakes when throwing away paper, cans, and plastic bottles.",
    "options": [
      "However",
      "As a result",
      "For example",
      "In other words"
    ],
    "answer": 1,
    "targetId": "connector-logic",
    "explanation": "【正解】As a result\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】The school placed clear recycling boxes beside every classroom door and asked student leaders to check them every Friday. Teachers also explained which items belonged in each box. (     ), students made fewer mistakes when throwing away paper, cans, and plastic bottles.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の取り組み・変化が原因となり、後の結果が生じている。」\n【なぜ正解か】As a result はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lin15",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "insertion-conclusion",
    "examFormat": "position-choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “This experience taught the club that changing plans could save an event.”\nThe hiking club wanted to climb a small mountain on Saturday. [1] On Friday evening, the forecast warned of heavy rain and strong wind. [2] A parent suggested using an indoor climbing gym instead, and the members agreed. [3] They met there the next day and practiced safely for three hours. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 3,
    "explanation": "【正解】エ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】A parent suggested using an indoor climbing gym instead, and the members agreed. / They met there the next day and practiced safely for three hours.\n【根拠英文和訳】親が屋内クライミングジムを使う代案を出し、部員たちは同意した。その翌日、部員たちはそこで安全に3時間練習した。\n【なぜ正解か】挿入文は「この経験が教えたこと」という結論なので、予定変更と実際の活動が終わった後に入るのが自然。\n【他選択肢が違う理由】[1]はまだ問題も変更も出ていない。[2]は雨の予報だけで、何を学んだか言えない。[3]は代案の直後で、実際に活動した経験がまだない。\n【弱点】文挿入では、指示語Thisが何を受けるかと、結論を置く位置を確認する。\n【戦略】B：挿入文が結論なら、原因・行動・結果がそろった後を探す。\n【過去問比較】文挿入は接続語だけでなく、指示語と時系列の両方で位置を決める。"
  },
  {
    "id": "lin16",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "insertion-conclusion",
    "examFormat": "position-choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “This careful wording helped the poster teach students without giving false information.”\nThe environmental club designed a poster about plastic bottles. [1] At first, the poster said that all plastic bottles were useless trash. [2] Their teacher explained that bottles could be recycled if they were collected correctly. [3] The members changed the message to ask students to recycle bottles instead of throwing them away. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 3,
    "explanation": "【正解】エ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】Their teacher explained that bottles could be recycled if they were collected correctly. / The members changed the message to ask students to recycle bottles instead of throwing them away.\n【根拠英文和訳】先生は、正しく回収すればボトルはリサイクルできると説明した。部員たちは、ボトルを捨てずにリサイクルするよう呼びかける内容へ変更した。\n【なぜ正解か】挿入文のThis careful wordingは、修正後の表現を受ける。したがって、メッセージ変更の後に置くのが自然。\n【他選択肢が違う理由】[1]はposterの内容がまだない。[2]は誤った表現の直後でcareful wordingではない。[3]は先生の説明の直後で、修正後の表現がまだ出ていない。\n【弱点】文挿入では、Thisが受ける直前内容と、評価文が置けるタイミングを見る。\n【戦略】B：This + 形容詞 + 名詞は、直前にその内容が出ているか確認する。\n【過去問比較】指示語と前後の因果を合わせて位置を決める型。"
  },
  {
    "id": "lin17",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "insertion-conclusion",
    "examFormat": "position-choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “As a result, the teacher decided to use both activities in future lessons.”\nMs. Arai wanted her students to remember new English words. [1] One group wrote the words in notebooks, while another group acted them out in short scenes. [2] The notebook group remembered the spelling better, but the acting group remembered the meanings better. [3] Both methods had different strengths. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 3,
    "explanation": "【正解】エ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】The notebook group remembered the spelling better, but the acting group remembered the meanings better. / Both methods had different strengths.\n【根拠英文和訳】ノートのグループはつづりをよりよく覚え、演じるグループは意味をよりよく覚えた。両方の方法には異なる強みがあった。\n【なぜ正解か】両方に強みがあると分かった結果として、先生が両方を使うと決める流れが自然。\n【他選択肢が違う理由】[1]は活動内容がまだない。[2]は結果がまだない。[3]は結果は出たが、両方に強みがあるというまとめの前なので少し早い。\n【弱点】文挿入では、結果を述べる文は原因・比較・まとめの後に置く。\n【戦略】B：As a resultは、結果の原因が前に十分そろっている位置を探す。\n【過去問比較】原因・結果・比較の流れを見て位置を決める。"
  },
  {
    "id": "lin18",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "insertion-conclusion",
    "examFormat": "position-choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “This showed the students that local history could still affect their daily lives.”\nA class studied an old stone wall near their school. [1] They learned that it had once protected houses from flood water. [2] Later, they compared an old map with the streets they used every day. [3] They realized that several roads still followed the shape of the wall. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 3,
    "explanation": "【正解】エ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】They compared an old map with the streets they used every day. / They realized that several roads still followed the shape of the wall.\n【根拠英文和訳】生徒たちは古い地図と毎日使う道を比べ、いくつかの道路が今もその石垣の形に沿っていることに気づいた。\n【なぜ正解か】挿入文は、この発見全体から得た結論を述べているため、発見の後に置くのが自然。\n【他選択肢が違う理由】[1]は研究対象しか出ていない。[2]は昔の役割だけでdaily livesにつながらない。[3]は比較の前で、現代の道路との関係がまだない。\n【弱点】文挿入では、Thisがどの出来事全体を指すか、結論がどこに置けるかを考える。\n【戦略】B：This showed... は前の発見・結果全体を受けることが多い。\n【過去問比較】指示語Thisと段落の結論位置を組み合わせて判断する。"
  }
];
for(const q of additions){ B.push(q); }
window.DRILLS=B;
})();
