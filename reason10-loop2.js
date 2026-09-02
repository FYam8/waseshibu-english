(()=> {
"use strict";
const B = window.DRILLS || [];
const retireIds = new Set(["lrs01","lrs05","lrs06","lrs08"]);
const reason = "reason10 loop2: 個別精査で、誤答構造・根拠範囲・本番相当負荷がやや弱いと判定。既存履歴保護のため非破壊retire。";
for (const q of B) {
  if (retireIds.has(q.id)) {
    q.retired = true;
    q.retiredReason = reason;
    q.legacyCompletion = true;
  }
}
const replacements = [
  {
    "id": "lrs11",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-action-motive",
    "examFormat": "choice",
    "familyId": "loop2-reason-paper-display",
    "sourceComparison": "2024大問5問2・2026大問7問3型: 明示becauseではなく、前後の状況から行動理由を復元する。",
    "prompt": "【オリジナル類題】The art club had made thin paper lanterns for the school garden display. They wanted to hang them after lunch, so the lanterns were still lying on a table near the open door. Just before lunch, Riko saw dark clouds over the field and felt a strong wind blow through the doorway. She asked two club members to carry the lanterns into the corridor. Why did Riko ask them to move the lanterns?",
    "options": [
      "She wanted to stop other students from seeing the finished lanterns.",
      "She thought the weather might damage the lanterns before they were used.",
      "She had decided to cancel the garden display completely.",
      "She wanted the club members to make heavier lanterns."
    ],
    "answer": 1,
    "explanation": "【正解】She thought the weather might damage the lanterns before they were used. 【設問和訳】なぜリコは部員にランタンを移動させるよう頼んだのか。 【根拠英文】Riko saw dark clouds over the field and felt a strong wind blow through the doorway. / the lanterns were still lying on a table near the open door. 【根拠英文和訳】リコは運動場の上に暗い雲を見て、戸口から強い風が吹くのを感じた。／ランタンはまだ開いたドアの近くの机の上に置かれていた。 【なぜ正解か】紙のランタンが外気に近い場所にあり、雨や風で傷む可能性を読み取る。本文にbecauseはないが、天候変化と行動を結びつける。 【他選択肢】完成品を隠す・展示中止・重いランタン作りは本文にない。 【弱点】理由・動機。状況描写から行動理由を復元する。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs12",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-judgment",
    "examFormat": "choice",
    "familyId": "loop2-reason-wallet-teachers",
    "sourceComparison": "2026大問7問3型: 物を拾った後の行動理由を、持ち主情報・周囲状況・本人の判断から読む。",
    "prompt": "【オリジナル類題】After basketball practice, Mari found a wallet on a bench beside the gym. Inside it, she saw a student card with Rika’s name on it, two bus tickets, and some money. Rika had already gone home, and several students were still running around the gym. Mari closed the wallet and took it straight to the teachers’ room. Why did Mari take the wallet there?",
    "options": [
      "She wanted a teacher to keep it safely until it could be returned.",
      "She wanted to use the bus tickets before Rika came back.",
      "She was afraid Rika would ask her to join the basketball team.",
      "She thought the gym bench belonged in the teachers’ room."
    ],
    "answer": 0,
    "explanation": "【正解】She wanted a teacher to keep it safely until it could be returned. 【設問和訳】なぜマリは財布を職員室へ持って行ったのか。 【根拠英文】she saw a student card with Rika’s name on it ... Rika had already gone home, and several students were still running around the gym. 【根拠英文和訳】彼女はリカの名前がある学生証を見た。リカはすでに帰宅しており、体育館ではまだ数人の生徒が走り回っていた。 【なぜ正解か】持ち主は分かったが本人は不在で、財布にはお金もあり、体育館に置いたままでは安全でない。職員室へ届ける行動理由を複数情報から判断する。 【他選択肢】バス券を使う・部活勧誘を恐れる・ベンチを職員室に運ぶは本文にない。 【弱点】理由・判断。人物の行動を、直接理由語ではなく状況の組み合わせから説明する。 【戦略】A〜B（非公式）。"
  },
  {
    "id": "lrs13",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-behavior",
    "examFormat": "choice",
    "familyId": "loop2-reason-chat-not-speaking",
    "sourceComparison": "2024大問5問2型: 行動変化の理由を、直前直後の状況から読む。",
    "prompt": "【オリジナル類題】During an online group meeting, Taro was explaining his idea clearly. Then he looked toward the half-open door, where his mother was carrying his little sister out of the room. The child had finally stopped crying after a long fever. Taro covered his microphone and began writing his answers in the chat box. Why did Taro begin using the chat box?",
    "options": [
      "He wanted to avoid making noise near his sister.",
      "He had forgotten the topic of the meeting.",
      "He wanted his mother to answer for him.",
      "He could not read the messages from his group."
    ],
    "answer": 0,
    "explanation": "【正解】He wanted to avoid making noise near his sister. 【設問和訳】なぜタロウはチャット欄を使い始めたのか。 【根拠英文】The child had finally stopped crying after a long fever. Taro covered his microphone and began writing his answers in the chat box. 【根拠英文和訳】その子は長い熱のあと、ようやく泣き止んだ。タロウはマイクを覆い、チャット欄に答えを書き始めた。 【なぜ正解か】熱で泣いていた妹がようやく落ち着いた直後なので、声を出して起こしたり刺激したりしないために発話から入力へ変えたと判断する。 【他選択肢】話題を忘れた・母に答えさせる・メッセージが読めないは本文にない。 【弱点】理由・行動変化。発話から別行動へ変えた理由を時系列で追う。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs14",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-purpose",
    "examFormat": "choice",
    "familyId": "loop2-reason-sold-out-sign",
    "sourceComparison": "2025大問5問5型: 反応・行動の目的を、直前の状況と相手の立場から読む。",
    "prompt": "【オリジナル類題】The school shop sold notebooks with a special festival cover. A sample notebook was still displayed on the front table, but the last one had been sold before noon. During lunch break, students kept waiting in line and asking the same question about the festival notebook. The shop manager removed the sample and placed a “Sold out” sign beside the counter. Why did the manager put up the sign?",
    "options": [
      "To let students know they could not buy that notebook anymore.",
      "To tell students that all notebooks in the shop were free.",
      "To invite more students to design a new festival cover.",
      "To show that the shop would close before lunch."
    ],
    "answer": 0,
    "explanation": "【正解】To let students know they could not buy that notebook anymore. 【設問和訳】なぜ店長はその表示を出したのか。 【根拠英文】the last one had been sold before noon. / students kept waiting in line and asking the same question about the festival notebook. 【根拠英文和訳】最後の1冊は正午前に売れていた。／生徒たちは列に並び続け、その祭り用ノートについて同じ質問をし続けていた。 【なぜ正解か】商品はすでに売り切れているのに、見本が残っていたため生徒が買えると思って質問していた。表示は誤解と無駄な待ち時間を防ぐ目的。 【他選択肢】無料・新デザイン募集・昼前閉店は本文にない。 【弱点】理由・目的。行動の目的を、直前の問題状況から読む。 【戦略】A〜B（非公式）。"
  }
];
for (const q of replacements) {
  q.createdBy = "reason10-loop2-light-edit-replacement";
  q.originalLike = true;
  B.push(q);
}
window.REASON10_AUDIT_LOOP2 = {
  retired: Array.from(retireIds),
  added: replacements.map(q=>q.id),
  activeReasonExpected: 10,
  status: "CLEAN_CANDIDATE",
  note: "lrs01/lrs05/lrs06/lrs08 were light-edited via non-destructive retire + new IDs; lrs02/lrs03/lrs04/lrs07/lrs09/lrs10 retained."
};
})();