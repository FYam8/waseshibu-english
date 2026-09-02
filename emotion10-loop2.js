(()=>{
"use strict";
const B=window.DRILLS||[];
const retireIds=new Set(["em01", "em02", "xem1", "xem2", "xem3", "xem4", "xem5", "xem6", "xem7", "xem8"]);
for(const q of B){if(retireIds.has(q.id)){q.retired=true;q.retiredBy="emotion10-loop2";q.retiredReason="emotion10 loop2: 過去問型の心情判断と比べ、感情が直示される短文が多いため、既存履歴保護のため非破壊retire。";q.legacyCompletion=true;}}
const replacements=[
  {
    "id": "lem01",
    "level": 3,
    "focusTag": "emotion-reaction-context",
    "familyId": "emotion-loop2-dress-stain",
    "sourceComparison": "2024大問5問3型: 失敗後の行動・翌日の態度から、直接書かれていない心情を判断する。",
    "prompt": "【オリジナル類題】Mina borrowed her sister’s white jacket for a school concert. During the concert, she felt wonderful because her friends said she looked elegant. After the final song, she noticed a long blue mark on the sleeve where she had held her pen. She hid the sleeve under her arm all the way home. The next morning, she placed the jacket outside her sister’s room with a note saying she would pay for cleaning. How did Mina most likely feel about what had happened?",
    "options": [
      "proud of her performance",
      "embarrassed and sorry",
      "bored by the concert",
      "excited to borrow it again"
    ],
    "answer": 1,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】embarrassed and sorry 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Mina borrowed her sister’s white jacket for a school concert. During the concert, she felt wonderful because her friends said she looked elegant. After the final song, she noticed a long blue mark on the sleeve where she had held her pen. She hid the sleeve under her arm all the way home. The next morning, she placed the jacket outside her sister’s room with a note saying she would pay for cleaning. How did Mina most likely feel about what had happened? 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem02",
    "level": 3,
    "focusTag": "emotion-change",
    "familyId": "emotion-loop2-lost-ticket",
    "sourceComparison": "2024大問5・2025大問5型: 状況の変化に伴う心情変化を、発言ではなく行動から判断する。",
    "prompt": "【オリジナル類題】Ryo had saved his concert ticket in a notebook for weeks. At the station, he opened his bag and could not find the notebook. He checked every pocket twice and stopped answering his friend’s questions. Just before the train arrived, his friend found the notebook under a scarf in the same bag. Ryo laughed weakly and held the ticket with both hands until they reached the hall. His feelings changed from...",
    "options": [
      "confusion to jealousy",
      "worry to relief",
      "pride to anger",
      "boredom to fear"
    ],
    "answer": 1,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】worry to relief 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Ryo had saved his concert ticket in a notebook for weeks. At the station, he opened his bag and could not find the notebook. He checked every pocket twice and stopped answering his friend’s questions. Just before the train arrived, his friend found the notebook under a scarf in the same bag. Ryo laughed weakly and held the ticket with both hands until they reached the hall. His feelings changed from... 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem03",
    "level": 3,
    "focusTag": "emotion-inference-action",
    "familyId": "emotion-loop2-invite-party",
    "sourceComparison": "2025大問5型: 期待と結果のずれを読み、人物の反応を判断する。",
    "prompt": "【オリジナル類題】Aya spent all afternoon making cookies for her class picnic. She put them in a box with a ribbon because she hoped everyone would try them. When she reached the park, most of her classmates were already eating snacks they had bought. Only one student took a cookie, and the others said they were too full. Aya closed the box quietly and later gave the cookies to her younger brother without mentioning the picnic. How did Aya probably feel at the park?",
    "options": [
      "disappointed",
      "relaxed",
      "curious",
      "proud"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】disappointed 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Aya spent all afternoon making cookies for her class picnic. She put them in a box with a ribbon because she hoped everyone would try them. When she reached the park, most of her classmates were already eating snacks they had bought. Only one student took a cookie, and the others said they were too full. Aya closed the box quietly and later gave the cookies to her younger brother without mentioning the picnic. How did Aya probably feel at the park? 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem04",
    "level": 3,
    "focusTag": "emotion-reaction-context",
    "familyId": "emotion-loop2-mother-gift",
    "sourceComparison": "2024大問5型: 直接の感情語なしで、相手の配慮に気づいた後の心情を読む。",
    "prompt": "【オリジナル類題】Ken complained that his lunch was too plain because it had only rice balls and vegetables. At school, he learned that his mother had left home early to take his grandmother to the hospital before work. When he opened the small side pocket of the lunch bag, he found his favorite cake wrapped in paper with a short note: “Good luck on your test.” Ken stopped eating for a moment and folded the note carefully into his notebook. How did Ken most likely feel?",
    "options": [
      "angry that lunch was small",
      "thankful and a little sorry",
      "bored with his test",
      "jealous of his grandmother"
    ],
    "answer": 1,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】thankful and a little sorry 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Ken complained that his lunch was too plain because it had only rice balls and vegetables. At school, he learned that his mother had left home early to take his grandmother to the hospital before work. When he opened the small side pocket of the lunch bag, he found his favorite cake wrapped in paper with a short note: “Good luck on your test.” Ken stopped eating for a moment and folded the note carefully into his notebook. How did Ken most likely feel? 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem05",
    "level": 3,
    "focusTag": "emotion-change",
    "familyId": "emotion-loop2-speech",
    "sourceComparison": "2024大問5問3型: 前夜・翌朝の態度から、感情の変化を読み取る。",
    "prompt": "【オリジナル類題】Before the school speech contest, Nao kept saying she wanted to go home. She looked at the floor while waiting for her turn. During her speech, she forgot one sentence, but she remembered the next part and finished without stopping. After class, a teacher showed her the score sheet. She had not won, but many judges had written that her voice became clearer in the second half. Nao put the sheet into her bag and asked when the next contest would be held. Her feelings most likely changed from...",
    "options": [
      "nervousness to confidence",
      "joy to loneliness",
      "anger to boredom",
      "relief to fear"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】nervousness to confidence 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Before the school speech contest, Nao kept saying she wanted to go home. She looked at the floor while waiting for her turn. During her speech, she forgot one sentence, but she remembered the next part and finished without stopping. After class, a teacher showed her the score sheet. She had not won, but many judges had written that her voice became clearer in the second half. Nao put the sheet into her bag and asked when the next contest would be held. Her feelings most likely changed from... 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem06",
    "level": 3,
    "focusTag": "emotion-inference-action",
    "familyId": "emotion-loop2-birthday-surprise",
    "sourceComparison": "2026大問7型: 後続行動・会話から、人物がどう受け取ったかを判断する。",
    "prompt": "【オリジナル類題】Sota thought his friends had forgotten his birthday. At lunch, they talked about homework and club practice as usual, and no one said anything special. After school, his teacher asked him to carry some books to the music room. When Sota opened the door, his friends were inside with a small cake and a handmade card. He covered his face with both hands, then read the card twice before speaking. How did Sota most likely feel?",
    "options": [
      "surprised and moved",
      "angry and suspicious",
      "sleepy and bored",
      "proud and careless"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】surprised and moved 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Sota thought his friends had forgotten his birthday. At lunch, they talked about homework and club practice as usual, and no one said anything special. After school, his teacher asked him to carry some books to the music room. When Sota opened the door, his friends were inside with a small cake and a handmade card. He covered his face with both hands, then read the card twice before speaking. How did Sota most likely feel? 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem07",
    "level": 3,
    "focusTag": "emotion-social-context",
    "familyId": "emotion-loop2-old-shoes-retired",
    "sourceComparison": "emotion loop4: 2024大問5と題材・場面・正解感情が近すぎるため非破壊retire。",
    "prompt": "【オリジナル類題・retired】Hana wanted new shoes for the school dance, but her family had just paid for her brother’s hospital visit. She cleaned her old shoes carefully and hoped no one would notice the scratches. At the dance, a classmate looked down and asked, “Are those the same shoes you wore last year?” Hana quickly moved behind a table and said she needed to help with the drinks. What feeling best explains Hana’s action?",
    "options": [
      "embarrassment",
      "excitement",
      "trust",
      "relief"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "retired": true,
    "retiredBy": "emotion10-loop4",
    "retiredReason": "2024年度大問5と、school dance・新しい服飾品を買えない背景・服飾品を見られる恥ずかしさ・正解感情embarrassmentが重なりすぎるため。",
    "legacyCompletion": true,
    "explanation": "【正解】embarrassment 【設問和訳】Hanaの行動を最もよく説明する心情を選ぶ。 【根拠英文】Hana wanted new shoes for the school dance, but her family had just paid for her brother’s hospital visit. She cleaned her old shoes carefully and hoped no one would notice the scratches. At the dance, a classmate looked down and asked, “Are those the same shoes you wore last year?” Hana quickly moved behind a table and said she needed to help with the drinks. 【根拠英文和訳】Hanaは新しい靴を欲しがっていたが、家族は弟の病院代を払ったばかりだった。古い靴をきれいにし、傷に気づかれないことを願った。ダンスで同級生に去年と同じ靴かと聞かれ、すぐテーブルの後ろへ移動し、飲み物を手伝うと言った。 【なぜ正解か】傷を見られたくない、指摘された直後に隠れるように動く、という行動はembarrassmentに合う。 【他選択肢】excitement, trust, reliefはいずれも指摘後に隠れる行動と合わない。 【弱点】心情。 【戦略】B（非公式）。ただし過去問との題材近接のためretired。"
  },
  {
    "id": "lem11",
    "level": 3,
    "focusTag": "emotion-change-context",
    "familyId": "emotion-loop4-broken-model",
    "sourceComparison": "2024大問5型: 失敗そのものではなく、その後の沈黙・行動・後続対応から、直接書かれていない心情を判断する。",
    "prompt": "【オリジナル類題】Rina borrowed a handmade science model from her classmate for a group presentation. At home, she placed it on her desk, but her little brother bumped the table and a small part fell off. The next morning, her classmate smiled and said, “Thanks for keeping it safe. We really need it today.” Rina touched the broken piece in her pocket, looked down, and asked the teacher if she could speak to her classmate before class. How did Rina most likely feel?",
    "options": [
      "guilty and nervous",
      "proud and relaxed",
      "bored and sleepy",
      "angry and jealous"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】guilty and nervous 【設問和訳】Rinaはどのように感じていたと考えられるか。 【根拠英文】A small part fell off. The next morning, her classmate smiled and said, “Thanks for keeping it safe. We really need it today.” Rina touched the broken piece in her pocket, looked down, and asked the teacher if she could speak to her classmate before class. 【根拠英文和訳】小さな部品が外れた。翌朝、同級生は笑顔で「安全に保管してくれてありがとう。今日は本当に必要なんだ」と言った。Rinaはポケットの中の壊れた部品に触れ、下を向き、授業前に同級生と話せるか先生に尋ねた。 【なぜ正解か】壊れたことをまだ伝えていない状態で、部品を隠し持ち、下を向き、授業前に話そうとしているため、申し訳なさと不安が最も自然。 【他選択肢】proud and relaxedは下を向く行動と合わない。bored and sleepyは発表前の問題と無関係。angry and jealousは本文に根拠がない。 【弱点】心情。感情語を探すのではなく、失敗後の行動・沈黙・後続対応から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem08",
    "level": 3,
    "focusTag": "emotion-inference-action",
    "familyId": "emotion-loop2-team-bench",
    "sourceComparison": "2025大問5型: 発言・行動と状況のずれから、人物の心情を推論する。",
    "prompt": "【オリジナル類題】Daichi practiced soccer every morning because he wanted to play in the final match. On the day of the game, the coach told him to stay on the bench and watch the older players. Daichi clapped whenever his team scored, but he kept looking at his clean shoes. When the game ended, he was the first to put the balls away and left before the team photo was taken. How did Daichi probably feel?",
    "options": [
      "left out",
      "amused",
      "relieved",
      "careless"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】left out 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Daichi practiced soccer every morning because he wanted to play in the final match. On the day of the game, the coach told him to stay on the bench and watch the older players. Daichi clapped whenever his team scored, but he kept looking at his clean shoes. When the game ended, he was the first to put the balls away and left before the team photo was taken. How did Daichi probably feel? 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem09",
    "level": 3,
    "focusTag": "emotion-change",
    "familyId": "emotion-loop2-brother-camera",
    "sourceComparison": "2026大問7型: 誤解が解けた後の心情変化を、後続情報から判断する。",
    "prompt": "【オリジナル類題】Yuki was sure her little brother had broken her camera because she found it on the floor near his toys. She did not listen when he tried to explain. Later, she saw a video from the living-room tablet. The family cat had jumped onto the shelf and knocked the camera down while her brother was in the kitchen. Yuki went to his room with the camera and his favorite juice. Her feelings most likely changed from...",
    "options": [
      "blame to guilt",
      "fear to pride",
      "joy to boredom",
      "relief to jealousy"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】blame to guilt 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Yuki was sure her little brother had broken her camera because she found it on the floor near his toys. She did not listen when he tried to explain. Later, she saw a video from the living-room tablet. The family cat had jumped onto the shelf and knocked the camera down while her brother was in the kitchen. Yuki went to his room with the camera and his favorite juice. Her feelings most likely changed from... 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  },
  {
    "id": "lem10",
    "level": 3,
    "focusTag": "emotion-reaction-context",
    "familyId": "emotion-loop2-letter",
    "sourceComparison": "2024大問5・2026大問7型: 結果を知った後の沈黙や行動から、心情を判断する。",
    "prompt": "【オリジナル類題】Eri wrote a letter to thank a volunteer who had helped her after a train accident. She did not know his address, so she gave the letter to the station office and almost forgot about it. Two months later, an envelope arrived. Inside was a short message from the volunteer’s daughter saying that her father had read Eri’s letter many times in the hospital and had smiled whenever he read it. Eri sat by the window for a long time without turning on the TV. How did Eri most likely feel?",
    "options": [
      "deeply touched",
      "annoyed by the delay",
      "eager to travel",
      "ashamed of writing"
    ],
    "answer": 0,
    "skill": "emotion",
    "type": "choice",
    "targetId": "emotion-inference",
    "examFormat": "choice",
    "explanation": "【正解】deeply touched 【設問和訳】本文の状況から、人物の心情または心情変化として最も適切なものを選ぶ。 【根拠英文】Eri wrote a letter to thank a volunteer who had helped her after a train accident. She did not know his address, so she gave the letter to the station office and almost forgot about it. Two months later, an envelope arrived. Inside was a short message from the volunteer’s daughter saying that her father had read Eri’s letter many times in the hospital and had smiled whenever he read it. Eri sat by the window for a long time without turning on the TV. How did Eri most likely feel? 【根拠英文和訳】本文では、人物の発言・行動・状況変化が示されており、感情語そのものではなく、その手がかりから心情を判断する必要がある。 【なぜ正解か】正解は、本文中の出来事の前後関係と人物の行動に最も自然につながる。 【他選択肢】他の選択肢は、本文にない感情、逆の感情、または一部の情報だけに飛びついたもの。 【弱点】心情。感情語を探すのではなく、行動・沈黙・表情・後続行動から判断する。 【戦略】B（非公式）。"
  }
];
for(const q of replacements){B.push(q);}
})();
