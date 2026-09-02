(()=>{
"use strict";
const B=window.DRILLS||[];
const retireIds=new Set(["lco04","lco05","lco06","lco07","lco08","lco09","lco10","lco11"]);
for(const q of B){
  if(retireIds.has(q.id)){
    q.retired=true; q.retiredBy="reading50-loop2"; q.legacyCompletion=true;
    q.retiredReason="reading50 loop2: connectorを過去問直接対応型へ締め直すため、広げすぎた接続表現を非破壊retire。";
  }
}
const tightenExisting = {
  "lco02": ["However","For example","As a result","In other words"],
  "lco03": ["However","For example","As a result","In other words"]
};
for(const q of B){
  if(!q.retired && tightenExisting[q.id]){
    q.options = tightenExisting[q.id];
    q.answer = 0;
    q.sourceComparison = (q.sourceComparison||"") + " / reading50 loop2で選択肢を過去問主要セットへ締め直し。";
  }
}
const replacements=[
  {
    "id": "lco12",
    "focusTag": "connector-example",
    "level": 3,
    "sourceComparison": "2022大問6問2型: 抽象説明のあとに具体例を導入する接続関係。選択肢は For example / However / In other words / As a result 系に限定。",
    "prompt": "【オリジナル類題】Some students do small actions to reduce waste at school. They bring their own water bottles, use both sides of each sheet of paper, and repair old files instead of buying new ones. (     ), one class collected notebooks that still had many blank pages and turned them into practice books for younger students.",
    "options": [
      "For example",
      "However",
      "In other words",
      "As a result"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】For example\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Some students do small actions to reduce waste at school. They bring their own water bottles, use both sides of each sheet of paper, and repair old files instead of buying new ones. (     ), one class collected notebooks that still had many blank pages and turned them into practice books for younger students.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の文で一般的な内容を述べ、その後に具体例を出している。」\n【なぜ正解か】For example はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco13",
    "focusTag": "connector-contrast",
    "level": 3,
    "sourceComparison": "2021大問6問4型: 一般的な思い込みと実際の事実を対比する However 型。",
    "prompt": "【オリジナル類題】Many people think a library is a silent place where students only read books alone. (     ), the new city library also has discussion rooms, science workshops, and a corner where children can listen to stories read aloud.",
    "options": [
      "However",
      "For example",
      "As a result",
      "In other words"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Many people think a library is a silent place where students only read books alone. (     ), the new city library also has discussion rooms, science workshops, and a corner where children can listen to stories read aloud.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容と後の内容が対立・逆接の関係になっている。」\n【なぜ正解か】However はこの前後関係を最も自然につなぐ。\n【他選択肢】For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco14",
    "focusTag": "connector-contrast-limit",
    "level": 3,
    "sourceComparison": "2020大問6問4型: まだ制限が残る一方で、重要な利点があることを示す However 型。",
    "prompt": "【オリジナル類題】The school’s new lunch system cannot solve every problem. Students still have to wait in line, and popular meals sometimes run out before the last class arrives. (     ), the system helps the kitchen know in advance how many meals to prepare, so there is much less food waste.",
    "options": [
      "However",
      "For example",
      "In other words",
      "As a result"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】The school’s new lunch system cannot solve every problem. Students still have to wait in line, and popular meals sometimes run out before the last class arrives. (     ), the system helps the kitchen know in advance how many meals to prepare, so there is much less food waste.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容と後の内容が対立・逆接の関係になっている。」\n【なぜ正解か】However はこの前後関係を最も自然につなぐ。\n【他選択肢】For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco15",
    "focusTag": "connector-restatement",
    "level": 3,
    "sourceComparison": "2020〜2022説明文型: 前文の内容を別表現で言い換える関係。In other words は誤答選択肢としても出るため、使う場面を限定して判断させる。",
    "prompt": "【オリジナル類題】The new app does not teach students by giving long lectures. It watches which words each student often forgets and then gives extra practice only for those words. (     ), the app changes the lesson to match each learner’s weak points.",
    "options": [
      "In other words",
      "However",
      "For example",
      "As a result"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】In other words\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】The new app does not teach students by giving long lectures. It watches which words each student often forgets and then gives extra practice only for those words. (     ), the app changes the lesson to match each learner’s weak points.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容を、後の文で別の表現に言い換えている。」\n【なぜ正解か】In other words はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco16",
    "focusTag": "connector-result",
    "level": 3,
    "sourceComparison": "2020〜2022説明文型: 前後の因果・結果を読む。As a result は接続語選択肢として現れるため、結果関係でのみ選ばせる。",
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
    "id": "lco17",
    "focusTag": "connector-example",
    "level": 3,
    "sourceComparison": "2022大問6問2型: 定義・一般説明のあとに具体例を導入する For example 型。",
    "prompt": "【オリジナル類題】A community center can help elderly people stay connected with others. (     ), some centers hold morning exercise classes, teach smartphone use, and arrange small lunch groups for people who live alone.",
    "options": [
      "For example",
      "However",
      "As a result",
      "In other words"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】For example\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】A community center can help elderly people stay connected with others. (     ), some centers hold morning exercise classes, teach smartphone use, and arrange small lunch groups for people who live alone.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の文で一般的な内容を述べ、その後に具体例を出している。」\n【なぜ正解か】For example はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco18",
    "focusTag": "connector-contrast",
    "level": 3,
    "sourceComparison": "2021大問6問4型: 『そう思われている』内容を、実際の説明でくつがえす However 型。",
    "prompt": "【オリジナル類題】At first, the animal shelter expected the oldest dogs to be the least popular. Many visitors said they wanted young pets that could run and play for many years. (     ), several older dogs were adopted quickly because families liked how calm and gentle they were.",
    "options": [
      "However",
      "For example",
      "In other words",
      "As a result"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】At first, the animal shelter expected the oldest dogs to be the least popular. Many visitors said they wanted young pets that could run and play for many years. (     ), several older dogs were adopted quickly because families liked how calm and gentle they were.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の内容と後の内容が対立・逆接の関係になっている。」\n【なぜ正解か】However はこの前後関係を最も自然につなぐ。\n【他選択肢】For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。As a resultは結果を表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  },
  {
    "id": "lco19",
    "focusTag": "connector-result",
    "level": 3,
    "sourceComparison": "2020〜2022説明文型: 原因となる取り組みとその結果を複数文で結ぶ As a result 型。",
    "prompt": "【オリジナル類題】The school placed clear recycling boxes beside every classroom door and asked student leaders to check them every Friday. Teachers also explained which items belonged in each box. (     ), students made fewer mistakes when throwing away paper, cans, and plastic bottles.",
    "options": [
      "As a result",
      "However",
      "For example",
      "In other words"
    ],
    "answer": 0,
    "targetId": "connector-logic",
    "explanation": "【正解】As a result\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】The school placed clear recycling boxes beside every classroom door and asked student leaders to check them every Friday. Teachers also explained which items belonged in each box. (     ), students made fewer mistakes when throwing away paper, cans, and plastic bottles.\n【根拠英文和訳】空所の前後を読み、前の説明と後の説明がどの論理関係でつながるかを判断する。ここでは「前の取り組み・変化が原因となり、後の結果が生じている。」\n【なぜ正解か】As a result はこの前後関係を最も自然につなぐ。\n【他選択肢】Howeverは逆接を表すが、この文脈の中心関係とは合わない。For exampleは具体例導入を表すが、この文脈の中心関係とは合わない。In other wordsは言い換えを表すが、この文脈の中心関係とは合わない。\n【元弱点とのつながり】接続関係: 単語暗記ではなく、前後文の役割を読んで論理関係を選ぶ。\n【戦略分類】A/B: 空所の直前だけでなく直後まで読めば安定して取れる。",
    "skill": "connector",
    "type": "choice"
  }
];
B.push(...replacements);
const insertionTranslations={
  "lin01": "植物が音楽室の近くで速く育つように見えたため、音が成長に影響するのかを疑問に思った。その考えを試すため、静かな部屋と音楽の近くに植物を置く実験へ進む。",
  "lin02": "自転車レーンにより通学者が増え、駅周辺の交通は減った。しかしその利点には、川沿いを歩く人のスペースが減るという予想外の問題が伴った。",
  "lin03": "最初の調査は10人だけだったが、2回目は年齢の異なる200人を対象にした。この差によって、2回目の結果の方が信頼できるものになった。",
  "lin04": "土曜日から日曜日に変更したが、日曜日も嵐になる予報が出た。そのため、予定をもう一度変更し、学校ホールで開催する流れになる。",
  "lin05": "鳥が家族ではない相手に食べ物を分ける理由が問題になっている。その疑問を答えるために、研究チームが観察を始める。",
  "lin06": "村役場は2010年に初めてコンピューターを受け取った。それ以前は村で誰もコンピューターを使ったことがなく、最初は手書きに頼っていた。",
  "lin07": "1回目の検査では水は安全だったが、2回目の検査では有害な金属が見つかった。この2つの結果が一致しなかったため、機械の確認へ進む。",
  "lin08": "新しい仕分け機は作業を速くしたが、汚れたボトルは人が取り除く必要が残った。つまり機械は助けにはなったが、すべてを解決したわけではない。",
  "lin09": "1つ目のグループはタブレット、2つ目は紙カード、3つ目は特別な道具なしで学習した。3つ目のグループは比較対象として働いた。",
  "lin10": "若い鳥は最初、箱の開け方を知らなかった。生まれつき分かっていたのではなく、年上の鳥を見てその技能を学んだ。",
  "lin11": "朝7時開始を予定していたが、唯一のバスは8時半にしか着かなかった。これが最初の計画が失敗した理由で、その後は時刻表を確認するようになった。",
  "lin12": "研究チームは大きな魚が小さな魚を追い払うと予想していた。しかし映像では小さな魚が食べ物に近づいたため、発見は予想と逆でチームを驚かせた。",
  "lin13": "メディアの授業は、誤った情報を信じない方法を教える内容だった。たとえばオンライン写真の出所を確認する練習は、その具体例になる。",
  "lin14": "学校は自転車置き場近くに明るい照明を設置し、生徒が段差を見やすくなった。その結果、翌月には事故の数が減った。"
};
for(const q of B){
  if(!q.retired && q.skill==="insertion" && insertionTranslations[q.id]){
    q.explanation = q.explanation.replace(/【根拠英文和訳】[\s\S]*?【なぜ正解か】/, "【根拠英文和訳】"+insertionTranslations[q.id]+"\n【なぜ正解か】");
    if(!q.explanation.includes("【過去問比較】")){
      q.explanation += "\n【過去問比較】文挿入は、指示語・接続語・時系列・因果など複数根拠で位置を決める。";
    }
  }
}
window.DRILLS=B;
})();