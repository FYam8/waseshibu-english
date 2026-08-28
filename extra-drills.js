(()=>{
const B=window.DRILLS;
const choice=(skill,prefix,rows)=>rows.forEach((r,i)=>B.push({id:`x${prefix}${i+1}`,skill,level:r[4]||2,type:"choice",prompt:r[0],options:r[1],answer:r[2],explanation:r[3]}));
const text=(skill,prefix,rows)=>rows.forEach((r,i)=>B.push({id:`x${prefix}${i+1}`,skill,level:r[3]||2,type:"text",prompt:r[0],answerText:r[1],explanation:r[2]}));
const reorder=(rows)=>rows.forEach((r,i)=>B.push({id:`xro${i+1}`,skill:"reorder",level:r[5]||2,type:"reorder",prompt:r[0],lead:r[1],tokens:r[2],answer:r[3],explanation:r[4]}));
const selfcheck=(skill,prefix,rows)=>rows.forEach((r,i)=>B.push({id:`x${prefix}${i+1}`,skill,level:r[4]||2,type:"selfcheck",prompt:r[0],check:r[1],model:r[2],explanation:r[3]}));

choice("pronunciation","pr",[
["下線部 oo の発音が他と異なるものを選びなさい。",["food","school","book","room"],2,"book の oo は /ʊ/、他は /uː/。"],
["下線部 ou の発音が他と異なるものを選びなさい。",["young","country","touch","group"],3,"group は /uː/、他は /ʌ/。"],
["下線部 a の発音が他と異なるものを選びなさい。",["make","name","many","late"],2,"many の a は /e/、他は /eɪ/。"],
["下線部 ea の発音が他と異なるものを選びなさい。",["bread","head","great","weather"],2,"great の ea は /eɪ/、他は /e/。"],
["下線部 i の発音が他と異なるものを選びなさい。",["kind","find","give","mind"],2,"give の i は /ɪ/、他は /aɪ/。"],
["下線部 o の発音が他と異なるものを選びなさい。",["home","hope","come","note"],2,"come の o は /ʌ/、他は /oʊ/。"],
["下線部 u の発音が他と異なるものを選びなさい。",["use","music","student","bus"],3,"bus の u は /ʌ/、他は /juː/。"],
["下線部 ch の発音が他と異なるものを選びなさい。",["chair","teacher","machine","lunch"],2,"machine の ch は /ʃ/、他は /tʃ/。"]
]);
choice("stress","st",[
["第一アクセントの位置が他と異なるものを選びなさい。",["hotel","Japan","police","table"],3,"table は第1音節、他は第2音節。"],
["第一アクセントの位置が他と異なるものを選びなさい。",["important","expensive","dangerous","delicious"],2,"dangerous は第1音節、他は第2音節。"],
["第一アクセントの位置が他と異なるものを選びなさい。",["family","animal","computer","beautiful"],2,"computer は第2音節、他は第1音節。"],
["第一アクセントの位置が他と異なるものを選びなさい。",["understand","afternoon","Japanese","interesting"],3,"interesting は第1音節、他は後方の音節。"],
["第一アクセントの位置が他と異なるものを選びなさい。",["remember","September","together","telephone"],3,"telephone は第1音節、他は第2音節。"],
["第一アクセントの位置が他と異なるものを選びなさい。",["hospital","holiday","idea","history"],2,"idea は第2音節、他は第1音節。"],
["第一アクセントの位置が他と異なるものを選びなさい。",["engineer","volunteer","employee","customer"],3,"customer は第1音節、他は最後の方に強勢。"],
["第一アクセントの位置が他と異なるものを選びなさい。",["education","information","conversation","comfortable"],3,"comfortable は第1音節、他は後方に強勢。"]
]);
reorder([
["彼女はその知らせを聞いて驚いた。","She",["was","surprised","to","hear","the news"],["was","surprised","to","hear","the news"],"be surprised to do。"],
["あなたは彼がどこに住んでいるか知っていますか。","Do you",["know","where","he","lives"],["know","where","he","lives"],"間接疑問は疑問詞＋主語＋動詞。"],
["その箱は私には重すぎて運べなかった。","The box",["was","too","heavy","for","me","to carry"],["was","too","heavy","for","me","to carry"],"too ... for 人 to do。"],
["彼が来るかどうか教えてください。","Please",["tell","me","whether","he","will come"],["tell","me","whether","he","will come"],"whether＋主語＋動詞。"],
["私はできるだけ早く宿題を終えた。","I",["finished","my homework","as","quickly","as possible"],["finished","my homework","as","quickly","as possible"],"as ... as possible。"],
["雨のため私たちは外出できなかった。","The rain",["prevented","us","from","going","out"],["prevented","us","from","going","out"],"prevent 人 from -ing。"],
["彼女は英語を学ぶことに多くの努力を注いだ。","She",["put","a lot of effort","into","learning","English"],["put","a lot of effort","into","learning","English"],"put effort into -ing。"],
["駅までどのくらいかかるか尋ねた。","I",["asked","how long","it","would take","to the station"],["asked","how long","it","would take","to the station"],"間接疑問では語順を戻す。"]
]);
choice("vocab_definition","vd",[
["A person who designs buildings is an ___.",["artist","architect","actor","athlete"],1,"architect は建物を設計する人。"],
["A place where planes take off and land is an ___.",["airport","office","island","entrance"],0,"airport の定義。"],
["Something you make or do for a particular purpose is a ___.",["project","passenger","promise","problem"],0,"project は目的をもつ活動・制作物。"],
["If a room has too many people, it is ___.",["crowded","quiet","empty","ancient"],0,"crowded = 混雑した。"],
["Material that is thrown away because it is not wanted is ___.",["energy","garbage","nature","medicine"],1,"garbage = ごみ。"],
["A structure built over a river for crossing is a ___.",["bridge","border","branch","bench"],0,"bridge の定義。"],
["The condition of the air such as rain or wind is the ___.",["weather","season","temperature","climate"],0,"日々の大気の状態は weather。"],
["If something helps you achieve what you want, it is ___.",["useful","usual","unable","unfair"],0,"useful = 役に立つ。"]
]);
choice("paraphrase","pa",[
["“give up” に最も近い意味は？",["continue trying","stop trying","begin again","ask for help"],1,"give up = あきらめる。"],
["“be likely to” に最も近い意味は？",["probably will","never will","must not","used to"],0,"likely は可能性が高い。"],
["“take care of” に最も近い意味は？",["look after","look for","look at","look like"],0,"take care of = look after。"],
["“as a result” に最も近い意味は？",["for example","however","therefore","at first"],2,"結果を表す therefore。"],
["“no longer” に最も近い意味は？",["not anymore","not yet","once again","for a while"],0,"no longer = もはや～ない。"],
["“in order to” に最も近い意味は？",["because of","for the purpose of","instead of","in spite of"],1,"目的を表す。"],
["“make a decision” に最も近い意味は？",["choose","explain","discover","compare"],0,"決定する＝choose。"],
["“at first” に最も近い意味は？",["finally","in the beginning","at once","again"],1,"at first = 最初は。"]
]);
choice("connector","co",[
["I was tired, ___ I finished the work.",["but","because","so","if"],0,"逆接なので but。"],
["Take an umbrella ___ it may rain.",["although","because","while","unless"],1,"理由なので because。"],
["He studied hard, ___ he passed the test.",["so","but","or","while"],0,"結果なので so。"],
["___ she was nervous, she gave a clear speech.",["Although","Because","If","Until"],0,"譲歩の although。"],
["You cannot enter ___ you have a ticket.",["if","unless","because","while"],1,"unless = ～でない限り。"],
["Some prefer buses, ___ others choose trains.",["while","so","because","if"],0,"対比の while。"],
["Wash your hands ___ eating.",["before","because","however","during"],0,"時系列は before。"],
["I called him; ___, he did not answer.",["therefore","however","for example","also"],1,"文と文の逆接は however。"]
]);
choice("reference","rf",[
["Aya bought a camera and put it in her bag. “it” は？",["Aya","a camera","her bag","buying"],1,"単数名詞 camera。"],
["The boys found two tickets. They gave them to Ken. “them” は？",["the boys","two tickets","Ken","a place"],1,"複数目的語 tickets。"],
["Mina missed the bus. This made her late. “This” は？",["the bus itself","Mina missing the bus","being at school","the driver"],1,"直前の出来事全体。"],
["Tom spoke to Mr. Lee after he arrived. 文脈上 he が Tom を指すとき、到着したのは？",["Tom","Mr. Lee","both","不明"],0,"指定された文脈では Tom。"],
["The team repeated the test, and the result was better. “the result” は？",["the team","the repeated test's outcome","the first plan","the equipment"],1,"繰り返した試験の結果。"],
["Sara had a problem, but she did not tell anyone about it. “it” は？",["Sara","anyone","the problem","telling"],2,"直前の problem。"],
["The city built more parks. This change improved health. “This change” は？",["health","building more parks","the city name","moving away"],1,"前文の施策全体。"],
["A dog followed Yuki home. She gave it water. “it” は？",["Yuki","home","water","the dog"],3,"水を与えられた dog。"]
]);
choice("context","cx",[
["The team lost the first two games but won the final. They felt ___.",["proud","hungry","careless","silent"],0,"最後に勝った結果の気持ち。"],
["Mia expected a gift, but the box was empty. She was ___.",["disappointed","relaxed","grateful","confident"],0,"期待と現実の差。"],
["The road was closed, so we had to find an ___ route.",["alternative","ancient","ordinary","equal"],0,"別の経路＝alternative route。"],
["The instructions were unclear. We felt ___.",["confused","satisfied","brave","proud"],0,"不明確な説明→混乱。"],
["After weeks of practice, Ken finally succeeded. He was ___.",["relieved","jealous","lonely","guilty"],0,"努力後の成功→安堵。"],
["The medicine had no effect, so the doctor tried a different ___.",["treatment","memory","decision","message"],0,"医療文脈では treatment。"],
["The child hid the broken cup because he felt ___.",["guilty","amused","sleepy","lucky"],0,"壊して隠す→罪悪感。"],
["The scientist checked the surprising result again to make sure it was ___.",["accurate","crowded","ordinary","silent"],0,"結果の正確性を確認。"]
]);
choice("emotion","em",[
["Lena could not find her passport, but then saw it in her pocket. Her feelings changed from...",["worry to relief","joy to anger","pride to fear","boredom to envy"],0,"紛失の不安→発見の安堵。"],
["Kai expected to win, but came last. He felt...",["disappointed","relieved","amused","grateful"],0,"期待に反する結果。"],
["A strange sound stopped when Emi turned on the light. She most likely felt...",["relieved","jealous","proud","impatient"],0,"恐れの原因が消え安堵。"],
["No one answered the door, although Ben had traveled far to visit. He felt...",["disappointed","confident","thankful","excited"],0,"期待した訪問が実現しない。"],
["Sara's painting was chosen for the exhibition. She felt...",["proud","guilty","lonely","frightened"],0,"選出された達成感。"],
["Taro realized his careless words had hurt his friend. He felt...",["guilty","relaxed","curious","hopeful"],0,"自分の行為への罪悪感。"],
["The lost child saw her mother across the station. She felt...",["relieved","bored","angry","jealous"],0,"再会による安堵。"],
["The audience stayed silent after the joke. The speaker felt...",["embarrassed","grateful","confident","satisfied"],0,"反応がなく気まずい。"]
]);
choice("reason","rs",[
["Nora took a different road because the bridge was closed. Why?",["She was lost.","The usual route was unavailable.","She liked bridges.","She missed a train."],1,"because 以下が直接根拠。"],
["Leo whispered so that he would not wake the baby. Why did he whisper?",["He was tired.","He wanted the baby to sleep.","He lost his voice.","He was outside."],1,"so that 以下が目的。"],
["Mika reread the email because its meaning was unclear. Why?",["To understand it correctly.","To delete it.","To send a photo.","To learn an address."],0,"不明確なので再読。"],
["The scientist repeated the experiment after finding an unusual result. Why?",["To confirm the result.","To avoid writing.","To change the subject.","To close the lab."],0,"異常値の確認。"],
["Ken returned the money because it made him anxious. Why?",["He wanted more.","He wanted peace of mind.","He forgot it.","He bought glasses."],1,"不安を取り除くため。"],
["The school planted trees to make the playground cooler. Why?",["To reduce heat.","To sell fruit.","To stop classes.","To build a road."],0,"to不定詞が目的。"],
["Amy wrote the date down so she would not forget it. Why?",["To remember it.","To change it.","To hide it.","To compare it."],0,"忘れないため。"],
["The ants moved slowly because they were carrying a large insect. Why?",["The load was heavy.","They followed a car.","They were sleeping.","The nest was empty."],0,"重い荷物が理由。"]
]);
choice("detail","dt",[
["A bus left at 9:15 and arrived 35 minutes later. When?",["9:40","9:50","10:00","10:15"],1,"9:15＋35分＝9:50。"],
["A book costs $12. Mia buys three. Total?",["$24","$30","$36","$42"],2,"12×3＝36。"],
["The shop opens at 10 and closes at 6. How long?",["6 hours","7 hours","8 hours","9 hours"],2,"10時から18時まで8時間。"],
["Twenty students joined; five left early. How many remained?",["10","15","20","25"],1,"20－5＝15。"],
["Ken walked 15 minutes and rode 25 minutes. Total?",["30","35","40","45"],2,"15＋25＝40分。"],
["The first test had 12 questions and the second had 8. Total?",["18","20","22","24"],1,"12＋8＝20。"],
["A train was due at 7:30 but was 20 minutes late. Arrival?",["7:10","7:30","7:40","7:50"],3,"7:30＋20分＝7:50。"],
["Sara read 18 pages Monday and 22 Tuesday. Total?",["30","36","40","44"],2,"18＋22＝40。"]
]);
choice("example","ex",[
["『協力すると一人では難しい仕事ができる』例は？",["Several students carry a heavy table together.","A boy reads alone.","A cat sleeps.","A bus stops."],0,"協力と困難な仕事の両方を満たす。"],
["『小さな習慣が環境を助ける』例は？",["Using a reusable bottle every day.","Buying a larger TV.","Driving farther.","Leaving lights on."],0,"日常的で環境負荷を下げる。"],
["『失敗から学ぶ』例は？",["Changing a method after a failed test.","Ignoring the result.","Repeating without thinking.","Stopping all work."],0,"失敗を改善に使う。"],
["『集団の判断が誤りを直す』例は？",["Several members notice and correct one calculation.","One leader hides data.","Nobody checks.","The team guesses."],0,"複数人の確認で誤りを修正。"],
["『経験が仕事を速くする』例は？",["A trained cleaner finishes efficiently.","A beginner loses tools.","A child waits.","A shop closes."],0,"経験と効率の関係。"],
["『先入観が判断を誤らせる』例は？",["Blaming someone before checking facts.","Reading evidence carefully.","Asking both sides.","Correcting a mistake."],0,"確認前の決めつけ。"],
["『自然から技術を学ぶ』例は？",["Designing robots based on ant teamwork.","Painting a wall blue.","Buying a ticket.","Closing a park."],0,"自然の仕組みを技術へ応用。"],
["『共有場所への責任』例は？",["Students clean their classroom together.","A student hides trash.","Nobody uses the room.","A cleaner locks a book."],0,"共有空間を自分たちで整える。"]
]);
choice("content_match","cm",[
["本文：At first May planned to walk, but finally took a bus. 一致するものは？",["She finally walked.","She first planned to walk.","She never changed plans.","She took a train."],1,"at first と finally を区別。"],
["本文：Most students agreed, but two did not. 一致するものは？",["All agreed.","No one agreed.","A majority agreed.","Only two agreed."],2,"most は all ではない。"],
["本文：The medicine helped the rats, but has not been tested on humans. 一致するものは？",["It is proven safe for humans.","It was tested on rats.","It failed on rats.","Humans developed it."],1,"実施済みと未実施を区別。"],
["本文：Nina wanted to call, but her phone battery died. 一致するものは？",["She completed the call.","She had no intention to call.","A dead battery prevented the call.","She bought a phone."],2,"意図と実行を区別。"],
["本文：The group moved more accurately when more ants joined. 一致するものは？",["Larger groups made better decisions.","One leader controlled all ants.","More ants caused failure.","The ants spoke."],0,"人数増加と精度向上。"],
["本文：Tom did not open the box because he remembered the warning. 一致するものは？",["Tom ignored the warning.","Tom opened it.","The warning affected his choice.","The box was lost."],2,"did not を見落とさない。"],
["本文：Only the final experiment used the new machine. 一致するものは？",["Every experiment used it.","The last experiment used it.","No experiment used it.","The first alone used it."],1,"only final の限定。"],
["本文：The plan may reduce costs, but researchers are not certain yet. 一致するものは？",["Savings are guaranteed.","The plan might save money.","Costs already rose.","Research ended."],1,"may は確定ではない。"]
]);
choice("insertion","in",[
["文挿入：『However, the second result was completely different.』 A. The first test supported the idea. [1] The team repeated it. [2] They then checked the equipment. [3] 最適位置は？",["[1]","[2]","[3]","どこにも入らない"],1,"second result は repeated it の後、However で対比。"],
["文挿入：『For example, some birds use tools to reach food.』 A. Animals solve problems in many ways. [1] This ability was once thought unique to humans. [2] Research continues. [3]",["[1]","[2]","[3]","どこにも入らない"],0,"一般論の直後に具体例。"],
["文挿入：『This change made the room much cooler.』 A. The school planted trees outside the windows. [1] Students could study comfortably. [2] More trees were added later. [3]",["[1]","[2]","[3]","どこにも入らない"],0,"This change は植樹を受ける。"],
["文挿入：『As a result, fewer people used cars.』 A. The city made buses cheaper. [1] Air quality improved. [2] The policy continued. [3]",["[1]","[2]","[3]","どこにも入らない"],0,"施策→結果→さらなる結果。"],
["文挿入：『Before that, the work had taken several hours.』 A. A new machine finished the task in minutes. [1] Workers learned to use it. [2] Production increased. [3]",["[1]","[2]","[3]","どこにも入らない"],0,"Before that は新機械以前との対比。"],
["文挿入：『They needed another way to communicate.』 A. The team could not use phones underground. [1] They created hand signals. [2] The signals worked well. [3]",["[1]","[2]","[3]","どこにも入らない"],0,"問題→必要→解決策。"],
["文挿入：『In contrast, the smaller group changed direction often.』 A. The large group moved steadily. [1] Both reached the food. [2] Scientists recorded the paths. [3]",["[1]","[2]","[3]","どこにも入らない"],0,"In contrast が large group と対比。"],
["文挿入：『After three days, the seeds began to grow.』 A. Mina planted the seeds on Monday. [1] She watered them daily. [2] By Friday, green leaves appeared. [3]",["[1]","[2]","[3]","どこにも入らない"],0,"植えた後の時系列。"]
]);
text("extract","et",[
["本文：The hikers were exhausted after climbing all day. 『疲れ果てた』に当たる1語は？","exhausted","本文中の形容詞。"],
["本文：The old bridge collapsed during the storm. 『崩壊した』に当たる1語は？","collapsed","動詞 collapsed。"],
["本文：The medicine was effective against the bacteria. 『効果的な』に当たる1語は？","effective","形容詞 effective。"],
["本文：The machine can detect very small changes. 『検出する』に当たる1語は？","detect","動詞 detect。"],
["本文：The team decided to postpone the event until Monday. 『延期する』に当たる1語は？","postpone","動詞 postpone。"],
["本文：Her explanation was accurate and easy to understand. 『正確な』に当たる1語は？","accurate","形容詞 accurate。"],
["本文：The village depends on the river for water. 『依存する』に当たる1語は？","depends","本文の形に合わせ depends。"],
["本文：The new rule will encourage students to recycle. 『促す』に当たる1語は？","encourage","動詞 encourage。"]
]);
const multiRows=[
["『その雨のため、私たちは試合を中止しなければならなかった。』 The rain (1) us (2) cancel the game.",["forced","to"],"force 人 to do。"],
["『彼女は私に窓を開けるよう頼んだ。』 She (1) me (2) open the window.",["asked","to"],"ask 人 to do。"],
["『彼が来るかどうか分かりません。』 I do not know (1) he (2) come.",["whether","will"],"whether＋主語＋will。"],
["『この本は私には難しすぎて読めない。』 This book is (1) difficult for me (2) read.",["too","to"],"too ... to do。"],
["『早く寝れば寝るほど、気分がよくなる。』 The (1) you go to bed, the better you will (2).",["earlier","feel"],"the 比較級, the 比較級。"],
["『彼女は歌うことだけでなく踊ることも好きだ。』 She likes not only (1) but also (2).",["singing","dancing"],"並列は動名詞でそろえる。"],
["『私は彼にどこで切符を買えるか尋ねた。』 I asked him where I (1) (2) a ticket.",["could","buy"],"間接疑問の語順。"],
["『彼らは雨にもかかわらず歩き続けた。』 They kept (1) in (2) of the rain.",["walking","spite"],"keep -ing / in spite of。"]
];
multiRows.forEach((r,i)=>B.push({id:`xsc${i+1}`,skill:"sentence_completion",level:2,type:"text_multi",prompt:r[0],answers:r[1],explanation:r[2]}));
selfcheck("writing_completion","wc",[
["15語以内で教訓を書きなさい：確認せず友人を疑ったが、後で自分の誤りに気づいた。",["確認してから判断する内容","15語以内","主語＋動詞"],"We should check the facts before blaming someone.","物語の結論を一般的な教訓へ。"],
["15語以内で結末を書きなさい：迷子の犬を助け、首輪から飼い主が分かった。",["飼い主へ返した内容","15語以内","時制が自然"],"She called the owner and safely returned the dog.","出来事の自然な結末。"],
["12語以内で教訓を書きなさい：急いで選んだ答えが間違っていた。",["慎重に考える内容","12語以内","英文として完成"],"Think carefully before making an important decision.","行動から教訓を抽出。"],
["15語以内で結末を書きなさい：少年は落とし物の財布を警察へ届けた。",["正直な行動の結果","15語以内","主語＋動詞"],"The owner thanked him for his honest action.","因果が通る結末。"],
["12語以内で教訓を書きなさい：小さな黒点だけを見て白い部分を無視した。",["悪い面だけ見ない内容","12語以内","命令文可"],"Do not focus only on the negative parts of life.","比喩の教訓化。"],
["15語以内で結末を書きなさい：毎日少し練習した結果、難しい曲を弾けた。",["継続の効果","15語以内","英文として完成"],"Daily practice finally allowed her to play the difficult song.","努力→成果。"],
["15語以内で教訓を書きなさい：噂を信じたが事実ではなかった。",["情報確認の必要","15語以内","英文として完成"],"We should confirm information before believing or sharing it.","噂から一般化。"],
["15語以内で結末を書きなさい：協力して重い箱を運んだ。",["協力による成功","15語以内","主語＋動詞"],"Working together, they carried the heavy box safely.","協力の具体的成果。"]
]);
selfcheck("summary","su",[
["40～50語で要約：少年はお金を得て不安になり、平穏を取り戻すため返した。",["お金を得た","不安になった","返した理由","40～50語程度"],"A poor but happy boy received a large amount of money. Instead of making him happier, it made him worried. He finally returned it because he valued his peaceful life more than wealth, rather than allowing money to control his feelings.","出来事・変化・結論。"],
["40～50語で要約：犬を誤解して撃った後、犬が赤ん坊を狼から救ったと知った。",["誤解","犬の行動","真相","40～50語程度"],"A hunter saw blood and wrongly believed his dog had harmed his baby. He killed the dog, but then discovered that it had actually fought a wolf and saved the child. He regretted acting without checking the truth for the rest of his life.","原因と悲劇的結末。"],
["40～50語で要約：研究者が土壌細菌から新しい抗生物質候補を発見した。",["研究対象","発見","意義","40～50語程度"],"Researchers studied bacteria in soil and found a substance that could fight bacteria resistant to older drugs. The discovery suggests that nature may contain useful new antibiotics, although more testing is needed before they can be safely used for humans in the future.","発見と限界を残す。"],
["40～50語で要約：アリはリーダーではなく集団で方向を決め、人数が多いほど正確だった。",["リーダー不在","集団判断","人数の効果","40～50語程度"],"Weaver ants do not depend on a single leader when carrying food. Each ant contributes information, and larger groups correct individual mistakes more effectively. Their behavior shows how group decisions can become more reliable through cooperation without depending on one individual's judgment.","対比と研究結果。"],
["40～50語で要約：女性が報酬のためボタンを押し、夫を失った。",["提案","選択","結果","40～50語程度"],"A woman was offered money if she pressed a button that would kill an unknown person. She eventually accepted the offer, but the person who died was her husband. The ending questions whether she had truly known him until it was too late.","条件・行動・結末。"],
["40～50語で要約：学校が木を植え、教室が涼しくなり電力使用も減った。",["施策","直接効果","追加効果","40～50語程度"],"A school planted trees near classroom windows to block strong sunlight. The rooms became cooler, so students could study more comfortably and the school used less electricity for air conditioning. A simple environmental change produced several benefits during hot weather.","因果を順にまとめる。"],
["40～50語で要約：新機械は速いが、熟練者の確認がなければ誤りが増えた。",["利点","問題","必要な対策","40～50語程度"],"A new machine completed work much faster than people, but it sometimes made errors that were difficult to notice. The company learned that experienced workers still needed to check its results, combining speed with human judgment in the final production process.","利点と限界。"],
["40～50語で要約：町はバスを安くし、自動車利用と大気汚染を減らした。",["政策","行動変化","環境効果","40～50語程度"],"The city lowered bus fares to encourage public transportation. More residents chose buses instead of cars, which reduced traffic and improved air quality. The policy shows how changing costs can influence behavior and benefit the environment over the following months.","施策→変化→結果。"]
]);
selfcheck("rebuttal","rb",[
["約50語：『宿題はすべて廃止すべきだ』を要約して反論しなさい。",["相手の主張","However/But","反論","理由"],"You believe schools should remove all homework because students are busy. However, a reasonable amount of homework is useful. It helps students review what they learned and shows teachers which topics remain difficult, as long as the amount is carefully controlled.","全面否定に条件付きで反論。"],
["約50語：『学校では紙の本をすべてタブレットに替えるべきだ』を要約して反論しなさい。",["主張要約","転換","反論","具体例"],"You argue that tablets should replace every printed book because they are convenient. However, schools should keep both. Printed books do not need batteries and may help some students concentrate, while tablets are useful for searching and carrying many materials.","両方の利点を使う。"],
["約50語：『部活動は勉強の邪魔なので不要だ』を要約して反論しなさい。",["主張要約","However/But","反論","理由"],"You say club activities should be removed because they take study time. However, they can teach teamwork, responsibility, and time management. Schools should control the hours rather than remove clubs completely, so students can receive both academic and personal benefits.","問題を認めて改善案。"],
["約50語：『学校給食は全員同じメニューだけでよい』を要約して反論しなさい。",["主張要約","転換","反論","理由"],"You think one menu is simplest for every student. However, schools should offer limited alternatives for allergies, health, or religious needs. A small number of choices can protect students while keeping the lunch system practical and affordable in daily school life.","例外の必要性。"],
["約50語：『町の公園を駐車場に変えるべきだ』を要約して反論しなさい。",["主張要約","However/But","反論","具体例"],"You argue that the park should become a parking area because drivers need space. However, the park gives children a safe place to play and reduces heat in the neighborhood. The town should improve public transport or use another site instead.","失われる利益と代案。"],
["約50語：『学生は制服を着る必要がない』を要約して反論しなさい。",["主張要約","転換","反論","理由"],"You say uniforms are unnecessary because students want freedom. However, simple uniforms can reduce pressure to buy fashionable clothes and make mornings easier for students and families. Schools could allow some personal choice while keeping a basic uniform policy in daily life.","相手の価値を一部認める。"],
["約50語：『AIがあるので外国語学習は不要だ』を要約して反論しなさい。",["主張要約","However/But","反論","理由"],"You believe translation technology makes language study unnecessary. However, knowing another language helps people understand culture, notice translation mistakes, and communicate when technology fails in difficult real situations. AI is a useful tool, but it cannot replace every part of human communication.","道具と能力を区別。"],
["約50語：『学校行事は時間の無駄だ』を要約して反論しなさい。",["主張要約","転換","反論","具体例"],"You think school events waste time that could be used for study. However, planning a festival or sports day teaches cooperation and gives students chances to use different strengths. Schools should improve inefficient events, not remove every shared experience for the whole school community.","学習以外の教育効果。"]
]);
})();
