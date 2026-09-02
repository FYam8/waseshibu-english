(()=>{
"use strict";
const B = window.DRILLS || [];
const retireIds = new Set(["cx01","cx02","xcx1","xcx2","xcx3","xcx4","xcx5","xcx6","xcx7","xcx8"]);
const retireReason = "context10 loop2: 文脈問題としては成立するが、感情語当て・短文語彙当てに偏り、過去問型の空所前後から語句・発言を選ぶ処理として軽いため、既存履歴保護のため非破壊retire。";
for (const q of B) {
  if (retireIds.has(q.id)) {
    q.retired = true;
    q.retiredBy = "context10-loop2";
    q.retiredReason = retireReason;
    q.legacyCompletion = true;
  }
}
const replacements = [
  {
    id:"lcx01",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-dialogue-fit",
    focusTag:"context-dialogue-next-action",
    familyId:"context-loop2-dialogue-plan-after-delay",
    sourceComparison:"2026大問7問1型: 会話の直前の態度と状況から、空所に入る自然な発言を選ぶ。",
    prompt:"【オリジナル類題】\nMika: Did you send the history file to Ms. Green?\nLeo: Not yet. I saved the final version on the classroom computer, but the classroom is locked now. Ms. Green said she would check our files before lunch tomorrow.\nMika: Then what are you going to do?\nLeo: (     )",
    options:[
      "I'll go early tomorrow and send it before she checks.",
      "I already sent the file from my phone yesterday.",
      "Ms. Green should stop teaching history next year.",
      "The classroom computer is newer than mine."
    ],
    answer:0,
    explanation:"【正解】A\n【設問和訳】Leoの最後の発言として最も自然なものを選ぶ。\n【根拠英文】I saved the final version on the classroom computer, but the classroom is locked now. / Ms. Green said she would check our files before lunch tomorrow.\n【根拠英文和訳】完成版は教室のコンピューターに保存したが、今は教室が施錠されている。先生は明日の昼食前にファイルを確認すると言った。\n【なぜ正解か】今は送れないが、明日の昼前までに送れば間に合うので「明日早く行って送る」が自然。\n【他選択肢】BはNot yetと矛盾。Cは話題がずれる。Dは比較情報で返答にならない。\n【元弱点とのつながり】文脈: 空所前の条件と締切を合わせて自然な発言を選ぶ。\n【戦略分類】A/B: 情報を2つつなげれば取れる標準問題。"
  },
  {
    id:"lcx02",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-dialogue-fit",
    focusTag:"context-dialogue-correction",
    familyId:"context-loop2-dialogue-misunderstanding",
    sourceComparison:"2026大問7問2型: 前後の会話から、相手の発言に合う語句・反応を選ぶ。",
    prompt:"【オリジナル類題】\nAya: I heard the science fair was canceled.\nBen: Not exactly. The outdoor part was canceled because of the storm, but the projects will still be shown in the gym.\nAya: Oh, I misunderstood. So should I still bring my model?\nBen: (     )",
    options:[
      "Yes, the place changed, but the fair is still happening.",
      "No, the gym was destroyed by the storm.",
      "Yes, but you should leave it outside in the rain.",
      "No, science projects are not allowed at a fair."
    ],
    answer:0,
    explanation:"【正解】A\n【設問和訳】Benの最後の発言として最も自然なものを選ぶ。\n【根拠英文】The outdoor part was canceled... but the projects will still be shown in the gym.\n【根拠英文和訳】屋外部分は中止されたが、作品は体育館で展示される。\n【なぜ正解か】中止ではなく場所変更なので、模型を持ってくるべきだと分かる。\n【他選択肢】Bは本文にない。Cはstormと矛盾。Dはscience fair自体と矛盾。\n【元弱点とのつながり】文脈: 誤解を修正する会話の流れを読む。\n【戦略分類】A: but以降の情報更新を拾う問題。"
  },
  {
    id:"lcx03",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-lexical-fit",
    focusTag:"context-lexical-cause-result",
    familyId:"context-loop2-lexical-overcrowded",
    sourceComparison:"2026大問5型: 定義単独ではなく、前後の状況に合う語を選ぶ。",
    prompt:"【オリジナル類題】\nThe small elevator could carry only six people. At the end of the concert, more than twenty people tried to get into it at the same time. The door would not close, and the guard asked half of them to wait. The elevator was too (     ).",
    options:["crowded","silent","useful","ordinary"],
    answer:0,
    explanation:"【正解】A crowded\n【設問和訳】空所に入る最も自然な語を選ぶ。\n【根拠英文】more than twenty people tried to get into it at the same time / The door would not close\n【根拠英文和訳】20人以上が同時に乗ろうとし、ドアが閉まらなかった。\n【なぜ正解か】人が多すぎる状態なのでcrowdedが合う。\n【他選択肢】silentは音、usefulは有用性、ordinaryは普通という意味で文脈に合わない。\n【元弱点とのつながり】文脈: 前後の具体状況から語を選ぶ。\n【戦略分類】A: 具体描写から語義を確定する基本問題。"
  },
  {
    id:"lcx04",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-sentence-fit",
    focusTag:"context-sentence-generalization",
    familyId:"context-loop2-sentence-library-tools",
    sourceComparison:"2024大問6問5型: 前後の段落論理から空所に入る文を選ぶ。",
    prompt:"【オリジナル類題】\nThe town library used to lend only books and DVDs. Last year, it started a new service and bought tools such as drills, small saws, and garden scissors. (     ) This helped people repair things at home without buying tools they would use only once or twice.",
    options:[
      "People could borrow these tools for a few days, just like books.",
      "The library closed all of its reading rooms last year.",
      "Many people decided to stop repairing things at home.",
      "The tools were displayed in a museum but could not be touched."
    ],
    answer:0,
    explanation:"【正解】A\n【設問和訳】空所に入る最も自然な文を選ぶ。\n【根拠英文】started a new service and bought tools / This helped people repair things at home without buying tools\n【根拠英文和訳】新サービスとして道具を買った。それにより人々は道具を買わずに家で修理できた。\n【なぜ正解か】前文のtoolsと後文のThisをつなぐには、道具を借りられるという文が必要。\n【他選択肢】Bは新サービスとつながらない。Cはhelped repairと逆。Dはborrow/useの流れを作れない。\n【元弱点とのつながり】文脈: 前後の指示語Thisと話題の連続を使う。\n【戦略分類】B: 前後2文を照合する標準問題。"
  },
  {
    id:"lcx05",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-sentence-fit",
    focusTag:"context-sentence-experiment-control",
    familyId:"context-loop2-sentence-fair-test",
    sourceComparison:"2022大問6・2023大問6型: 実験や研究の流れの中で、必要な一文を前後から選ぶ。",
    prompt:"【オリジナル類題】\nRina wanted to know which plant food worked best. At first, she put one plant near the window and another in a dark corner. After a week, the plant near the window grew faster. Her teacher told her that sunlight, not plant food, might have changed the result. (     ) Then she tested the plant foods again.",
    options:[
      "Rina moved both plants under the same lamp and gave them the same amount of water.",
      "Rina threw away the plant food and studied fish instead.",
      "Rina opened the window wider so only one plant could get more light.",
      "Rina wrote that plants never need sunlight."
    ],
    answer:0,
    explanation:"【正解】A\n【設問和訳】実験の流れに合う文を選ぶ。\n【根拠英文】sunlight, not plant food, might have changed the result / Then she tested the plant foods again.\n【根拠英文和訳】日光が結果を変えた可能性がある。その後、彼女は植物用栄養剤を再び試した。\n【なぜ正解か】公平に再実験するには、日光や水の条件を同じにする必要がある。\n【他選択肢】Bは実験継続と矛盾。Cは条件差を広げる。Dは本文内容と逆。\n【元弱点とのつながり】文脈: 研究の問題点→改善→再実験の流れを読む。\n【戦略分類】B: 実験文脈の標準問題。"
  },
  {
    id:"lcx06",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-dialogue-fit",
    focusTag:"context-dialogue-offer",
    familyId:"context-loop2-dialogue-help-offer",
    sourceComparison:"2019〜2021会話空所型: 直前の問題点に対して自然な返答を選ぶ。",
    prompt:"【オリジナル類題】\nTom: I have to carry these posters to the hall, but the box is heavier than I expected.\nSara: The hall is on the third floor, right?\nTom: Yes, and the elevator is not working today.\nSara: (     )",
    options:[
      "I'll help you carry some of them upstairs.",
      "I painted the posters blue yesterday.",
      "The third floor is usually above the second floor.",
      "You should make the box heavier."
    ],
    answer:0,
    explanation:"【正解】A\n【設問和訳】Saraの返答として最も自然なものを選ぶ。\n【根拠英文】the box is heavier than I expected / the elevator is not working today\n【根拠英文和訳】箱が思ったより重く、エレベーターも使えない。\n【なぜ正解か】困っている相手に対し、運ぶのを手伝う返答が自然。\n【他選択肢】Bは過去の色の話でずれる。Cは常識説明で会話にならない。Dは逆効果。\n【元弱点とのつながり】文脈: 会話の問題点を受けて自然な発言を選ぶ。\n【戦略分類】A: 状況把握で取る基本問題。"
  },
  {
    id:"lcx07",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-lexical-fit",
    focusTag:"context-lexical-precise-word",
    familyId:"context-loop2-lexical-reliable",
    sourceComparison:"2021〜2026の文脈語彙型: 単語の一般意味だけでなく、前後文脈に合う語を選ぶ。",
    prompt:"【オリジナル類題】\nThe hiking group checked two websites before leaving. One site had not been updated for three months, but the park office page showed today's weather warning and the latest trail information. The leader chose the park office page because it was more (     ).",
    options:["reliable","dangerous","expensive","ancient"],
    answer:0,
    explanation:"【正解】A reliable\n【設問和訳】空所に入る最も自然な語を選ぶ。\n【根拠英文】today's weather warning and the latest trail information\n【根拠英文和訳】今日の天候警報と最新の登山道情報が載っていた。\n【なぜ正解か】最新で公式性のある情報なので、より信頼できると言える。\n【他選択肢】dangerousは危険、expensiveは高価、ancientは古代のという意味で文脈に合わない。\n【元弱点とのつながり】文脈: 比較される2情報から適語を選ぶ。\n【戦略分類】A/B: 語彙と文脈の両方を見る問題。"
  },
  {
    id:"lcx08",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-sentence-fit",
    focusTag:"context-sentence-contrast",
    familyId:"context-loop2-sentence-contrast",
    sourceComparison:"2021〜2026の説明文空所型: 対比・情報更新を使って空所文を選ぶ。",
    prompt:"【オリジナル類題】\nMany students thought the new school garden would be only for science classes. They expected to look at plants and write reports. (     ) In art, students drew the flowers, and in English, they wrote short poems about the seasons.",
    options:[
      "However, teachers used the garden in several different subjects.",
      "Therefore, all science lessons were canceled.",
      "For example, no one was allowed to enter the garden.",
      "In other words, the garden had no connection to schoolwork."
    ],
    answer:0,
    explanation:"【正解】A\n【設問和訳】空所に入る最も自然な文を選ぶ。\n【根拠英文】only for science classes / In art... and in English...\n【根拠英文和訳】理科だけのためだと思っていた。しかし、美術や英語でも使われた。\n【なぜ正解か】予想と実際の使われ方が対比になっているため、Howeverで複数教科利用を示す文が合う。\n【他選択肢】Bは授業中止の話ではない。Cは後文と矛盾。Dはschoolworkと逆。\n【元弱点とのつながり】文脈: 前後の対比と具体例をつなぐ。\n【戦略分類】B: 接続語だけでなく後文の具体例も見る標準問題。"
  },
  {
    id:"lcx09",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-dialogue-fit",
    focusTag:"context-dialogue-advice",
    familyId:"context-loop2-dialogue-practical-advice",
    sourceComparison:"2026大問6・2024大問4型: 相手の発言内容を受け、後続に自然につながる返答を選ぶ。",
    prompt:"【オリジナル類題】\nHaru: I want to join the photo club, but I don't have a good camera.\nNina: Did you ask the club teacher?\nHaru: No. I thought every member had to bring one from home.\nNina: My brother was in that club last year. They had school cameras for beginners.\nHaru: Really? Then what should I do first?\nNina: (     )",
    options:[
      "You should talk to the teacher before giving up.",
      "You should buy the most expensive camera today.",
      "You should stop taking photos forever.",
      "You should join the swimming team instead because cameras are heavy."
    ],
    answer:0,
    explanation:"【正解】A\n【設問和訳】Ninaの最後の助言として最も自然なものを選ぶ。\n【根拠英文】They had school cameras for beginners. / what should I do first?\n【根拠英文和訳】初心者用の学校カメラがあった。まず何をすべきか尋ねている。\n【なぜ正解か】思い込みであきらめず、先生に確認するのが自然。\n【他選択肢】Bは情報確認前で極端。Cは不自然。Dは話題が大きくずれる。\n【元弱点とのつながり】文脈: 新情報によって助言が変わる会話を読む。\n【戦略分類】A/B: 会話の情報更新を拾う問題。"
  },
  {
    id:"lcx10",
    skill:"context",
    level:3,
    type:"choice",
    targetId:"context-lexical-fit",
    focusTag:"context-lexical-result-state",
    familyId:"context-loop2-lexical-confusing-map",
    sourceComparison:"2024大問5・2026大問7型: 前後の状況と後続行動から適切な語句を選ぶ。",
    prompt:"【オリジナル類題】\nThe school map near the entrance still showed the old room numbers. New students kept walking to the wrong classrooms and asking teachers for help. During lunch, the office staff covered the old map and put up a new one to make the building less (     ).",
    options:["confusing","peaceful","private","creative"],
    answer:0,
    explanation:"【正解】A confusing\n【設問和訳】空所に入る最も自然な語を選ぶ。\n【根拠英文】old room numbers / walking to the wrong classrooms / put up a new one\n【根拠英文和訳】古い教室番号、間違った教室へ行く生徒、新しい地図を掲示する流れ。\n【なぜ正解か】古い地図で混乱が起きていたため、建物を分かりやすくする目的で新地図を出した。\n【他選択肢】peacefulは平和、privateは私的、creativeは創造的で文脈に合わない。\n【元弱点とのつながり】文脈: 問題状況と解決行動から状態を表す語を選ぶ。\n【戦略分類】A: 根拠が近く、60点確保で取りたい問題。"
  }
];

const existing = new Set(B.map(q=>q.id));
for (const q of replacements) {
  if (!existing.has(q.id)) B.push(q);
}
window.DRILLS = B;
})();