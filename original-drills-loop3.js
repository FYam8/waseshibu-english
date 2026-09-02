(()=> {
"use strict";
const B = window.DRILLS || [];
const retireIds = new Set(["su01", "su02", "xsu1", "xsu2", "xsu3", "xsu4", "xsu5", "xsu6", "xsu7", "xsu8", "rb01", "rb02", "rb03", "xrb1", "xrb2", "xrb3", "xrb4", "xrb5", "xrb6", "xrb7", "xrb8", "rs01", "rs02", "xrs1", "xrs2", "xrs3", "xrs4", "xrs5", "xrs6", "xrs7", "xrs8", "xvd1", "xvd2", "xvd3", "xvd4", "xvd5", "xvd6", "xvd7", "xvd8"]);
const reason = "loop3監査: 元過去問相当の思考処理・解答形式・解説基準に不足。既存履歴保護のため非破壊retire。";
for (const q of B) {
  if (retireIds.has(q.id)) {
    q.retired = true;
    q.retiredReason = reason;
    q.legacyCompletion = true;
  }
}
const replacements = [
  {
    "id": "lsu01",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2022",
    "examFormat": "manual",
    "familyId": "loop3-summary-glasses",
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nA man in a small village wanted to read newspapers like his neighbors. He thought the problem was his poor eyesight, so he went to a busy shop and tried many pairs of glasses. The shopkeeper even gave him a large book to test them. However, the man held the book upside down and still could not read a word. Finally, the shopkeeper realized the real problem: the man had never learned how to read.",
    "check": [
      "眼鏡を試したこと",
      "読めなかった本当の理由",
      "店員が本当の原因に気づいたこと",
      "40語以内"
    ],
    "model": "A man thought glasses would help him read, so he tried many pairs at a shop. However, the real problem was not his eyesight. He had never learned how to read.",
    "explanation": "【確認】本文には店・近所・本の向きなど不要情報がある。残す中心は「眼鏡を試した→読めない→原因は読み方を知らない」。 【戦略】A：原因と結論を落とさない。",
    "maxWords": 40
  },
  {
    "id": "lsu02",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2023",
    "examFormat": "manual",
    "familyId": "loop3-summary-money-peace",
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nA poor farmer named Niko lived simply but slept well every night. His rich neighbor, who worried constantly about thieves, envied Niko’s peaceful life. One day the neighbor gave Niko a heavy box of coins. Niko was excited at first, but that night he locked every window and could not sleep. The next morning, he returned the coins, saying that peace was more important to him than money.",
    "check": [
      "貧しいが平穏だったこと",
      "お金を得て不安になった変化",
      "返した結論",
      "50語以内"
    ],
    "model": "Niko was poor but lived peacefully. After his rich neighbor gave him many coins, he became worried and could not sleep. The next morning, he returned the money because he valued peace more than wealth.",
    "explanation": "【確認】名前や窓などの細部より、状態変化と結論を選ぶ。 【戦略】A：人物→変化→結論の3点を入れる。",
    "maxWords": 50
  },
  {
    "id": "lsu03",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2022",
    "examFormat": "manual",
    "familyId": "loop3-summary-mistaken-dog",
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nA hunter left his baby at home with a loyal dog. While he was away, a wolf entered the house. The dog fought the wolf and saved the child. When the hunter came home, he saw blood on the dog’s mouth and thought it had attacked the baby. In anger, he killed the dog. He soon found the baby safe beside the dead wolf and realized his terrible mistake.",
    "check": [
      "犬が赤ん坊を救ったこと",
      "猟師が誤解したこと",
      "取り返しのつかない結果",
      "40語以内"
    ],
    "model": "A loyal dog saved a hunter’s baby from a wolf. However, the hunter saw blood and mistakenly believed the dog had killed the child, so he killed it before learning the truth.",
    "explanation": "【確認】細かな場所より、救助→誤解→悲劇を残す。 【戦略】B：逆転の因果を短くまとめる。",
    "maxWords": 40
  },
  {
    "id": "lsu04",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2023",
    "examFormat": "manual",
    "familyId": "loop3-summary-school-trees",
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nThe classrooms on the west side of a school became very hot every afternoon, and students found it hard to study. Buying new air conditioners was too expensive, so the teachers and students planted fast-growing trees outside the windows. At first the trees were small, but after two years they blocked the strong sunlight. The rooms became cooler, and the school used less electricity during summer.",
    "check": [
      "問題",
      "解決策",
      "時間経過後の効果",
      "50語以内"
    ],
    "model": "A school had very hot classrooms, but new air conditioners were too expensive. Teachers and students planted trees outside the windows. After the trees grew, they blocked sunlight, made the rooms cooler, and reduced electricity use.",
    "explanation": "【確認】午後・方角・年数は必要なら短く。中心は問題→対策→複数の結果。 【戦略】B。",
    "maxWords": 50
  },
  {
    "id": "lsu05",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2023",
    "examFormat": "manual",
    "familyId": "loop3-summary-machine-limits",
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nA factory introduced a new machine to check fruit before it was packed. The machine worked much faster than experienced workers and helped the company send products on time. However, it sometimes missed damaged fruit when the color was unusual. After several complaints from shops, the manager decided that workers should still check the machine’s results. The machine was useful, but it could not replace human judgment completely.",
    "check": [
      "新機械の利点",
      "問題点",
      "人による確認が必要という結論",
      "50語以内"
    ],
    "model": "A factory’s new machine checked fruit quickly and helped work finish on time. However, it sometimes missed damaged fruit, so workers still needed to check its results. The machine was useful but could not fully replace people.",
    "explanation": "【確認】利点だけでなく限界を必ず入れる。 【戦略】B：but以降の結論を落とさない。",
    "maxWords": 50
  },
  {
    "id": "lsu06",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2022",
    "examFormat": "manual",
    "familyId": "loop3-summary-bus-policy",
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nA town had serious traffic jams near its shopping area. The mayor did not want to build another road because it would destroy a small park. Instead, the town lowered bus fares and added more buses in the morning and evening. Within six months, more people used buses, fewer cars entered the center, and the air became cleaner.",
    "check": [
      "交通問題",
      "バスを安く増やした対策",
      "車と大気への結果",
      "40語以内"
    ],
    "model": "A town reduced bus fares and added buses instead of building a new road. More people used buses, fewer cars entered the center, and the air became cleaner.",
    "explanation": "【確認】市長や公園は補足。施策と結果を中心にまとめる。 【戦略】A。",
    "maxWords": 40
  },
  {
    "id": "lsu07",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2023",
    "examFormat": "manual",
    "familyId": "loop3-summary-soil-discovery",
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nScientists collected soil from a forest because they were searching for new medicines. In the soil, they found a type of bacteria that produced a substance harmful to several dangerous germs. Early tests were promising, and newspapers quickly called it a new medicine. However, the scientists warned that it had only been tested in a laboratory. More studies would be needed before it could be used safely for people.",
    "check": [
      "発見",
      "初期結果",
      "人への使用は未確定という限界",
      "50語以内"
    ],
    "model": "Scientists found soil bacteria that produced a substance harmful to dangerous germs. Although early laboratory tests were promising, the substance had not been tested safely on people yet, so more research was needed.",
    "explanation": "【確認】発見だけで終わらず、未確定・追加研究を入れる。 【戦略】B。",
    "maxWords": 50
  },
  {
    "id": "lsu08",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2023",
    "examFormat": "manual",
    "familyId": "loop3-summary-group-decision",
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nResearchers watched small insects carry large pieces of food together. They first wondered whether one insect led the group. In an experiment, however, the group did not follow a single leader. Each insect pulled a little, and the group corrected mistakes when more insects joined. Small groups often changed direction, but larger groups usually chose a better path. The study showed that simple teamwork could make group decisions more reliable.",
    "check": [
      "リーダーではないこと",
      "各個体が少しずつ方向決定に関わること",
      "大きな集団ほど良い判断",
      "50語以内"
    ],
    "model": "Researchers found that the insects did not follow one leader when carrying food. Each insect helped choose the direction, and larger groups corrected mistakes better. The study showed that teamwork can make group decisions more reliable.",
    "explanation": "【確認】実験名などより、対比と結論を残す。 【戦略】B。",
    "maxWords": 50
  },
  {
    "id": "lsu09",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2023",
    "examFormat": "manual",
    "familyId": "loop3-summary-button-choice",
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nA couple received a strange box with a button. A visitor told them that if they pressed it, someone they did not know would die and they would receive a large amount of money. The husband rejected the offer, but the wife kept thinking about the money. Finally, she pressed the button. Soon after, she learned that her husband had died, and the visitor suggested she had not truly known him.",
    "check": [
      "ボタンの条件",
      "夫婦の対立",
      "押した結果",
      "50語以内"
    ],
    "model": "A couple were offered money if they pressed a button that would kill someone they did not know. The husband refused, but the wife pressed it. She then learned her husband had died and questioned what “know” meant.",
    "explanation": "【確認】条件・行動・結末の3点を入れる。 【戦略】B。",
    "maxWords": 50
  },
  {
    "id": "lsu10",
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "focusTag": "summary-2022",
    "examFormat": "manual",
    "familyId": "loop3-summary-small-action",
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nAfter a storm, thousands of small fish were left on a beach. An old man told a girl that throwing them back one by one was useless because she could not save them all. The girl picked up another fish, returned it to the sea, and said that her action mattered to that fish. The story teaches that even a small action can be meaningful.",
    "check": [
      "多くの魚が浜に残ったこと",
      "少女の行動",
      "小さな行動の意味という教訓",
      "40語以内"
    ],
    "model": "A girl returned small fish to the sea, although an old man said she could not save them all. She showed that one small action can still matter to the one helped.",
    "explanation": "【確認】数の大きさより、行動と教訓を残す。 【戦略】A。",
    "maxWords": 40
  },
  {
    "id": "lrb01",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2024",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-homework",
    "prompt": "【オリジナル類題・2024型・60語以内】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: What do you think about homework?\nB: Students already spend many hours in lessons and club activities. When they also get a lot of homework, they cannot rest or spend time with family. Tired students do not learn well, so I think schools should stop giving homework completely.\nA: (                              )",
    "check": [
      "Bは宿題完全廃止を主張",
      "理由を2つ程度拾う",
      "転換して反論",
      "理由または代案",
      "60語以内"
    ],
    "model": "You are saying that homework should be stopped because students are busy and need rest. However, a small amount of homework is useful. It helps students review lessons and lets teachers see what they do not understand. Schools should reduce excessive homework, not remove it completely.",
    "explanation": "【設問条件】Bの主張と理由を要約し、反論を述べる。 【型】要約→転換→反論→理由。 【戦略】B：全面否定より条件付き反論が安定。",
    "maxWords": 60
  },
  {
    "id": "lrb02",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2024",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-phones",
    "prompt": "【オリジナル類題・2024型・60語以内】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: Should students be allowed to use mobile phones at school?\nB: I do not think so. Phones may ring during lessons, and students might send messages when they should be listening. During breaks, they may play games instead of talking with friends. Phones would make the school less focused.\nA: (                              )",
    "check": [
      "授業中の妨げと休み時間の問題を要約",
      "ルール付き利用で反論",
      "具体例",
      "60語以内"
    ],
    "model": "You think phones should not be allowed because they may disturb lessons and reduce real communication. However, phones can be useful if schools set clear rules. For example, students could use them only for research or emergencies and keep them in bags during ordinary lessons.",
    "explanation": "【設問条件】相手の2理由を落とさず、ルールという解決策で反論する。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb03",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2025",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-events",
    "prompt": "【オリジナル類題・2025型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: Do you like school events?\nB: I think we should have fewer of them. Preparing for festivals and sports days takes a lot of class time. Some students also feel stress because they have to practice after school. Academic study should come first.\nA: (                              )",
    "check": [
      "行事削減の主張",
      "授業時間・ストレス・勉強優先を拾う",
      "教育効果で反論",
      "約50語"
    ],
    "model": "You argue that school events should be reduced because they take study time and may stress students. However, events also teach teamwork and responsibility. If teachers manage preparation time well, students can learn important skills while still keeping enough time for academic study.",
    "explanation": "【型】相手の懸念を認め、管理すれば両立できると返す。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb04",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2025",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-tablets",
    "prompt": "【オリジナル類題・2025型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: Should printed textbooks be replaced by tablets?\nB: Yes. Tablets can store many books, videos, and dictionaries in one device. Students will not have to carry heavy bags. Since information can be updated quickly, schools should replace every printed book with tablets.\nA: (                              )",
    "check": [
      "利便性・軽さ・更新性を要約",
      "全面置換への反論",
      "紙の利点または併用案",
      "約50語"
    ],
    "model": "You say tablets should replace printed books because they are convenient, light, and easy to update. However, schools should use both. Printed books do not need batteries and may help students concentrate, while tablets are useful for searching and carrying many materials.",
    "explanation": "【型】利点を認めて「全部置換」に反論する。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb05",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2025",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-clubs",
    "prompt": "【オリジナル類題・2025型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: Are club activities necessary?\nB: I do not think so. They take time away from homework and exam preparation. Students often come home late and feel tired the next day. Since grades are important for the future, schools should make club activities optional or remove them.\nA: (                              )",
    "check": [
      "勉強時間・疲労・成績重視を要約",
      "部活の価値で反論",
      "調整案",
      "約50語"
    ],
    "model": "You think clubs should be removed because they take study time and make students tired. However, clubs help students learn teamwork and continue healthy habits. Schools can limit practice days during exam periods instead of removing activities that support students’ growth.",
    "explanation": "【型】問題を認め、全面廃止ではなく制限で解決する。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb06",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2025",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-lunch",
    "prompt": "【オリジナル類題・2025型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: Should all students eat the same school lunch?\nB: Yes. It would be cheaper and easier for the school kitchen. Students would not waste time choosing meals, and everyone would feel equal. Therefore, the school should offer only one menu each day.\nA: (                              )",
    "check": [
      "安さ・効率・平等を要約",
      "一種類だけへの反論",
      "アレルギー等の具体例",
      "約50語"
    ],
    "model": "You say one lunch menu would be cheaper, easier, and fair. However, the school should offer some choices. Students have allergies, religions, and health needs. A few simple options would protect students while still keeping the system organized and not too expensive.",
    "explanation": "【型】相手の利点を受け、例外の必要性で反論する。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb07",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2025",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-park",
    "prompt": "【オリジナル類題・2025型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: What should our town do with the old park?\nB: It should become a parking area. Many drivers cannot find spaces near the station, and local shops lose customers. The park is small and not many people use it, so parking would be more useful for the town.\nA: (                              )",
    "check": [
      "駐車場化の主張と理由を要約",
      "公園の価値で反論",
      "代案",
      "約50語"
    ],
    "model": "You think the park should become a parking area because drivers and shops need spaces. However, even a small park gives children and older people a safe place to rest. The town should improve parking in another place and keep the park for the community.",
    "explanation": "【型】経済的理由を受け、失われる公共利益を示す。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb08",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2026",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-uniforms",
    "prompt": "【オリジナル類題・2026型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: What do you think about school uniforms?\nB: Students should not have to wear them. Uniforms can be uncomfortable in hot weather, and they may stop students from moving freely during breaks. Students can express themselves better if they choose their own clothes.\nA: (                              )",
    "check": [
      "不快・動きにくい・自己表現を要約",
      "制服を残す反論または改善案",
      "具体案",
      "約50語"
    ],
    "model": "You argue that uniforms are uncomfortable, limit movement, and reduce self-expression. However, uniforms can make students feel equal and reduce worries about fashion. Schools should improve the design, such as using cooler and more flexible materials, instead of removing uniforms completely.",
    "explanation": "【型】相手の問題点を認め、改善案で反論する。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb09",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2026",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-ai",
    "prompt": "【オリジナル類題・2026型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: Should students still study foreign languages?\nB: Maybe not. Translation AI is becoming very accurate and fast. It can help people read signs, write emails, and talk when traveling. Since technology will keep improving, students should spend their time on other subjects.\nA: (                              )",
    "check": [
      "AIが正確・速い・旅行等に役立つことを要約",
      "外国語学習の価値で反論",
      "理由",
      "約50語"
    ],
    "model": "You say students do not need foreign languages because translation AI is fast and useful. However, learning a language helps people understand culture and communicate directly. AI is a helpful tool, but students still need language skills to build trust and think independently.",
    "explanation": "【型】道具の利点と人間の能力を区別する。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb10",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2025",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-zoos",
    "prompt": "【オリジナル類題・2025型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: What do you think about zoos?\nB: I think they should be closed. Some animals are brought from faraway places and kept in small spaces. They cannot hunt or move as they would in the wild. It is unfair to keep animals only for visitors’ entertainment.\nA: (                              )",
    "check": [
      "動物が自由でないという主張を要約",
      "保護・教育などで反論",
      "理由または例",
      "約50語"
    ],
    "model": "You think zoos should be closed because animals may lose freedom and live in small spaces. However, good zoos can protect endangered animals and teach visitors why wildlife matters. We should improve zoo conditions rather than close every zoo.",
    "explanation": "【型】相手の倫理的懸念を受け、保護・教育の利益で返す。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrb11",
    "skill": "rebuttal",
    "level": 3,
    "type": "selfcheck",
    "targetId": "rebuttal-dialogue",
    "focusTag": "rebuttal-2026",
    "examFormat": "manual",
    "familyId": "loop3-rebuttal-cleaning",
    "prompt": "【オリジナル類題・2026型・約50語】次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: What do you think about cleaning time at school?\nB: Students are already busy with homework, club activities, and tests. Professional cleaners know how to clean quickly and well. Students should use that time for studying or resting instead of doing extra work.\nA: (                              )",
    "check": [
      "忙しさとプロ清掃の主張を要約",
      "生徒清掃の価値で反論",
      "理由または例",
      "約50語"
    ],
    "model": "You are saying that students are busy and professionals can clean better. However, cleaning the school ourselves is useful. It teaches students responsibility and respect for shared places. It can also save money for books or equipment, so it is more than extra work.",
    "explanation": "【型】相手の効率論を要約し、教育効果と費用面で反論する。 【戦略】B。",
    "maxWords": 60
  },
  {
    "id": "lrs01",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-action-motive",
    "examFormat": "choice",
    "familyId": "loop3-reason-rain",
    "prompt": "【オリジナル類題】The class was preparing paper decorations for an outdoor festival. Aya looked at the dark clouds and noticed that the decorations were still on the tables outside. She asked two friends to carry them into the hall. Why did Aya ask her friends to move the decorations?",
    "options": [
      "She wanted to practice carrying tables.",
      "She wanted to protect them from possible rain.",
      "She wanted to make the hall darker.",
      "She had forgotten where the festival was."
    ],
    "answer": 1,
    "explanation": "【正解】She wanted to protect them from possible rain. 【設問和訳】なぜアヤは友人に飾りを移動させるよう頼んだのか。 【根拠英文】Aya looked at the dark clouds and noticed that the decorations were still on the tables outside. 【根拠英文和訳】アヤは暗い雲を見て、飾りがまだ外の机の上にあることに気づいた。 【なぜ正解か】暗い雲＋紙の飾りが外にあるため、雨でぬれる前に室内へ移す判断。 【他選択肢】机の練習・ホールを暗くする・場所忘れは本文にない。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs02",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-obstacle",
    "examFormat": "choice",
    "familyId": "loop3-reason-bridge",
    "prompt": "【オリジナル類題】Ken usually walked across the bridge to reach the library. On Monday, he found a sign that said, “Unsafe until Friday,” and a police officer was standing in front of the bridge. Ken opened his map and chose a longer street. Why did Ken choose the longer street?",
    "options": [
      "The library had moved to another town.",
      "He wanted to meet the police officer.",
      "The usual bridge could not be used safely.",
      "He did not like reading books."
    ],
    "answer": 2,
    "explanation": "【正解】The usual bridge could not be used safely. 【設問和訳】なぜケンは遠回りの道を選んだのか。 【根拠英文】a sign that said, “Unsafe until Friday,” and a police officer was standing in front of the bridge. 【根拠英文和訳】「金曜日まで危険」と書かれた標識があり、警察官が橋の前に立っていた。 【なぜ正解か】普段の橋が通れない／安全でないので、別ルートを選んだ。 【他選択肢】図書館移転・警察官に会う・読書嫌いは根拠なし。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】A（非公式）。"
  },
  {
    "id": "lrs03",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-experiment",
    "examFormat": "choice",
    "familyId": "loop3-reason-experiment-temp",
    "prompt": "【オリジナル類題】Mina’s group got almost the same result in the first two science tests. In the third test, the number was much higher. Mina then noticed that the thermometer had been placed next to a heater. She moved the equipment and started the test again. Why did Mina start the test again?",
    "options": [
      "She thought heat might have affected the result.",
      "She wanted to finish before lunch.",
      "She had lost the thermometer.",
      "She wanted to make the number even higher."
    ],
    "answer": 0,
    "explanation": "【正解】She thought heat might have affected the result. 【設問和訳】なぜミナは実験をやり直したのか。 【根拠英文】the number was much higher. Mina then noticed that the thermometer had been placed next to a heater. 【根拠英文和訳】数値がずっと高く、ミナは温度計がヒーターの横に置かれていたことに気づいた。 【なぜ正解か】異常に高い結果とヒーターの位置から、温度の影響を疑って再実験した。 【他選択肢】昼食・温度計紛失・数値を上げたいは本文と合わない。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs04",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-delay",
    "examFormat": "choice",
    "familyId": "loop3-reason-late-report",
    "prompt": "【オリジナル類題】Sota planned to send his report to his teacher before dinner. When he opened his laptop, the screen went black, and he remembered that his charging cable was in his classroom. He sent the report the next morning from the school computer room. Why was Sota’s report sent late?",
    "options": [
      "He decided to rewrite all of it.",
      "He forgot his teacher’s name.",
      "His computer could not be used that evening.",
      "The school computer room was closed in the morning."
    ],
    "answer": 2,
    "explanation": "【正解】His computer could not be used that evening. 【設問和訳】なぜソウタのレポート提出は遅れたのか。 【根拠英文】the screen went black, and he remembered that his charging cable was in his classroom. 【根拠英文和訳】画面が真っ暗になり、充電ケーブルが教室にあることを思い出した。 【なぜ正解か】夜に自分のパソコンを使えず、翌朝学校で送ったため。 【他選択肢】書き直し・先生の名前忘れ・朝の閉室は本文にない。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】A（非公式）。"
  },
  {
    "id": "lrs05",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-honesty",
    "examFormat": "choice",
    "familyId": "loop3-reason-wallet",
    "prompt": "【オリジナル類題】Mari found a wallet under her desk after club practice. Inside it, she saw a student card with Rika’s name on it and several bus tickets. Mari did not put the wallet in her own bag. She took it to the teachers’ room. Why did Mari take the wallet to the teachers’ room?",
    "options": [
      "She knew it belonged to another student.",
      "She wanted to buy bus tickets.",
      "She was late for club practice.",
      "She wanted to keep the wallet safely at home."
    ],
    "answer": 0,
    "explanation": "【正解】She knew it belonged to another student. 【設問和訳】なぜマリは財布を職員室へ持っていったのか。 【根拠英文】she saw a student card with Rika’s name on it 【根拠英文和訳】リカの名前がある学生証を見た。 【なぜ正解か】財布の持ち主が自分ではなくリカだと分かったため、届けた。 【他選択肢】バス券購入・部活遅刻・家で保管は本文と異なる。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】A（非公式）。"
  },
  {
    "id": "lrs06",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-purpose",
    "examFormat": "choice",
    "familyId": "loop3-reason-whisper",
    "prompt": "【オリジナル類題】During an online meeting, Taro suddenly stopped speaking and began typing his answers in the chat box. His baby sister had finally fallen asleep in the next room, and the door between the rooms was open. Why did Taro type instead of speaking?",
    "options": [
      "He did not know how to use the microphone.",
      "He wanted to avoid waking his sister.",
      "He was angry at the other students.",
      "He had already left the meeting."
    ],
    "answer": 1,
    "explanation": "【正解】He wanted to avoid waking his sister. 【設問和訳】なぜタロウは話さずに入力したのか。 【根拠英文】His baby sister had finally fallen asleep in the next room, and the door between the rooms was open. 【根拠英文和訳】赤ん坊の妹が隣の部屋でようやく眠り、部屋の間のドアが開いていた。 【なぜ正解か】声を出すと妹を起こす可能性があるため、チャット入力に切り替えた。 【他選択肢】マイク・怒り・退席は本文にない。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs07",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-empathy",
    "examFormat": "choice",
    "familyId": "loop3-reason-speech-delete",
    "prompt": "【オリジナル類題】Jin was writing a speech for the class party. The final joke was about a mistake his classmate had made last week. He remembered that she had looked close to tears when people laughed at her then. Jin erased the joke and wrote a different ending. Why did Jin erase the joke?",
    "options": [
      "He wanted his speech to be much shorter.",
      "He did not remember the classmate’s name.",
      "He did not want to hurt his classmate again.",
      "He wanted everyone to laugh louder."
    ],
    "answer": 2,
    "explanation": "【正解】He did not want to hurt his classmate again. 【設問和訳】なぜジンは冗談を消したのか。 【根拠英文】she had looked close to tears when people laughed at her then. 【根拠英文和訳】そのとき人々に笑われて、彼女は泣きそうに見えた。 【なぜ正解か】同じ失敗を笑いの材料にすると相手を傷つけると判断した。 【他選択肢】短くしたい・名前忘れ・大笑いさせたいは根拠なし。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs08",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-sign",
    "examFormat": "choice",
    "familyId": "loop3-reason-sold-out",
    "prompt": "【オリジナル類題】At the school shop, the last notebook with the festival design was sold before noon. More students kept coming to the counter and asking for the same notebook. The shop manager put a “Sold out” sign on the front table. Why did the manager put up the sign?",
    "options": [
      "To tell students that the notebook was no longer available.",
      "To advertise a new festival design.",
      "To ask students to bring their own tables.",
      "To show that the shop would open at noon."
    ],
    "answer": 0,
    "explanation": "【正解】To tell students that the notebook was no longer available. 【設問和訳】なぜ店長は表示を出したのか。 【根拠英文】the last notebook ... was sold before noon. More students kept ... asking for the same notebook. 【根拠英文和訳】最後のノートが昼前に売れたが、さらに多くの生徒が同じノートを求め続けた。 【なぜ正解か】売り切れを知らせて、無駄な問い合わせを防ぐため。 【他選択肢】新デザイン広告・机持参・開店時刻は本文にない。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】A（非公式）。"
  },
  {
    "id": "lrs09",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-plan-change",
    "examFormat": "choice",
    "familyId": "loop3-reason-indoor-event",
    "prompt": "【オリジナル類題】The morning was sunny, but the weather report warned of strong winds in the afternoon. The outdoor stage used light boards and paper flowers. The organizers decided to move the concert into the gym before lunch. Why did the organizers move the concert inside?",
    "options": [
      "The singers wanted to play basketball.",
      "They were worried the wind could cause problems outside.",
      "The gym was too small for the concert.",
      "They had canceled the weather report."
    ],
    "answer": 1,
    "explanation": "【正解】They were worried the wind could cause problems outside. 【設問和訳】なぜ主催者はコンサートを屋内に移したのか。 【根拠英文】the weather report warned of strong winds ... The outdoor stage used light boards and paper flowers. 【根拠英文和訳】天気予報は強風を警告し、屋外ステージには軽い板や紙の花が使われていた。 【なぜ正解か】晴れていても午後の強風で装飾や舞台に問題が出ると判断した。 【他選択肢】バスケット・体育館の狭さ・予報取消は本文にない。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】B（非公式）。"
  },
  {
    "id": "lrs10",
    "skill": "reason",
    "level": 3,
    "type": "choice",
    "targetId": "reason-evidence",
    "focusTag": "reason-reaction",
    "examFormat": "choice",
    "familyId": "loop3-reason-early-leave",
    "prompt": "【オリジナル類題】Rina borrowed an old blue dress for the dance. After the rain started, she noticed blue water collecting under the dress and saw two girls looking toward the floor. Rina covered the dress with her coat and left the hall quietly. Why did Rina leave the hall?",
    "options": [
      "She wanted to change the music.",
      "She realized the color was coming out of the dress.",
      "She had promised to meet the two girls outside.",
      "She wanted to return the coat to its owner."
    ],
    "answer": 1,
    "explanation": "【正解】She realized the color was coming out of the dress. 【設問和訳】なぜリナは会場を出たのか。 【根拠英文】she noticed blue water collecting under the dress and saw two girls looking toward the floor. 【根拠英文和訳】ドレスの下に青い水がたまっており、二人の女子が床の方を見ていることに気づいた。 【なぜ正解か】染料が流れ出ていることに気づき、見られる前に隠して出たと判断できる。 【他選択肢】音楽変更・外で会う約束・コート返却は本文にない。 【弱点】理由・動機。直接のbecauseだけでなく、前後の状況から行動の原因を復元する。 【戦略】B（非公式）。"
  },
  {
    "id": "lvd01",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-vacation",
    "prompt": "A (v        ) is a period when you do not go to school or work and can rest or travel.",
    "answerText": "vacation",
    "initial": "v",
    "explanation": "【正解】vacation 【定義文和訳】休暇とは、学校や仕事に行かず、休んだり旅行したりできる期間である。 【意味】休暇 【品詞】noun 【例文】I went to Okinawa during my summer vacation."
  },
  {
    "id": "lvd02",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-prepare",
    "prompt": "To (p        ) is to make something or yourself ready before an activity begins.",
    "answerText": "prepare",
    "initial": "p",
    "explanation": "【正解】prepare 【定義文和訳】prepareとは、活動が始まる前に、物や自分を準備しておくことである。 【意味】準備する 【品詞】verb 【例文】We prepared posters for the school festival."
  },
  {
    "id": "lvd03",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-ceremony",
    "prompt": "A (c        ) is a formal event held on an important social or school occasion.",
    "answerText": "ceremony",
    "initial": "c",
    "explanation": "【正解】ceremony 【定義文和訳】ceremonyとは、社会的または学校の重要な機会に行われる正式な行事である。 【意味】式典 【品詞】noun 【例文】The graduation ceremony started at ten."
  },
  {
    "id": "lvd04",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-promise",
    "prompt": "To (p        ) is to say that you will certainly do something or will not do something.",
    "answerText": "promise",
    "initial": "p",
    "explanation": "【正解】promise 【定義文和訳】promiseとは、必ず何かをする、またはしないと言うことである。 【意味】約束する 【品詞】verb 【例文】I promise to return the book tomorrow."
  },
  {
    "id": "lvd05",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-waste",
    "prompt": "To (w        ) time, money, or energy is to use too much of it on something unnecessary.",
    "answerText": "waste",
    "initial": "w",
    "explanation": "【正解】waste 【定義文和訳】wasteとは、時間・お金・エネルギーを不要なことに使いすぎることである。 【意味】無駄に使う 【品詞】verb 【例文】Do not waste water when you brush your teeth."
  },
  {
    "id": "lvd06",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-medicine",
    "prompt": "(M        ) is something you take to cure an illness or make you feel better.",
    "answerText": "medicine",
    "initial": "m",
    "explanation": "【正解】medicine 【定義文和訳】medicineとは、病気を治したり体調をよくしたりするために飲む、または使うものである。 【意味】薬 【品詞】noun 【例文】This medicine helped my headache."
  },
  {
    "id": "lvd07",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-popular",
    "prompt": "If something is (p        ), many people like or enjoy it.",
    "answerText": "popular",
    "initial": "p",
    "explanation": "【正解】popular 【定義文和訳】popularとは、多くの人がそれを好きだったり楽しんだりしているという意味である。 【意味】人気のある 【品詞】adjective 【例文】The new café is popular with students."
  },
  {
    "id": "lvd08",
    "skill": "vocab_definition",
    "level": 3,
    "type": "text",
    "targetId": "definition-initial",
    "focusTag": "definition-initial",
    "examFormat": "text",
    "familyId": "loop3-definition-solve",
    "prompt": "To (s        ) a problem is to find the answer or a way to deal with it.",
    "answerText": "solve",
    "initial": "s",
    "explanation": "【正解】solve 【定義文和訳】solveとは、問題の答えや対処方法を見つけることである。 【意味】解く、解決する 【品詞】verb 【例文】We worked together to solve the problem."
  }
];
for (const q of replacements) {
  q.createdBy = "loop3-original-drill-replacement";
  q.originalLike = true;
  B.push(q);
}
window.ORIGINAL_DRILLS_LOOP3_AUDIT = {
  retired: Array.from(retireIds),
  added: replacements.map(q=>q.id),
  status: "HOLD_NOT_CLEAN",
  note: "summary/rebuttal/reason/vocab_definition high-severity replacement pass only; remaining fields still require audit."
};
})();
