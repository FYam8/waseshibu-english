(()=> {
"use strict";
const B = window.DRILLS || [];
const retireIds = new Set(["lrs02","lrs04"]);
const reason = "reason10 loop4: 独立精査で、理由が正解選択肢に直結しやすく、過去問型の前後文脈復元として軽いと判定。既存履歴保護のため非破壊retire。";
for (const q of B) {
  if (retireIds.has(q.id)) {
    q.retired = true;
    q.retiredReason = reason;
    q.legacyCompletion = true;
  }
}
const replacements = [
  {
    "id": "lrs15",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-obstacle",
    "examFormat": "choice",
    "familyId": "loop4-reason-bridge-repair",
    "sourceComparison": "2024大問5問2・2026大問7問3型: 直接の理由語ではなく、複数の状況情報から行動理由を復元する。",
    "prompt": "【オリジナル類題】Ken usually crossed the old bridge to reach the library. On Monday afternoon, his friend said the bridge might be open again, so Ken walked toward it. When he arrived, he saw two workers replacing wooden boards, orange cones across the entrance, and a small group of students turning back. Ken checked his map and took a longer street around the river. Why did Ken choose the longer street?",
    "options": [
      "He wanted to help the workers repair the wooden boards.",
      "He thought the usual bridge could not be used safely yet.",
      "He had promised to meet the students near the river.",
      "He learned that the library had moved to another street."
    ],
    "answer": 1,
    "explanation": "【正解】He thought the usual bridge could not be used safely yet. 【設問和訳】なぜケンは遠回りの道を選んだのか。 【根拠英文】he saw two workers replacing wooden boards, orange cones across the entrance, and a small group of students turning back. Ken checked his map and took a longer street around the river. 【根拠英文和訳】彼は作業員が木の板を交換しているのを見て、入口にはオレンジ色のコーンが置かれ、生徒たちが引き返していた。ケンは地図を確認して川を回る遠い道を選んだ。 【なぜ正解か】友人の情報では開いている可能性があったが、現場の工事・通行止めの様子・他の生徒の行動から、橋はまだ安全に使えないと判断したと分かる。 【他選択肢】作業を手伝う、学生に会う、図書館移転はいずれも本文にない。 【弱点】理由・動機。1語の標識だけでなく、複数の状況描写をつないで行動理由を読む。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs16",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-delay",
    "examFormat": "choice",
    "familyId": "loop4-reason-report-upload-delay",
    "sourceComparison": "2025大問5問5・2026大問7問3型: その後の行動と時系列を追って、遅れた理由を復元する。",
    "prompt": "【オリジナル類題】Sota finished his science report before dinner and planned to send it from home. The final file was saved only on his laptop. When he opened it, the screen became dark, and he remembered that the charging cable was in his classroom. He tried to send a photo of his notebook with his phone, but the teacher had asked for the typed file. The next morning, Sota went to the computer room early and sent the report before class. Why was Sota's report sent later than he had planned?",
    "options": [
      "He had to use the typed file, but he could not use his laptop at home that night.",
      "He decided to change the topic after reading his notebook again.",
      "His teacher told him to bring a paper copy instead of sending a file.",
      "The computer room was too crowded for him to use before class."
    ],
    "answer": 0,
    "explanation": "【正解】He had to use the typed file, but he could not use his laptop at home that night. 【設問和訳】なぜソウタのレポートは予定より遅れて送られたのか。 【根拠英文】The final file was saved only on his laptop. / the screen became dark, and he remembered that the charging cable was in his classroom. / the teacher had asked for the typed file. / The next morning, Sota went to the computer room early and sent the report before class. 【根拠英文和訳】完成ファイルは彼のノートパソコンにだけ保存されていた。／画面が暗くなり、充電ケーブルが教室にあることを思い出した。／先生はタイプしたファイルを求めていた。／翌朝、ソウタは早くコンピュータ室へ行き、授業前にレポートを送った。 【なぜ正解か】家で送るにはノートパソコン内の完成ファイルが必要だったが、充電できず使えなかった。写真では条件を満たさないため、翌朝学校のコンピュータ室から送ったと判断できる。 【他選択肢】トピック変更、紙提出、コンピュータ室の混雑は本文にない。 【弱点】理由・動機。時系列と提出条件をつないで、遅れた理由を復元する。 【戦略】B（非公式）。"
  }
];
const existing = new Set(B.map(q => q.id));
for (const q of replacements) {
  if (!existing.has(q.id)) B.push(q);
}
window.DRILLS = B;
})();