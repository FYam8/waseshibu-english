(()=>{"use strict";
const B=window.DRILLS||[];
const retireIds=new Set(["nsu01", "nsu02", "nsu03", "nsu04", "nsu05", "lsu01", "lsu02", "lsu03", "lsu04", "lsu05", "lsu06", "lsu07", "lsu08", "lsu09", "lsu10"]);
for(const q of B){if(retireIds.has(q.id)){q.retired=true;q.retiredBy="summary15-loop2";q.retiredReason="summary15-loop2監査: 本文分量・不要情報・重要情報選択の負荷が2022〜2023本番型に不足。既存履歴保護のため非破壊retire。";q.legacyCompletion=true;}}
const replacements=[
  {
    "id": "lsu11",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-museum-map",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nA girl named Sara visited a large museum with her uncle. At the entrance, he gave her a colorful map and told her to look at it whenever she felt lost. Sara wanted to see the dinosaur room first, so she ran ahead while her uncle was buying tickets. Soon she found herself in a quiet hall full of paintings. She asked two visitors where the dinosaur room was, but they were tourists and could not answer. Then Sara remembered the map. She looked for the entrance mark, found the room number for the dinosaurs, and followed the arrows. When her uncle arrived, Sara was already waiting there and smiling. She learned that a tool is useful only when she remembers to use it.",
    "model": "Sara got lost in a museum after running ahead, but she remembered her map and used it to find the dinosaur room. She learned that a useful tool helps only when people use it.",
    "check": [
      "Saraが迷ったこと",
      "地図を思い出して使ったこと",
      "恐竜の部屋に着いたこと",
      "教訓を入れること"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、道具そのものではなく、それを正しく使えるかが結論になる短い教訓型。\n【残す要点】Saraが迷ったこと／地図を思い出して使ったこと／恐竜の部屋に着いたこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Sara got lost in a museum after running ahead, but she remembered her map and used it to find the dinosaur room. She learned that a useful tool helps only when people use it.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu12",
    "focusTag": "summary-2023",
    "familyId": "summary-loop2-farmer-radio",
    "maxWords": 50,
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nMika lived in a mountain village where the weather changed quickly. Her family grew vegetables, and her father always listened to a small radio before working in the fields. Mika thought the radio was old-fashioned because her phone showed colorful weather pictures. One morning, her phone said the day would be sunny, so she told her father they could leave the vegetables outside to dry. However, the radio warned that a storm was coming from the west. Her father covered the vegetables with sheets and asked Mika to help. She complained because the sky was still blue. By late afternoon, heavy rain began to fall. The vegetables stayed dry, and Mika finally understood why her father trusted both experience and information.",
    "model": "Mika trusted her phone and thought the weather would be sunny, but her father followed a radio warning and covered their vegetables. When heavy rain came, she understood the value of experience and reliable information.",
    "check": [
      "Mikaがスマホ情報を信じたこと",
      "父がラジオ警報に従ったこと",
      "野菜を守れたこと",
      "学んだこと"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】50語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2023年度大問4と同じく、人物の初期状態・変化・結論を50語以内で整理する型。\n【残す要点】Mikaがスマホ情報を信じたこと／父がラジオ警報に従ったこと／野菜を守れたこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Mika trusted her phone and thought the weather would be sunny, but her father followed a radio warning and covered their vegetables. When heavy rain came, she understood the value of experience and reliable information.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu13",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-broken-clock",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nTom was proud of the old clock in his room because it had belonged to his grandfather. Every morning, he woke up when it rang at six thirty. One day, the clock stopped, but Tom did not notice. He stayed in bed until his little sister shouted that breakfast was over. Tom hurried to school without checking the time. When he arrived, the classroom was empty because his class had already gone to the station for a field trip. His teacher called his mother, and Tom had to join them later by bus. That evening, he put a small note on his desk: “Do not depend on only one thing.”",
    "model": "Tom depended on his old clock, but it stopped and he missed the start of a school trip. He learned that he should not rely on only one thing.",
    "check": [
      "古い時計に頼っていたこと",
      "時計が止まったこと",
      "遠足に遅れたこと",
      "教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、短い物語から誤解・失敗の原因と教訓を残す型。\n【残す要点】古い時計に頼っていたこと／時計が止まったこと／遠足に遅れたこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Tom depended on his old clock, but it stopped and he missed the start of a school trip. He learned that he should not rely on only one thing.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu14",
    "focusTag": "summary-2023",
    "familyId": "summary-loop2-two-shops",
    "maxWords": 50,
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nTwo fruit shops stood on the same street. One owner, Mr. Lee, spent a lot of money on bright signs and music to attract customers. He often said that a shop only needed to look exciting. The other owner, Ms. Arai, kept her shop simple. She cleaned the shelves carefully, remembered what regular customers liked, and replaced damaged fruit every morning. At first, more people entered Mr. Lee’s shop because it looked lively. However, many of them did not return after buying old fruit. Slowly, people began to choose Ms. Arai’s shop instead. Mr. Lee finally realized that decorations might bring customers once, but trust brings them back.",
    "model": "Mr. Lee attracted customers with bright signs, while Ms. Arai focused on clean shelves and good fruit. Customers gradually chose Ms. Arai’s shop, teaching Mr. Lee that trust is more important than appearances.",
    "check": [
      "2人の対比",
      "最初は派手な店が目立ったこと",
      "最終的に信頼される店が選ばれたこと",
      "教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】50語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2023年度大問4と同じく、2人物の対比から状態変化と結論をまとめる型。\n【残す要点】2人の対比／最初は派手な店が目立ったこと／最終的に信頼される店が選ばれたこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Mr. Lee attracted customers with bright signs, while Ms. Arai focused on clean shelves and good fruit. Customers gradually chose Ms. Arai’s shop, teaching Mr. Lee that trust is more important than appearances.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu15",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-library-card",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nA boy named Leo wanted to borrow a famous adventure book from the library. He searched every shelf but could not find it. He asked the librarian many times, and she gently told him to check the computer catalog. Leo thought that was unnecessary because he knew the author’s name. After twenty minutes, he became tired and finally used the catalog. It showed that the book was not on the adventure shelf but on a special display near the entrance. Leo found it in a few seconds. He laughed and thanked the librarian, realizing that asking the right question can save more time than searching blindly.",
    "model": "Leo could not find a library book because he searched blindly. After using the computer catalog, he found it quickly and learned that the right method saves time.",
    "check": [
      "本を探したが見つからなかったこと",
      "カタログを使ったこと",
      "すぐ見つかったこと",
      "教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、不要な細部を削り、問題→本当の解決法→教訓を40語以内でまとめる型。\n【残す要点】本を探したが見つからなかったこと／カタログを使ったこと／すぐ見つかったこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Leo could not find a library book because he searched blindly. After using the computer catalog, he found it quickly and learned that the right method saves time.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu16",
    "focusTag": "summary-2023",
    "familyId": "summary-loop2-new-student",
    "maxWords": 50,
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nWhen Daniel entered a new school, he decided not to speak much. At his old school, classmates had laughed at his accent, so he believed staying quiet was safer. During group work, he wrote good ideas in his notebook but rarely shared them. One day, his group had to design a poster about saving water. The other students could not decide on a clear message. Daniel quietly showed them a drawing he had made at home. Everyone liked it and asked him to explain. He spoke nervously, but nobody laughed. His idea helped the group win first prize. After that, Daniel began to join discussions and learned that one bad experience should not control every new chance.",
    "model": "Daniel stayed quiet at his new school because classmates had once laughed at his accent. After his poster idea helped his group win, he gained confidence and learned not to let one bad experience control new chances.",
    "check": [
      "過去の嫌な経験",
      "新しい学校で黙っていたこと",
      "ポスター活動で認められたこと",
      "自信・教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】50語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2023年度大問4と同じく、人物の心情・行動の変化と結論を要約する型。\n【残す要点】過去の嫌な経験／新しい学校で黙っていたこと／ポスター活動で認められたこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Daniel stayed quiet at his new school because classmates had once laughed at his accent. After his poster idea helped his group win, he gained confidence and learned not to let one bad experience control new chances.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu17",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-seed-box",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nA class planted flower seeds in small boxes for the school festival. Most students watered their seeds every day, but Rina poured a lot of water into her box at once because she wanted her flowers to grow faster. She also placed the box in the hottest place by the window. A week later, her friends’ seeds had small green leaves, but Rina’s seeds had rotted. The teacher explained that plants need the right amount of water and sunlight, not simply more of everything. Rina planted new seeds and followed the instructions carefully. There were many small details in the story, but only the main problem, action, result, and lesson are needed for the summary.",
    "model": "Rina gave her seeds too much water and heat because she wanted them to grow quickly, but they rotted. She learned that plants need the right amount of care.",
    "check": [
      "水と日光を与えすぎたこと",
      "種が腐ったこと",
      "適量が大切という教訓",
      "40語以内"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、失敗の原因と教訓を短くまとめる型。\n【残す要点】水と日光を与えすぎたこと／種が腐ったこと／適量が大切という教訓\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Rina gave her seeds too much water and heat because she wanted them to grow quickly, but they rotted. She learned that plants need the right amount of care.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu18",
    "focusTag": "summary-2023",
    "familyId": "summary-loop2-bus-plan",
    "maxWords": 50,
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nThe town of Greenhill had a traffic problem every Saturday. Many families drove to the shopping area, and cars filled the narrow streets. The town tried adding parking spaces, but this only brought more cars. Then a group of students suggested a weekend shuttle bus from the train station. Some shop owners disliked the idea because they thought fewer drivers would mean fewer customers. The town tested the bus for two months. The bus was cheap, came every fifteen minutes, and stopped near the main stores. Traffic became lighter, and more people visited because walking around felt safer. The shop owners changed their minds and asked the town to continue the service.",
    "model": "Greenhill had heavy Saturday traffic, and adding parking did not help. After students suggested a cheap shuttle bus, traffic became lighter and more people visited. Shop owners then supported continuing the service.",
    "check": [
      "交通問題",
      "駐車場では解決しなかったこと",
      "シャトルバス実験",
      "結果と考えの変化"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】50語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2023年度大問4と同じく、問題→試した解決策→結果→人物/集団の考えの変化をまとめる型。\n【残す要点】交通問題／駐車場では解決しなかったこと／シャトルバス実験\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Greenhill had heavy Saturday traffic, and adding parking did not help. After students suggested a cheap shuttle bus, traffic became lighter and more people visited. Shop owners then supported continuing the service.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu19",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-cake-salt",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nMina wanted to bake a cake for her brother’s birthday. Her grandmother wrote the recipe on a small card and told her to read it carefully. Mina was excited and hurried through the steps. She added flour, eggs, and milk correctly, but she mistook salt for sugar because both were in white containers. The cake looked beautiful when it came out of the oven. Everyone smiled until they tasted it. Mina felt embarrassed, but her grandmother said, “A pretty result is not enough if you ignore the details.” Mina made another cake slowly, checking each label first. There were many small details in the story, but only the main problem, action, result, and lesson are needed for the summary.",
    "model": "Mina hurried while baking and mistook salt for sugar, so her beautiful cake tasted bad. She learned that details matter and made another cake carefully.",
    "check": [
      "急いで作ったこと",
      "塩と砂糖を間違えたこと",
      "見た目だけでは不十分",
      "教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、短い失敗談から原因と教訓を選ぶ型。\n【残す要点】急いで作ったこと／塩と砂糖を間違えたこと／見た目だけでは不十分\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Mina hurried while baking and mistook salt for sugar, so her beautiful cake tasted bad. She learned that details matter and made another cake carefully.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu20",
    "focusTag": "summary-2023",
    "familyId": "summary-loop2-bird-feeder",
    "maxWords": 50,
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nA science club wanted more birds to visit the school garden. First, the members bought an expensive bird feeder and placed it in the center of the garden. They filled it with seeds, but almost no birds came. Some students thought the feeder was useless. One member, Haru, watched the garden quietly for several days. He noticed that cats often walked near the center, while birds stayed in the trees along the fence. The club moved the feeder to a higher branch near the fence and planted bushes below it. Soon birds began to visit every morning. The students learned that observing an animal’s behavior is more important than simply buying equipment.",
    "model": "A science club bought a bird feeder, but few birds came because it was placed near cats. After Haru observed the garden, they moved it to a safer place and learned that observation matters more than equipment.",
    "check": [
      "高価な餌台だけでは失敗",
      "Haruが観察したこと",
      "安全な場所へ移したこと",
      "教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】50語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2023年度大問4と同じく、不要情報を捨て、失敗→観察→改善→教訓をまとめる型。\n【残す要点】高価な餌台だけでは失敗／Haruが観察したこと／安全な場所へ移したこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】A science club bought a bird feeder, but few birds came because it was placed near cats. After Haru observed the garden, they moved it to a safer place and learned that observation matters more than equipment.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu21",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-bicycle-light",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nKen bought a small light for his bicycle but did not attach it. He thought he would only ride during the day. One evening, his friend asked him to bring a notebook to her house before a test. Ken left while the sky was still bright, but he stayed longer than planned to help her study. On his way home, the road became dark. A driver almost did not see him, and Ken had to stop suddenly. The next morning, he attached the light and checked it before riding. He understood that safety tools are useless if they are left in a bag. There were many small details in the story, but only the main problem, action, result, and lesson are needed for the summary.",
    "model": "Ken bought a bicycle light but did not attach it, so he was almost hit while riding in the dark. He learned that safety tools are useful only when prepared beforehand.",
    "check": [
      "ライトを買ったが付けなかったこと",
      "暗い道で危険だったこと",
      "準備の大切さ",
      "40語以内"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、道具と本当の問題の関係を要約する型。\n【残す要点】ライトを買ったが付けなかったこと／暗い道で危険だったこと／準備の大切さ\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Ken bought a bicycle light but did not attach it, so he was almost hit while riding in the dark. He learned that safety tools are useful only when prepared beforehand.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu22",
    "focusTag": "summary-2023",
    "familyId": "summary-loop2-lost-wallet",
    "maxWords": 50,
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nEvery Friday, Aya helped at her parents’ small bakery after school. She was careful with customers but careless with her own things. Her mother often told her to keep her wallet in one place. Aya laughed and said she could always remember where she put it. One busy afternoon, she placed her wallet on a shelf while wrapping bread. Later, she could not find it and became worried. She searched the kitchen, her school bag, and the front counter. A customer then returned the wallet, saying it had been beside the door. Aya was relieved but ashamed. From the next day, she used a small pouch and checked it before leaving.",
    "model": "Aya was careless with her wallet and lost it while helping at her parents’ bakery. After a customer returned it, she felt relieved and began keeping her things in a pouch.",
    "check": [
      "Ayaが持ち物に不注意",
      "財布を失くしたこと",
      "客が返したこと",
      "行動変化"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】50語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2023年度大問4と同じく、人物の性格・出来事・心情・変化を50語以内でまとめる型。\n【残す要点】Ayaが持ち物に不注意／財布を失くしたこと／客が返したこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Aya was careless with her wallet and lost it while helping at her parents’ bakery. After a customer returned it, she felt relieved and began keeping her things in a pouch.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu23",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-practice-piano",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nYuto wanted to play a difficult piano piece at a school concert. He watched videos of famous pianists every night and imagined himself playing beautifully. However, he practiced only the easy parts because the middle section was slow and boring. His teacher warned him that watching others was not the same as training his own fingers. On concert day, Yuto began confidently, but he stopped in the middle and could not continue. Afterward, he felt disappointed and started practicing the hard parts little by little. He learned that admiration cannot replace steady effort. There were many small details in the story, but only the main problem, action, result, and lesson are needed for the summary.",
    "model": "Yuto wanted to play a difficult piano piece but practiced only the easy parts. He failed at the concert and learned that watching others cannot replace steady effort.",
    "check": [
      "難しい曲を弾きたかったこと",
      "易しい部分だけ練習したこと",
      "本番で失敗したこと",
      "努力の教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、行動の原因・失敗・教訓を短くまとめる型。\n【残す要点】難しい曲を弾きたかったこと／易しい部分だけ練習したこと／本番で失敗したこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Yuto wanted to play a difficult piano piece but practiced only the easy parts. He failed at the concert and learned that watching others cannot replace steady effort.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu24",
    "focusTag": "summary-2023",
    "familyId": "summary-loop2-clean-river",
    "maxWords": 50,
    "prompt": "【オリジナル類題・2023型・50語以内】次の英文を要約しなさい。\nA river near East Park had become dirty with plastic bottles and snack bags. The city put up a sign telling people not to throw trash, but the trash continued to increase. A group of middle school students decided to do more than complain. They cleaned the riverbank every Sunday for a month and recorded the kinds of trash they found. Then they made posters showing how the trash could hurt fish and birds. They also placed separate bins near the park entrance with the city’s permission. At first only a few people noticed, but gradually more families began using the bins. The riverbank became cleaner, and the students learned that action and information together can change behavior.",
    "model": "A dirty riverbank did not improve with only a sign. Students cleaned it, studied the trash, made posters, and added bins. Gradually people changed their behavior, and the riverbank became cleaner.",
    "check": [
      "看板だけでは不十分",
      "学生の行動と記録",
      "ポスター・ゴミ箱",
      "人々の行動変化"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】50語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2023年度大問4と同じく、問題→行動→結果→教訓をまとまった英文から選ぶ型。\n【残す要点】看板だけでは不十分／学生の行動と記録／ポスター・ゴミ箱\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】A dirty riverbank did not improve with only a sign. Students cleaned it, studied the trash, made posters, and added bins. Gradually people changed their behavior, and the riverbank became cleaner.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  },
  {
    "id": "lsu25",
    "focusTag": "summary-2022",
    "familyId": "summary-loop2-umbrella",
    "maxWords": 40,
    "prompt": "【オリジナル類題・2022型・40語以内】次の英文を要約しなさい。\nNana’s mother told her to take an umbrella because the sky looked dark. Nana refused because carrying it would be troublesome and her new bag was small. On the way to school, she saw other students with umbrellas and thought they worried too much. After lunch, heavy rain began. Nana waited at the entrance for a long time, but the rain did not stop. She finally ran home and got her notebooks wet. That night, she dried the pages with a hair dryer and apologized to her mother. She learned that a small inconvenience can prevent a bigger problem. There were many small details in the story, but only the main problem, action, result, and lesson are needed for the summary.",
    "model": "Nana refused to take an umbrella because it was troublesome, but heavy rain made her notebooks wet. She learned that a small inconvenience can prevent a bigger problem.",
    "check": [
      "傘を拒んだこと",
      "雨で困ったこと",
      "ノートが濡れたこと",
      "教訓"
    ],
    "skill": "summary",
    "level": 3,
    "type": "selfcheck",
    "targetId": "summary-main-points",
    "examFormat": "manual",
    "sourceStyle": "2022-2023 official summary format",
    "originalDrill": true,
    "explanation": "【語数】40語以内。\n【設問条件】まとまった英文を読み、重要情報を選んで英語で要約する。本文の細部を全部入れない。\n【過去問比較】2022年度大問4と同じく、日常的な失敗から教訓を40語以内で要約する型。\n【残す要点】傘を拒んだこと／雨で困ったこと／ノートが濡れたこと\n【削る情報】固有名詞、細かな場所・時間・飾りの描写は、結論に必要な場合だけ残す。\n【構成】人物・状況 → 問題/変化 → 結果 → 教訓または結論。\n【答案例】Nana refused to take an umbrella because it was troublesome, but heavy rain made her notebooks wet. She learned that a small inconvenience can prevent a bigger problem.\n【合格戦略】A〜B。満点狙いより、主語・動詞を崩さず、原因と結論を落とさない。"
  }
];
const ids=new Set(B.map(q=>q.id));
for(const q of replacements){if(!ids.has(q.id)){B.push(q);ids.add(q.id);}}
window.DRILLS=B;
})();
