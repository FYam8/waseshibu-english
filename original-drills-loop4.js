(()=> {
"use strict";
const B = window.DRILLS || [];
const retireIds = new Set(["cm01", "cm02", "cm03", "xcm1", "xcm2", "xcm3", "xcm4", "xcm5", "xcm6", "xcm7", "xcm8", "ncm01", "ncm02", "ncm03", "ncm04", "ncm05", "in02", "in03", "xin1", "xin2", "xin3", "xin4", "xin5", "xin6", "xin7", "nin01", "nin02", "nin03", "nin04", "nin05", "re01", "re02", "xrf1", "xrf2", "xrf3", "xrf5", "xrf6", "xrf7", "xrf8"]);
const reason = "loop4監査: 内容一致・文挿入・指示語が元過去問相当の根拠範囲／誤答構造／解説基準に不足。既存履歴保護のため非破壊retire。";
for (const q of B) {
  if (retireIds.has(q.id)) {
    q.retired = true;
    q.retiredReason = reason;
    q.legacyCompletion = true;
  }
}
const replacements = [
  {
    "id": "lcm01",
    "skill": "content_match",
    "level": 3,
    "type": "multi_choice",
    "targetId": "content-traps",
    "focusTag": "choose-two-timeline",
    "familyId": "loop4-content-choose-two-01",
    "examFormat": "multi_choice",
    "prompt": "【オリジナル類題・内容一致・2つ選択】次の英文を読み、本文と一致するものを2つ選びなさい。\nMika wanted to join the school art contest, but she almost gave up when she learned that students had to work in pairs. Her close friend Ren was already busy with a music performance. Later, a new student named Aya asked Mika to teach her how to paint clouds. During their practice, Mika realized that Aya had many good ideas. They entered the contest together and won second prize, not first prize. Afterward, Mika said she was glad that she had not worked alone.",
    "options": [
      "Mika first hesitated because the contest required pair work.",
      "Ren joined Mika in the contest after finishing his music performance.",
      "Aya helped Mika by bringing new ideas to their painting.",
      "Mika and Aya won first prize in the school art contest.",
      "Mika later said she should have worked alone."
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "【正解】ア・ウ\n【設問和訳】本文と一致するものを2つ選ぶ。\n【根拠英文】students had to work in pairs / Aya had many good ideas\n【根拠英文和訳】生徒はペアで作業しなければならなかった／アヤにはよい考えがたくさんあった。\n【なぜ正解か】ミカが一度あきらめかけた理由はペア作業で、アヤの発想が作品づくりに役立ったため。\n【他選択肢が違う理由】イ：Renは参加していない。エ：second prizeでありfirst prizeではない。オ：本文はglad that she had not worked aloneなので逆。\n【弱点】内容一致では、最初の予定・実際の相手・結果の順位を本文に戻って照合する。\n【戦略】B：2つ選択型。近い選択肢に飛びつかず、根拠の直接性を比べる。"
  },
  {
    "id": "lcm02",
    "skill": "content_match",
    "level": 3,
    "type": "multi_choice",
    "targetId": "content-traps",
    "focusTag": "choose-two-experiment",
    "familyId": "loop4-content-choose-two-02",
    "examFormat": "multi_choice",
    "prompt": "【オリジナル類題・内容一致・2つ選択】次の英文を読み、本文と一致するものを2つ選びなさい。\nA science club tested three ways to keep classroom plants alive during a hot month. The first group watered the plants every morning. The second group watered them only on Mondays. The third group used small covers that reduced strong sunlight but still let air pass through. At the end of the month, the first group’s plants were healthy, but they used the most water. The second group saved water, but several plants died. The third group used less water than the first group and kept all plants alive. The students decided to repeat the test before recommending the covers to the whole school.",
    "options": [
      "The first group used the least water and kept all plants alive.",
      "Several plants in the second group died.",
      "The third group used covers that blocked both light and air completely.",
      "The club immediately told the whole school to use the covers.",
      "The third group saved water while keeping all plants alive."
    ],
    "answer": [
      1,
      4
    ],
    "explanation": "【正解】イ・オ\n【設問和訳】本文と一致するものを2つ選ぶ。\n【根拠英文】The second group saved water, but several plants died. / The third group used less water than the first group and kept all plants alive.\n【根拠英文和訳】第2グループは水を節約したが数本が枯れた／第3グループは第1グループより水を少なく使い、全ての植物を生かした。\n【なぜ正解か】第2グループの失敗と第3グループの効果が本文に明示されている。\n【他選択肢が違う理由】ア：第1グループは最も多く水を使った。ウ：空気は通した。エ：repeat the test before recommendingなので即推薦ではない。\n【弱点】実験系の内容一致では、各グループの条件・結果・次の行動を分けて読む。\n【戦略】B：実験条件の取り違えを防ぐ。表にして読むと安定する。"
  },
  {
    "id": "lcm03",
    "skill": "content_match",
    "level": 3,
    "type": "multi_choice",
    "targetId": "content-traps",
    "focusTag": "choose-two-plan-change",
    "familyId": "loop4-content-choose-two-03",
    "examFormat": "multi_choice",
    "prompt": "【オリジナル類題・内容一致・2つ選択】次の英文を読み、本文と一致するものを2つ選びなさい。\nThe school planned to hold its sports day on the playground on Friday. On Thursday afternoon, the weather report said heavy rain might come the next morning. The teachers moved the opening ceremony to the gym, but they did not cancel the outdoor races. In fact, Friday morning was cloudy but dry, so the races were held outside as planned. Only the lunch event was moved indoors because the grass was still wet from rain earlier in the week. Some parents thought the whole sports day had been moved inside, but that was not true.",
    "options": [
      "The sports day was originally planned for the playground.",
      "The teachers canceled all outdoor races because of heavy rain.",
      "The opening ceremony was moved to the gym before Friday morning.",
      "The races were held in the gym because the grass was wet.",
      "All parents correctly understood that only the opening ceremony and lunch were indoors."
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "【正解】ア・ウ\n【設問和訳】本文と一致するものを2つ選ぶ。\n【根拠英文】planned to hold its sports day on the playground / moved the opening ceremony to the gym\n【根拠英文和訳】運動会は校庭で行う予定だった／開会式を体育館に移した。\n【なぜ正解か】当初の場所と実際に移動した部分が直接一致する。\n【他選択肢が違う理由】イ：屋外レースはcancelしていない。エ：レースはoutside。オ：some parents misunderstood とあるので逆。\n【弱点】内容一致では、全体変更か一部変更かを区別する。\n【戦略】B：予定変更問題。onlyやnot trueに近い取り違えに注意。"
  },
  {
    "id": "lcm04",
    "skill": "content_match",
    "level": 3,
    "type": "multi_choice",
    "targetId": "content-traps",
    "focusTag": "choose-two-research",
    "familyId": "loop4-content-choose-two-04",
    "examFormat": "multi_choice",
    "prompt": "【オリジナル類題・内容一致・2つ選択】次の英文を読み、本文と一致するものを2つ選びなさい。\nResearchers placed two paths in front of young bees. One path led directly to sugar water. The other path was longer and had several small wooden balls. The bees were free to choose either path. At first, most bees went straight to the sugar water. After a while, however, many younger bees began visiting the ball area and rolling the balls, even when they were not given food for doing so. Older bees visited the ball area less often. The researchers said the behavior might be play, but they also said more studies were needed.",
    "options": [
      "The bees were forced to roll the balls before receiving food.",
      "Younger bees visited the ball area more often than older bees.",
      "At first, most bees chose the path that led straight to sugar water.",
      "The researchers proved completely that bees always play for fun.",
      "The ball area was the only place where bees could get sugar water."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "【正解】イ・ウ\n【設問和訳】本文と一致するものを2つ選ぶ。\n【根拠英文】many younger bees began visiting the ball area / At first, most bees went straight to the sugar water.\n【根拠英文和訳】多くの若いハチがボールの場所を訪れ始めた／最初はほとんどのハチが砂糖水へまっすぐ向かった。\n【なぜ正解か】若いハチと年上のハチの違い、最初の行動が本文に一致する。\n【他選択肢が違う理由】ア：foodなしでも転がした。エ：might / more studies neededなので完全証明ではない。オ：砂糖水は直接の道の先にある。\n【弱点】研究内容一致では、研究者の断定度 might / need more studies を落とさない。\n【戦略】B：most・younger/older・mightを照合する。"
  },
  {
    "id": "lcm05",
    "skill": "content_match",
    "level": 3,
    "type": "multi_choice",
    "targetId": "content-traps",
    "focusTag": "choose-two-result",
    "familyId": "loop4-content-choose-two-05",
    "examFormat": "multi_choice",
    "prompt": "【オリジナル類題・内容一致・2つ選択】次の英文を読み、本文と一致するものを2つ選びなさい。\nA class hoped to collect 200 used books for a children’s library. During the first week, they collected only 70 books, so their teacher asked them to make posters and speak at morning assembly. By the final day, they had collected 180 books. They were disappointed because they had not reached the goal. Then a local bookstore donated 40 more books after hearing about the project. The class sent all 220 books to the library. They did not sell any of the books, and the project did not raise money for the school.",
    "options": [
      "The class collected fewer than 200 books by themselves.",
      "The final number of books sent to the library was over 200.",
      "The students sold some books to raise money for their school.",
      "The bookstore donated books before the students began the project.",
      "The teacher told the class to stop the project after the first week."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "【正解】ア・イ\n【設問和訳】本文と一致するものを2つ選ぶ。\n【根拠英文】they had collected 180 books / The class sent all 220 books to the library.\n【根拠英文和訳】自分たちで集めたのは180冊／全部で220冊を図書館へ送った。\n【なぜ正解か】自力分は目標未達だが、寄付で合計220冊になった。\n【他選択肢が違う理由】ウ：売っていない。エ：寄付はafter hearing about the project。オ：教師はポスターと朝礼発表を提案した。\n【弱点】数字の内容一致では、自力の数と最終合計を分ける。\n【戦略】A〜B：数量は落としやすいが、丁寧に戻れば取れる。"
  },
  {
    "id": "lcm06",
    "skill": "content_match",
    "level": 3,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-not-true",
    "familyId": "loop4-content-single-06",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致しないものを1つ選びなさい。\nJonas joined a weekend cooking class because he wanted to make dinner for his grandmother. On the first day, he burned the soup and almost went home. The teacher did not make fun of him. Instead, she showed him how to lower the heat and taste the soup little by little. After three weeks, Jonas cooked vegetable soup for his grandmother. She said it was a little salty, but she finished the bowl and asked him to cook again next month.",
    "options": [
      "Jonas wanted to cook for his grandmother.",
      "He failed at first and nearly gave up.",
      "The teacher laughed at his mistake in front of the class.",
      "His grandmother ate the soup he made after three weeks."
    ],
    "answer": 2,
    "explanation": "【正解】ウ\n【設問和訳】本文と一致しないものを1つ選ぶ。\n【根拠英文】The teacher did not make fun of him. Instead, she showed him how to lower the heat.\n【根拠英文和訳】先生は彼をからかわず、火を弱める方法を教えた。\n【なぜ正解か】ウは「先生が笑った」としており、本文の did not make fun of him と反対。\n【他選択肢が違う理由】ア・イ・エはいずれも本文に一致する。\n【弱点】NOT型は、正しい選択肢を選ぶ癖で間違えやすい。\n【戦略】B：設問の『一致しない』を丸で囲む意識。"
  },
  {
    "id": "lcm07",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-match",
    "familyId": "loop4-content-single-07",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nA small town opened a night market last summer. It was first planned for tourists, but many local families also came because the market sold cheap vegetables and warm meals. Some shop owners worried that their regular stores would lose customers. However, after two months, they found that people who visited the market often stopped at nearby stores as well. The town decided to continue the market once a week.",
    "options": [
      "The night market was canceled after two months.",
      "Only tourists were allowed to visit the night market.",
      "Some local families used the market because it sold affordable food.",
      "Nearby stores lost all their customers because of the market."
    ],
    "answer": 2,
    "explanation": "【正解】ウ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】many local families also came because the market sold cheap vegetables and warm meals\n【根拠英文和訳】安い野菜と温かい食事を売っていたため、地元の家族も多く来た。\n【なぜ正解か】ウのaffordable foodはcheap vegetables and warm mealsの言い換え。\n【他選択肢が違う理由】ア：継続された。イ：tourists向けだったが地元家族も来た。エ：nearby storesにも立ち寄った。\n【弱点】内容一致では、only/all/cancelなど強すぎる表現を疑う。\n【戦略】A〜B：言い換えを根拠英文に戻して確認。"
  },
  {
    "id": "lcm08",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-timeline",
    "familyId": "loop4-content-single-08",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nHana planned to submit her science report on Monday morning. On Sunday night, she noticed that one page of her notes was missing. She did not rewrite the whole report. She emailed her teacher and explained the problem. The teacher allowed her to bring the missing data on Tuesday, but Hana still had to submit the main report on Monday.",
    "options": [
      "Hana rewrote the whole report on Sunday night.",
      "The teacher allowed Hana to delay every part of the report until Tuesday.",
      "Hana submitted nothing on Monday.",
      "Hana was allowed to bring only the missing data later."
    ],
    "answer": 3,
    "explanation": "【正解】エ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】allowed her to bring the missing data on Tuesday, but Hana still had to submit the main report on Monday\n【根拠英文和訳】不足データは火曜日に持ってきてよいが、本体は月曜日に提出する必要があった。\n【なぜ正解か】遅れてよいのはmissing dataだけ。\n【他選択肢が違う理由】ア：全文を書き直していない。イ：every partではない。ウ：main reportは月曜提出。\n【弱点】一部変更と全体変更を区別する。\n【戦略】B：butの前後で条件が更新される問題。"
  },
  {
    "id": "lcm09",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-research-limit",
    "familyId": "loop4-content-single-09",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nA new app helped students remember English words. In a study, one group used the app for ten minutes every day, while another group wrote the words in notebooks. After four weeks, the app group remembered more words. The researchers were pleased, but they said the study was small and lasted only a short time. They plan to test the app with more students next year.",
    "options": [
      "The researchers said the app had been tested for several years.",
      "The app group remembered more words after four weeks.",
      "The notebook group remembered more words than the app group.",
      "The researchers decided that no further testing was necessary."
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】After four weeks, the app group remembered more words.\n【根拠英文和訳】4週間後、アプリのグループの方が多くの単語を覚えていた。\n【なぜ正解か】結果としてアプリ群が上回ったことが一致する。\n【他選択肢が違う理由】ア：短期間の研究。ウ：逆。エ：来年さらにテスト予定。\n【弱点】研究結果では、結果と限界を両方読む。\n【戦略】B：短いが、study was smallなどの保留表現に注意。"
  },
  {
    "id": "lcm10",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-cause-result",
    "familyId": "loop4-content-single-10",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nWhen the library changed its closing time from 6 p.m. to 8 p.m., more students began to use it after club activities. The library did not buy many new books that year. Instead, it used most of its budget to hire two part-time workers. The principal said the longer hours were useful, but he would review the cost at the end of the term.",
    "options": [
      "The library stayed open later than before.",
      "The library bought many new books with most of its budget.",
      "Students stopped using the library after club activities.",
      "The principal promised never to change the new schedule."
    ],
    "answer": 0,
    "explanation": "【正解】ア\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】changed its closing time from 6 p.m. to 8 p.m.\n【根拠英文和訳】閉館時刻を午後6時から午後8時に変更した。\n【なぜ正解か】6時から8時になったので、以前より遅くまで開いている。\n【他選択肢が違う理由】イ：予算の多くは職員雇用。ウ：利用者は増えた。エ：費用を見直すと言っておりneverではない。\n【弱点】時刻は出るが、中心は単純計算でなく内容照合。\n【戦略】A：強い語never/many/mostの取り違えを防ぐ。"
  },
  {
    "id": "lcm11",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-character",
    "familyId": "loop4-content-single-11",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nSara found a wallet on the train. She wanted to give it to the station staff, but the train was too crowded for her to move. When she got off at the next station, she took the wallet to the office. The owner called later to thank her. Sara refused the reward because she thought returning the wallet was the right thing to do.",
    "options": [
      "Sara kept the wallet because the train was crowded.",
      "Sara gave the wallet to the station office after getting off the train.",
      "The owner never contacted Sara.",
      "Sara accepted money from the owner."
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】When she got off at the next station, she took the wallet to the office.\n【根拠英文和訳】次の駅で降りた時、彼女は財布を事務所へ持っていった。\n【なぜ正解か】混雑で車内では渡せなかったが、降りてから届けた。\n【他選択肢が違う理由】ア：keepしていない。ウ：owner called later。エ：rewardを断った。\n【弱点】行動の順番を追う内容一致。\n【戦略】A：物語の時系列は取りやすい得点源。"
  },
  {
    "id": "lcm12",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-contrast",
    "familyId": "loop4-content-single-12",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nMany students liked the new cafeteria menu because it included noodles and fruit. However, a few students with food allergies said the menu labels were not clear. The school did not remove the new menu. It decided to add clearer labels and ask students to report any foods they could not eat.",
    "options": [
      "The school removed the new menu after a few complaints.",
      "All students disliked the new cafeteria menu.",
      "The school kept the menu but improved the labels.",
      "Students were told not to report their allergies."
    ],
    "answer": 2,
    "explanation": "【正解】ウ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】The school did not remove the new menu. It decided to add clearer labels.\n【根拠英文和訳】学校は新メニューをなくさず、より分かりやすい表示を加えることにした。\n【なぜ正解か】keep + improve labels が正しい内容。\n【他選択肢が違う理由】ア：removeしていない。イ：many students liked。エ：reportするよう求めた。\n【弱点】Howeverの後の問題点と解決策を両方読む。\n【戦略】B：対比後の処理を正確に照合。"
  },
  {
    "id": "lcm13",
    "skill": "content_match",
    "level": 3,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-not-true",
    "familyId": "loop4-content-single-13",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致しないものを1つ選びなさい。\nA group of volunteers cleaned a river every Sunday in June. They expected to find mostly plastic bottles, but they also found many broken umbrellas after several rainy days. They counted the trash before recycling it. The number of plastic bottles decreased each week, but the volunteers said this did not prove the river was already clean. They planned to continue the activity in July.",
    "options": [
      "The volunteers cleaned the river on Sundays in June.",
      "They found only plastic bottles in the river.",
      "The number of plastic bottles went down each week.",
      "The volunteers planned to keep working in July."
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】本文と一致しないものを1つ選ぶ。\n【根拠英文】they also found many broken umbrellas\n【根拠英文和訳】壊れた傘もたくさん見つけた。\n【なぜ正解か】only plastic bottles は本文と反対。\n【他選択肢が違う理由】ア・ウ・エは本文と一致する。\n【弱点】only型の誤答を見抜く。\n【戦略】B：一致しないものは、本文のalso/butが根拠になりやすい。"
  },
  {
    "id": "lcm14",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-purpose",
    "familyId": "loop4-content-single-14",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nThe museum started a quiet morning program for visitors who did not enjoy crowded places. Tickets for this program were not cheaper than regular tickets, but fewer people were allowed to enter during the first hour. Some families with small children also liked the program because the rooms were easier to walk through.",
    "options": [
      "The quiet morning tickets were cheaper than regular tickets.",
      "The program limited the number of visitors during the first hour.",
      "Only adults were allowed to join the quiet morning program.",
      "The program was made for people who wanted louder events."
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】fewer people were allowed to enter during the first hour\n【根拠英文和訳】最初の1時間は入れる人数が少なくされた。\n【なぜ正解か】人数制限が本文に一致する。\n【他選択肢が違う理由】ア：安くない。ウ：families with small childrenも利用。エ：quiet/crowdedが逆。\n【弱点】not cheaperなど否定を落とさない。\n【戦略】A：短い本文だが否定語が得点差になる。"
  },
  {
    "id": "lcm15",
    "skill": "content_match",
    "level": 2,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-final-decision",
    "familyId": "loop4-content-single-15",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nAt first, the hiking club planned to climb Mount Kiri on Saturday. The guide later warned them that the path near the top was closed. The students did not cancel the trip. They chose a shorter path to a lake instead. They were disappointed about missing the mountain view, but they enjoyed eating lunch by the water.",
    "options": [
      "The club finally climbed to the top of Mount Kiri.",
      "The guide told them that part of the mountain path was closed.",
      "The students canceled the whole trip.",
      "They ate lunch before deciding where to go."
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】the path near the top was closed\n【根拠英文和訳】頂上付近の道が閉鎖されていた。\n【なぜ正解か】ガイドの警告内容が一致する。\n【他選択肢が違う理由】ア：湖への短い道に変更。ウ：中止していない。エ：昼食は湖で。\n【弱点】at firstとfinallyを区別する。\n【戦略】A〜B：予定変更の最終決定を追う。"
  },
  {
    "id": "lcm16",
    "skill": "content_match",
    "level": 3,
    "type": "choice",
    "targetId": "content-traps",
    "focusTag": "single-research-quote",
    "familyId": "loop4-content-single-16",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・内容一致・1つ選択】次の英文を読み、本文と一致するものを1つ選びなさい。\nDr. Ito studied children who walked to school in groups. The study did not show that walking in groups made children get higher test scores. However, it suggested that children who walked together arrived on time more often and felt safer on narrow roads. Dr. Ito said schools should not force every child to walk, but they could help families create safe walking groups if they wanted to.",
    "options": [
      "The study proved that walking in groups improves test scores.",
      "Dr. Ito said every child must be forced to walk to school.",
      "The study suggested that group walking may help punctuality and safety.",
      "Children in the study felt less safe on narrow roads."
    ],
    "answer": 2,
    "explanation": "【正解】ウ\n【設問和訳】本文と一致するものを1つ選ぶ。\n【根拠英文】arrived on time more often and felt safer on narrow roads\n【根拠英文和訳】より時間通りに到着し、狭い道でより安全だと感じた。\n【なぜ正解か】punctuality and safety が本文の内容と一致する。\n【他選択肢が違う理由】ア：test scoresは示していない。イ：force every childではない。エ：saferの逆。\n【弱点】研究の『示したこと／示していないこと』を分ける。\n【戦略】B：not show / however / could の慎重表現を読む。"
  },
  {
    "id": "lin01",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-01",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “To test this idea, they designed a simple experiment.”\nSome students noticed that plants near the music room seemed to grow faster. [1] They wondered whether sound affected plant growth. [2] One group of plants was kept in a quiet room, and another group was placed near soft music. [3] After four weeks, the students compared the height of the plants. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】They wondered whether sound affected plant growth. / One group of plants was kept...\n【根拠英文和訳】They wondered whether sound affected plant growth. / One group of plants was kept...\n【なぜ正解か】挿入文は『この考えを試す』なので、疑問・仮説の後、実験内容の前に入る。\n【他選択肢が違う理由】[1]はideaがまだ出ていない。[3]は実験内容の途中。[4]は結果比較の直前で遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin02",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-02",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “However, this benefit came with an unexpected problem.”\nThe city opened a new bicycle lane beside the river. [1] More students began cycling to school, and traffic near the station decreased. [2] Some older residents said walkers now had less space on the riverside path. [3] City officers decided to separate the walking area from the bicycle lane. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】traffic near the station decreased / Some older residents said walkers now had less space\n【根拠英文和訳】traffic near the station decreased / Some older residents said walkers now had less space\n【なぜ正解か】benefitは交通減少、problemは歩行者スペース不足。メリットの後、問題の前が自然。\n【他選択肢が違う理由】[1]はbenefit前。[3]は問題の後でHoweverの転換が弱い。[4]は解決策後で遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin03",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-03",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “This difference made the second result more reliable.”\nThe researchers first asked ten people to try the new chair. [1] Later, they asked two hundred people of different ages to try it. [2] Most of the larger group said the chair was comfortable. [3] The company used the second result when improving the design. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 2,
    "explanation": "【正解】ウ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】ten people / two hundred people of different ages / used the second result\n【根拠英文和訳】ten people / two hundred people of different ages / used the second result\n【なぜ正解か】this differenceは人数と年齢幅の違いを受け、次の文のsecond resultにつながる。\n【他選択肢が違う理由】[1]はsecond resultがまだない。[2]は差の説明直後でも可能に見えるが、reliableと言う根拠はlarger groupの結果が出る前なので弱い。[4]はusedの後で説明が遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin04",
    "skill": "insertion",
    "level": 2,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-04",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “For this reason, they changed the schedule again.”\nThe outdoor concert was moved from Saturday to Sunday because of rain. [1] On Friday night, the forecast said that Sunday would also be stormy. [2] The organizers decided to hold the concert in the school hall. [3] They emailed the new plan to all performers. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】Sunday would also be stormy / decided to hold the concert in the school hall\n【根拠英文和訳】Sunday would also be stormy / decided to hold the concert in the school hall\n【なぜ正解か】日曜も荒天という理由を受け、次の文で『体育館で行う』という再変更の内容につながる。\n【他選択肢が違う理由】[1]は理由がまだない。[3]は具体的な変更後で遅い。[4]は連絡後で不自然。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin05",
    "skill": "insertion",
    "level": 2,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-05",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “This was the question the researchers wanted to answer.”\nSome birds share food with birds that are not their family members. [1] Do they do this because they expect help later, or simply because food is available? [2] The team watched fifty birds for three months. [3] They recorded who shared food and what happened afterward. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】Do they do this because...? / watched fifty birds\n【根拠英文和訳】Do they do this because...? / watched fifty birds\n【なぜ正解か】Thisは直前の疑問文全体を受け、次の観察方法につなぐ。\n【他選択肢が違う理由】[1]はquestionがまだ提示されていない。[3]は研究方法の途中。[4]は記録内容後で遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin06",
    "skill": "insertion",
    "level": 2,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-06",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “Before then, no one in the village had used a computer.”\nThe village office received its first computer in 2010. [1] At first, the workers wrote every instruction by hand because they were afraid of making mistakes. [2] A young volunteer taught them how to save files and print letters. [3] Within a year, the office could send documents much faster. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 0,
    "explanation": "【正解】ア\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】received its first computer in 2010 / At first, the workers...\n【根拠英文和訳】received its first computer in 2010 / At first, the workers...\n【なぜ正解か】Before thenは2010年以前を指すので、最初のコンピュータ到着の直後が自然。\n【他選択肢が違う理由】[2]以降ではthenが何を指すか不明になり、時系列が崩れる。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin07",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-07",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “These two results did not match.”\nThe first test showed that the water was safe to drink. [1] A second test at another laboratory found a small amount of harmful metal. [2] The town asked both laboratories to check their machines. [3] Until the cause was clear, residents were told to drink bottled water. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】first test showed safe / second test found harmful metal / check their machines\n【根拠英文和訳】first test showed safe / second test found harmful metal / check their machines\n【なぜ正解か】These two results は直前までに出た2つの結果を受け、その不一致が次の再確認につながる。\n【他選択肢が違う理由】[1]は結果が1つだけ。[3]は再確認後で遅い。[4]は住民への指示後で説明が遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin08",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-08",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “In other words, the machine helped but did not solve everything.”\nThe new sorting machine separated plastic bottles from other trash much faster than workers could. [1] However, workers still had to remove dirty bottles by hand. [2] The manager said he would keep both the machine and the trained staff. [3] He planned to buy one more machine next year. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】much faster than workers could / still had to remove dirty bottles by hand\n【根拠英文和訳】much faster than workers could / still had to remove dirty bottles by hand\n【なぜ正解か】機械の利点と限界の両方が出た直後に、『役立つが全てを解決しない』とまとめるのが自然。\n【他選択肢が違う理由】[1]は限界がまだ出ていない。[3]は管理者の判断後で説明が遅い。[4]は次年度計画後で不自然。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin09",
    "skill": "insertion",
    "level": 2,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-09",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “The third group served as a comparison.”\nOne group of students used tablets to study vocabulary. [1] Another group used paper cards. [2] A third group studied the same words without any special tool. [3] By comparing the three groups, the teacher could see whether the tools made a difference. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 2,
    "explanation": "【正解】ウ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】A third group studied... without any special tool / comparing the three groups\n【根拠英文和訳】A third group studied... without any special tool / comparing the three groups\n【なぜ正解か】third groupの役割説明なので、第三群の説明直後かつ比較文の前が自然。\n【他選択肢が違う理由】[1][2]はthird group未提示。[4]は比較した後で役割説明が遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin10",
    "skill": "insertion",
    "level": 2,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-10",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “Instead, they learned it from watching older birds.”\nYoung birds in the study did not know how to open the box at first. [1] When they stayed with adult birds, they began to copy the adults’ movements. [2] After several days, some young birds opened the box by themselves. [3] This showed that the skill was not only a matter of age. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 0,
    "explanation": "【正解】ア\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】did not know... at first / copy the adults’ movements\n【根拠英文和訳】did not know... at first / copy the adults’ movements\n【なぜ正解か】Insteadは『最初はできなかった』に対し、年齢だけでなく観察から学んだことを示す。次のcopyの具体例につながる。\n【他選択肢が違う理由】[2]は学び方の具体例後で少し遅い。[3][4]は結果・結論後で不自然。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin11",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-11",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “This is why the first plan failed.”\nThe club wanted to start cleaning the beach at 7 a.m. [1] They forgot that the only bus arrived at the beach at 8:30. [2] Everyone finally began working after nine. [3] For the next event, they checked the bus schedule before choosing a time. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】forgot that the only bus arrived at 8:30 / began working after nine\n【根拠英文和訳】forgot that the only bus arrived at 8:30 / began working after nine\n【なぜ正解か】Thisはバス時刻の見落としを受け、first plan failedの理由として説明する。次の実際の遅れにつながる。\n【他選択肢が違う理由】[1]は失敗理由がまだない。[3]は結果後で説明が遅い。[4]は次回対策後で不自然。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin12",
    "skill": "insertion",
    "level": 3,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-12",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “The discovery surprised the team because they had expected the opposite.”\nThe team believed that the larger fish would scare away the smaller fish. [1] In the video, however, smaller fish stayed closer to the food when larger fish were nearby. [2] The researchers repeated the observation at three different reefs. [3] They found the same pattern each time. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】believed larger fish would scare away smaller fish / however, smaller fish stayed closer\n【根拠英文和訳】believed larger fish would scare away smaller fish / however, smaller fish stayed closer\n【なぜ正解か】expected the oppositeは仮説と結果の逆転を受ける。surprisedの後、再観察につながる。\n【他選択肢が違う理由】[1]は発見前。[3]は再観察後で驚きの理由説明が遅い。[4]は全結果後で位置が遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin13",
    "skill": "insertion",
    "level": 2,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-13",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “For example, they practiced checking the source of online photos.”\nThe media class taught students how to avoid believing false information. [1] Students also compared two articles about the same event. [2] At the end of the lesson, they wrote down three questions to ask before sharing news online. [3] The teacher said these habits would help them outside school too. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 0,
    "explanation": "【正解】ア\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】avoid believing false information / checking the source of online photos\n【根拠英文和訳】avoid believing false information / checking the source of online photos\n【なぜ正解か】一般的な授業目的の直後に、具体例としてsource checkingを置く。次の比較活動にもつながる。\n【他選択肢が違う理由】[2]は別活動の後でFor exampleの範囲が曖昧。[3][4]はまとめ後で遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lin14",
    "skill": "insertion",
    "level": 2,
    "type": "choice",
    "targetId": "insertion-cohesion",
    "focusTag": "insertion-two-clues",
    "familyId": "loop4-insertion-14",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・文挿入】次の英文を入れる最も適切な位置を選びなさい。\n挿入文: “As a result, the number of accidents fell the next month.”\nThe school put bright lights near the bicycle parking area. [1] Students could see the steps more clearly after club activities. [2] The principal thanked the students who had suggested the lights. [3] He also asked them to report any other dangerous places. [4]",
    "options": [
      "[1]",
      "[2]",
      "[3]",
      "[4]"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】挿入文を入れる最も自然な位置を選ぶ。\n【根拠英文】put bright lights / see the steps more clearly\n【根拠英文和訳】put bright lights / see the steps more clearly\n【なぜ正解か】As a resultは明るくなった効果を受け、事故減少という結果を示す。感謝文の前が自然。\n【他選択肢が違う理由】[1]は原因直後でも可能に見えるが、stepsが見えやすいという直接の改善を受ける[2]後がより自然。[3][4]は感謝・依頼後で遅い。\n【弱点】文挿入は、接続語だけでなく指示語・時系列・因果・前後の内容を2つ以上見る。\n【戦略】B：候補位置の前後1文を必ず両方確認する。"
  },
  {
    "id": "lrf01",
    "skill": "reference",
    "level": 3,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "event-reference",
    "familyId": "loop4-reference-01",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】Mina sent the wrong file to her teacher. She noticed the mistake, wrote an apology, and sent the correct file before dinner. Her teacher said that this showed responsibility. “this” が指す内容として最も適切なものは？",
    "options": [
      "the wrong file itself",
      "Mina’s noticing the mistake and correcting it",
      "the teacher’s dinner plan",
      "the subject of the file"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】She noticed the mistake, wrote an apology, and sent the correct file\n【根拠英文和訳】彼女は間違いに気づき、謝罪を書き、正しいファイルを送った。\n【なぜ正解か】thisは単語1つではなく、間違いを認めて直した一連の行動を指す。\n【他選択肢が違う理由】アは物だけ。ウ・エは本文の評価対象ではない。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf02",
    "skill": "reference",
    "level": 3,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "action-reference",
    "familyId": "loop4-reference-02",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】Researchers put dark stickers on the glass walls of a station. Before the stickers were added, many birds hit the glass because they could not see it. Afterward, far fewer birds were hurt. This simple change was later used in other buildings. “This simple change” が指す内容は？",
    "options": [
      "putting stickers on the glass walls",
      "birds hitting the glass",
      "the station becoming larger",
      "using other buildings"
    ],
    "answer": 0,
    "explanation": "【正解】ア\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】put dark stickers on the glass walls / far fewer birds were hurt\n【根拠英文和訳】ガラスの壁に暗いシールを貼った／けがをする鳥がかなり減った。\n【なぜ正解か】This simple changeは鳥を守るためのシール設置という対策を指す。\n【他選択肢が違う理由】イは問題点。ウは本文にない。エは後で起きた利用先。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf03",
    "skill": "reference",
    "level": 2,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "event-reference",
    "familyId": "loop4-reference-03",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】Tom first told Ken that he was too busy to help with the broken chair. Ten minutes later, Tom came back carrying tools and began fixing it quietly. Ken thanked him for that. “that” が指す内容は？",
    "options": [
      "saying he was too busy",
      "coming back and helping fix the chair",
      "breaking the chair",
      "thanking Ken"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】came back carrying tools and began fixing it quietly\n【根拠英文和訳】工具を持って戻り、静かに修理を始めた。\n【なぜ正解か】Kenが感謝した対象は、Tomが戻って実際に助けたこと。\n【他選択肢が違う理由】アは最初の拒否。ウ・エは感謝対象ではない。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf04",
    "skill": "reference",
    "level": 3,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "plan-reference",
    "familyId": "loop4-reference-04",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】The student council suggested that every class clean the park once a month. Some students worried that the plan would take too much time, but others said it would make the park safer. After a long discussion, it was accepted. “it” が指す内容は？",
    "options": [
      "the park itself",
      "the monthly park-cleaning plan",
      "the long discussion",
      "the students’ worry"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】every class clean the park once a month / the plan / it was accepted\n【根拠英文和訳】全クラスが月1回公園を掃除する案／その計画／それが承認された。\n【なぜ正解か】acceptedされるのは場所や心配ではなく、提案された計画。\n【他選択肢が違う理由】アは場所。ウは承認される対象ではない。エは反対理由。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf05",
    "skill": "reference",
    "level": 3,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "behavior-reference",
    "familyId": "loop4-reference-05",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】Some crows leave nuts on roads so that cars will break the shells. Then they wait for the traffic light to stop the cars before collecting the food. Such behavior shows that the birds can use human activity to solve a problem. “Such behavior” が指す内容は？",
    "options": [
      "birds using cars and traffic lights to open nuts safely",
      "cars stopping at traffic lights",
      "people feeding crows near roads",
      "nuts being too hard for people to eat"
    ],
    "answer": 0,
    "explanation": "【正解】ア\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】leave nuts on roads so that cars will break the shells / wait for the traffic light\n【根拠英文和訳】車に殻を割らせるため道路に木の実を置き、信号で車が止まるのを待つ。\n【なぜ正解か】Such behaviorは前の2文で説明されたカラスの一連の行動全体。\n【他選択肢が違う理由】イは行動の一部。ウ・エは本文にない。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf06",
    "skill": "reference",
    "level": 2,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "clause-reference",
    "familyId": "loop4-reference-06",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】Aki promised to keep a practice diary, but she stopped after a week. When her coach asked why her progress was slow, Aki admitted it. The coach told her to start again. “it” が指す内容は？",
    "options": [
      "her slow progress itself",
      "her stopping the practice diary",
      "her coach’s question",
      "the next practice game"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】she stopped after a week / Aki admitted it\n【根拠英文和訳】彼女は1週間でやめた／アキはそれを認めた。\n【なぜ正解か】admittedの目的語は、日記を続けなかった事実。\n【他選択肢が違う理由】アは結果に近いが、認めた直接内容ではない。ウ・エは違う。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf07",
    "skill": "reference",
    "level": 3,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "cause-reference",
    "familyId": "loop4-reference-07",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】The old map showed the river and the temple correctly, but it did not show the new road to the museum. This made it difficult for visitors to use the map. “This” が指す内容は？",
    "options": [
      "the river and temple being old",
      "the map not showing the new road",
      "the museum being popular",
      "visitors using the map easily"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】it did not show the new road to the museum\n【根拠英文和訳】博物館へ行く新しい道が載っていなかった。\n【なぜ正解か】Thisは直前の欠けている情報を受け、それが使いにくさの原因になっている。\n【他選択肢が違う理由】アは問題ではない。ウは本文にない。エは逆。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf08",
    "skill": "reference",
    "level": 2,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "multi-action-reference",
    "familyId": "loop4-reference-08",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】The class collected bottles, washed them, and sold them to a recycling center. These efforts paid for new flowers in the school garden. “These efforts” が指す内容は？",
    "options": [
      "collecting, washing, and selling the bottles",
      "planting flowers before collecting bottles",
      "the recycling center’s workers",
      "the garden becoming larger"
    ],
    "answer": 0,
    "explanation": "【正解】ア\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】collected bottles, washed them, and sold them\n【根拠英文和訳】瓶を集め、洗い、売った。\n【なぜ正解か】These effortsはクラスが行った複数の活動全体を指す。\n【他選択肢が違う理由】イは順序が逆。ウ・エは努力の主体や内容ではない。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  },
  {
    "id": "lrf09",
    "skill": "reference",
    "level": 3,
    "type": "choice",
    "targetId": "reference-cohesion",
    "focusTag": "event-cause-reference",
    "familyId": "loop4-reference-09",
    "examFormat": "choice",
    "prompt": "【オリジナル類題・指示語】The doctor advised Ryo to rest for two days, but he went to soccer practice that evening. His ankle became worse, and that made his recovery longer. “that” が指す内容は？",
    "options": [
      "the doctor giving advice",
      "Ryo ignoring the advice and worsening his ankle",
      "soccer practice ending early",
      "his recovery becoming shorter"
    ],
    "answer": 1,
    "explanation": "【正解】イ\n【設問和訳】下線部・指示語が何を指すか選ぶ。\n【根拠英文】he went to soccer practice / His ankle became worse\n【根拠英文和訳】彼はサッカーの練習に行った／足首が悪化した。\n【なぜ正解か】thatは忠告を無視して悪化した状況を受け、回復が長引いた原因になっている。\n【他選択肢が違う理由】アは原因全体ではない。ウは本文にない。エは逆。\n【弱点】指示語は直前の名詞だけでなく、前文全体・行動・計画・考えを受けることがある。\n【戦略】A〜B：候補語だけでなく、指示語を元の内容に置き換えて文が自然か確認する。"
  }
];
for (const q of replacements) B.push(q);
window.ORIGINAL_DRILLS_LOOP4_AUDIT = {
  retired: [...retireIds],
  added: replacements.map(q=>q.id),
  note: "content_match / insertion / reference を非破壊置換。UI skillは既存分野を維持し、targetId/focusTagで内部細分化。"
};
})(); 
