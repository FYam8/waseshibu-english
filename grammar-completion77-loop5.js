(()=> {
"use strict";
const B = window.DRILLS || [];
const byId = new Map(B.map(d=>[d.id,d]));

function patchReorder(id, data){
  const q = byId.get(id);
  if(!q) return;
  Object.assign(q, data, {
    auditStatus: "grammar77_loop5_reorder_distribution_patch"
  });
}

patchReorder("ro01", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n私は彼女に何と言えばよいかわからない。\nI have (1) ______ idea what I (2) ______ say to her.",
  answer: [1,5],
  explanation: "【完成英文】I have no idea what I should say to her.\n【全文和訳】私は彼女に何と言えばよいかわからない。\n【文構造】I have no idea + what + S + should + 動詞。\n【重要構文】have no idea what S should do「Sが何をすべきかわからない」。\n【語順理由】what節は間接疑問なので what I should say の語順にする。\n【指定位置】(1)：no ／ (2)：should\n【間違いやすい点】what should I say と疑問文語順にしない。\n【戦略】A：全文を完成させ、番号空欄だけを正確に拾う。"
});

patchReorder("ro02", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n夜更かしをする人は風邪をひきやすい。\nPeople who stay (1) ______ late may (2) ______ a cold easily.",
  answer: [2,5],
  explanation: "【完成英文】People who stay up late may catch a cold easily.\n【全文和訳】夜更かしをする人は風邪をひきやすい。\n【文構造】People + who節 + may + 動詞原形。\n【重要構文】stay up late「夜更かしする」、catch a cold「風邪をひく」。\n【語順理由】who stay up late が People を後ろから説明し、may の後は動詞原形 catch。\n【指定位置】(1)：up ／ (2)：catch\n【間違いやすい点】may の後を catches にしない。\n【戦略】A：関係代名詞のまとまりと助動詞後の形を確認する。"
});

patchReorder("ro05", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n彼は休暇中に犬の世話をしてくれる人を探している。\nHe is looking (1) ______ someone who can take care (2) ______ his dog during his vacation.",
  answer: [1,6],
  explanation: "【完成英文】He is looking for someone who can take care of his dog during his vacation.\n【全文和訳】彼は休暇中に犬の世話をしてくれる人を探している。\n【文構造】is looking for + someone + who can take care of ...。\n【重要構文】look for「探す」、take care of「世話をする」。\n【語順理由】someone を who can ... が説明し、care の後は of が必要。\n【指定位置】(1)：for ／ (2)：of his dog\n【間違いやすい点】look someone ではなく look for someone。\n【戦略】A：熟語のまとまりを崩さずに置く。"
});

patchReorder("ro06", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n私たちは学園祭の準備に多くの努力を注いだ。\nWe put a lot of (1) ______ into preparing for (2) ______.",
  answer: [3,7],
  explanation: "【完成英文】We put a lot of effort into preparing for the festival.\n【全文和訳】私たちは学園祭の準備に多くの努力を注いだ。\n【文構造】put + effort + into + 動名詞。\n【重要構文】put effort into -ing「〜することに努力を注ぐ」。\n【語順理由】into は前置詞なので後ろは preparing。prepare for の for も必要。\n【指定位置】(1)：effort ／ (2)：the festival\n【間違いやすい点】into prepare ではなく into preparing。\n【戦略】B：熟語と動名詞の両方を確認する。"
});

patchReorder("ro07", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n私たちはその情報がどこから来たのか調べるべきだ。\nWe should find (1) ______ where the information (2) ______ from.",
  answer: [1,4],
  explanation: "【完成英文】We should find out where the information comes from.\n【全文和訳】私たちはその情報がどこから来たのか調べるべきだ。\n【文構造】should + find out + where + S + V + from。\n【重要構文】find out「調べる」、where S comes from「Sがどこから来るか」。\n【語順理由】where節は間接疑問なので where does the information come ではない。\n【指定位置】(1)：out ／ (2)：comes\n【間違いやすい点】find と out を離して意味を落とさない。\n【戦略】B：句動詞と間接疑問の語順を確認する。"
});

patchReorder("ro08", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n彼はレポートを終えたが、病気になったので提出できなかった。\nHe finished his report, but he couldn't (1) ______ it in because (2) ______ sick.",
  answer: [2,6],
  explanation: "【完成英文】He finished his report, but he couldn't hand it in because he got sick.\n【全文和訳】彼はレポートを終えたが、病気になったので提出できなかった。\n【文構造】S + V, but S couldn't + 動詞原形 because S + V。\n【重要構文】hand in「提出する」、get sick「病気になる」。\n【語順理由】couldn't の後は hand。代名詞 it は hand と in の間に入る。\n【指定位置】(1)：hand ／ (2)：he got\n【間違いやすい点】hand in it ではなく hand it in。\n【戦略】B：句動詞の代名詞位置に注意する。"
});

patchReorder("ro09", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nSallyは何が彼女を喜ばせるのかを調べようとした。\nSally tried (1) ______ find out what (2) ______ her happy.",
  answer: [1,4],
  explanation: "【完成英文】Sally tried to find out what would make her happy.\n【全文和訳】Sallyは何が彼女を喜ばせるのかを調べようとした。\n【文構造】try to do + find out + what would make O C。\n【重要構文】try to do「〜しようとする」、make O C「OをCにする」。\n【語順理由】what が主語になるので what would make ... の語順。\n【指定位置】(1)：to ／ (2)：would make\n【間違いやすい点】what would make のまとまりを崩さない。\n【戦略】B：不定詞とmake O Cをつなげて考える。"
});

patchReorder("xro3", {
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nその箱は重すぎて私には運べなかった。\nThe box was (1) ______ heavy for (2) ______ to carry.",
  answer: [1,4],
  explanation: "【完成英文】The box was too heavy for me to carry.\n【全文和訳】その箱は重すぎて私には運べなかった。\n【文構造】too + 形容詞 + for 人 + to 動詞。\n【重要構文】too ... for A to do「Aが〜するには...すぎる」。\n【語順理由】too heavy の後に for me to carry を置く。\n【指定位置】(1)：too ／ (2)：me\n【間違いやすい点】to carry for me ではなく for me to carry。\n【戦略】A：too ... to の型をそのまま作る。"
});

patchReorder("nr_rc1", {
  lead: "I [ ア met / イ a woman / ウ at the station / エ who / オ works / カ at the library ].",
  tokens: ["met","a woman","at the station","who","works","at the library"],
  solution: ["met","a woman","at the station","who","works","at the library"],
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n私は駅で、図書館で働いている女性に会いました。\nI met a woman (1) ______ who (2) ______ at the library.",
  answer: [2,4],
  explanation: "【完成英文】I met a woman at the station who works at the library.\n【全文和訳】私は駅で、図書館で働いている女性に会いました。\n【文構造】I met a woman + 場所 + who works ...。\n【重要構文】who + 動詞で直前の人を説明する。\n【語順理由】a woman を who works at the library が説明し、at the station は会った場所を表す。\n【指定位置】(1)：at the station ／ (2)：works\n【間違いやすい点】who の後は疑問文語順にしない。\n【戦略】B：場所表現と関係代名詞節の役割を分ける。"
});

patchReorder("nr_cp1", {
  lead: "Ken [ ア is / イ better / ウ at / エ speaking / オ than / カ anyone else ].",
  tokens: ["is","better","at","speaking","than","anyone else"],
  solution: ["is","better","at","speaking","than","anyone else"],
  prompt: "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nKenは他の誰よりも話すのが得意です。\nKen is better (1) ______ speaking than (2) ______.",
  answer: [2,5],
  explanation: "【完成英文】Ken is better at speaking than anyone else.\n【全文和訳】Kenは他の誰よりも話すのが得意です。\n【文構造】be better at -ing than ...。\n【重要構文】be good at -ing の比較級 better at -ing。\n【語順理由】better の後は at speaking、比較対象は than anyone else。\n【指定位置】(1)：at ／ (2)：anyone else\n【間違いやすい点】better speaking だけでは「話すのが得意」の意味にならない。\n【戦略】A：比較級と前置詞 at のまとまりを確認する。"
});

const retireIds = new Set(["lwc32","lwc34","lwc35","lwc36","lwc38","lwc42"]);
const retireReason = "grammar77 loop5: 2020/2021型の物語・教訓完成として本文量と情報選別負荷が軽めだったため、既存履歴保護のため非破壊retire。";
for (const q of B) {
  if (retireIds.has(q.id)) {
    q.retired = true;
    q.active = false;
    q.retiredReason = retireReason;
    q.legacyCompletion = true;
  }
}

const replacements = [
{
 id:"lwc43", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[10,10],
 prompt:"【オリジナル類題・2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nThe art club wanted to paint a large picture for the school festival. At first, every member tried to add his or her own favorite color and character. The picture became bright, but no one could understand what it showed. The teacher did not tell them to start again. Instead, she asked the students to step back and look at the whole wall. After a long silence, they noticed that the background, people, and words did not match. The next day, they chose one theme, removed some parts, and worked more slowly. The final picture was simpler, but visitors stopped and read the message carefully.\nThe students learned that (1) ______ even if (2) ______.",
 model:"a clear message is important / many ideas look exciting",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) a clear message is important / (2) many ideas look exciting\n【全文要旨】多くの案を入れすぎた絵は伝わりにくく、一つのテーマに絞ると伝わった。\n【空所条件】even ifで一見よい条件を譲歩として置く。\n【語数】各10語以内。\n【文法・語法】learn that + 文。clear message が主語になる。\n【過去問比較】2021型の教訓完成。まとまった本文から失敗・改善・教訓を拾う。\n【別解】simple ideas can be stronger / colorful designs seem attractive など可。\n【戦略】B：細部ではなく、変化後に得た教訓を短く書く。\n【設問条件】指定語数内で、空所前後に文法的・内容的につながる英文を書く。\n【最小限答案例】a clear message is important / many ideas look exciting\n【高得点答案例】one clear message can be stronger / many ideas seem attractive\n【合格戦略】B：2021型は本文全体の教訓を抽象化する。"
},
{
 id:"lwc44", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[10,10],
 prompt:"【オリジナル類題・2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nDuring a class trip, the teacher gave each group a paper map. Kaito laughed and said his phone map would be faster. His group followed the phone through narrow streets, but tall buildings made the signal weak. The screen kept turning around, and they walked in circles. Another group looked at street names, compared them with the paper map, and reached the museum before noon. Kaito's group finally arrived late, tired, and embarrassed. On the bus home, Kaito folded the paper map carefully and put it into his notebook, saying that he would check more than one source next time.\nKaito learned that (1) ______ even if (2) ______.",
 model:"old tools can still help / new tools seem convenient",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) old tools can still help / (2) new tools seem convenient\n【全文要旨】電話の地図だけに頼って迷い、紙の地図や複数情報の大切さに気づいた。\n【空所条件】even ifで新しい道具の便利さを認めながら教訓を述べる。\n【語数】各10語以内。\n【文法・語法】old tools can still help は自然な一般化。\n【過去問比較】2021型の教訓完成。道具の見た目ではなく、使い方と判断をまとめる。\n【別解】we should check different sources / phones are usually useful など可。\n【戦略】A/B：失敗の原因と最後の行動を教訓にする。\n【設問条件】指定語数内で、空所前後につながる英文を書く。\n【最小限答案例】old tools can still help / new tools seem convenient\n【高得点答案例】checking different sources is important / one tool looks convenient\n【合格戦略】B：最後の発言を教訓に変換する。"
},
{
 id:"lwc45", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[5,15],
 prompt:"【オリジナル類題・2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nMika promised to water her neighbor's plants while he was away for three days. On the first morning, she watered every pot until water covered the balcony floor. She thought more water would always be better. On the second day, the leaves of one small plant looked yellow, so she added even more water. When the neighbor returned, he smiled but touched the wet soil and explained that some plants need dry time between waterings. He showed Mika a small card that said how often each plant should be watered. Mika felt sorry and asked him to teach her before his next trip. After that, she checked the card first.\nMika (1) ______ and learned that (2) ______.",
 model:"apologized / kindness without understanding can cause problems",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) apologized / (2) kindness without understanding can cause problems\n【全文要旨】親切のつもりで水をやりすぎ、植物には適切な世話が必要だと学ぶ。\n【空所条件】(1)は結末の短い行動、(2)は教訓。\n【語数】(1)5語以内、(2)15語以内。\n【文法・語法】learned that + 文。\n【過去問比較】2020型の結末＋教訓完成。行動の結果と学びを本文全体から取る。\n【別解】said sorry / we should understand what we are doing など可。\n【戦略】B：善意だけでなく結果と教訓を入れる。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】apologized / too much care can be harmful\n【高得点答案例】said sorry / kindness without understanding can cause problems\n【合格戦略】B：最後の説明を一般化して教訓にする。"
},
{
 id:"lwc46", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[10,10],
 prompt:"【オリジナル類題・2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nA school newspaper team had only three members. They wanted to publish a special issue before the graduation ceremony, but the work seemed too much. One student said they should give up because larger clubs had more writers. The oldest member did not agree. She divided the jobs into interviews, photos, and layout, and asked each class to send one short message. At first the pages looked empty, but messages slowly arrived during lunch breaks. By Friday, the team had enough material, and many graduates kept the newspaper as a memory. The three members were tired, but they smiled when younger students asked to join the club next year.\nThe team learned that (1) ______ even if (2) ______.",
 model:"small groups can do important work / the task seems too large",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) small groups can do important work / (2) the task seems too large\n【全文要旨】人数が少ない新聞部が仕事を分け、周囲の協力で特別号を完成させた。\n【空所条件】even ifで困難を認めつつ、学んだ教訓を述べる。\n【語数】各10語以内。\n【文法・語法】small groups can do ... がthat節の主語述語になる。\n【過去問比較】2021型の教訓完成。小さな行動にも意味がある型。\n【別解】asking for help is useful / there are not many members など可。\n【戦略】B：途中の工夫と結果を教訓へ変える。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】small groups can do important work / work seems too much\n【高得点答案例】a small group can make a difference / the task looks impossible\n【合格戦略】B：人数の少なさと結果の対比を要約する。"
},
{
 id:"lwc47", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[10,10],
 prompt:"【オリジナル類題・2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nA boy found an old radio in his grandmother's room and laughed at it. He said his phone could play music, show videos, and send messages, so no one needed such an old machine. That night, a storm cut the electricity, and the phone network stopped working. The family could not check the news online. His grandmother put two small batteries into the radio and turned it on. The radio gave emergency information about flooded roads and the nearest shelter. The boy listened carefully, wrote down the information, and helped his neighbors the next morning. After the storm, he cleaned the radio and placed it near the door.\nThe boy learned that (1) ______ even if (2) ______.",
 model:"old things can still be useful / new technology seems better",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) old things can still be useful / (2) new technology seems better\n【全文要旨】古いラジオを笑った少年が、停電時にその価値を知る。\n【空所条件】even ifで新技術の良さを認めながら、古い物の価値を述べる。\n【語数】各10語以内。\n【文法・語法】old things can still be useful が文として自然。\n【過去問比較】2021型の教訓完成。態度変化と最後の行動を読む。\n【別解】we should not judge by age / phones usually help us など可。\n【戦略】B：最初の軽視と最後の尊重を対比する。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】old things can still be useful / phones seem better\n【高得点答案例】old things can still be useful in emergencies / new technology looks better\n【合格戦略】B：出来事全体から一般的な教訓を作る。"
},
{
 id:"lwc48", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[10,10],
 prompt:"【オリジナル類題・2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nA new student, Lina, spoke quietly in class, so some students thought she did not want to make friends. During group work, they gave her only small jobs and finished most tasks without asking her opinion. One afternoon, the teacher asked each group to prepare questions for a visiting scientist. The other members could not think of anything interesting. Lina slowly opened her notebook and showed pages of careful notes from science programs she had watched. Her questions were clear and original, and the scientist praised the group. After class, the students asked Lina to explain her ideas for the next project.\nThey learned that (1) ______ even if (2) ______.",
 model:"quiet people may have good ideas / they do not speak much",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) quiet people may have good ideas / (2) they do not speak much\n【全文要旨】静かな転校生を周囲が誤解したが、彼女の準備と質問で考えが変わった。\n【空所条件】even ifで表面的な印象を譲歩として置く。\n【語数】各10語以内。\n【文法・語法】people may have ... / they do not ... の対応が自然。\n【過去問比較】2021型の教訓完成。人物への見方が出来事によって変わる。\n【別解】we should listen to everyone / someone looks quiet など可。\n【戦略】A/B：最初の誤解と最後の学びを結びつける。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】quiet people may have good ideas / they speak little\n【高得点答案例】we should listen to quiet classmates / they do not speak much\n【合格戦略】B：人物評価の変化を教訓として表す。"
}
];

const existing = new Set(B.map(d=>d.id));
for (const q of replacements) {
  if (!existing.has(q.id)) {
    B.push(q);
    existing.add(q.id);
  }
}
})();

(()=> {
"use strict";
const B = window.DRILLS || [];
const retireIds = new Set(["lwc30","lwc33","lwc37","lwc39","lwc40","lwc41"]);
const retireReason = "grammar77 loop5 additional check: 2020/2021型として本文量をさらに安定させるため非破壊retire。";
for (const q of B) {
  if (retireIds.has(q.id)) {
    q.retired = true;
    q.active = false;
    q.retiredReason = retireReason;
    q.legacyCompletion = true;
  }
}
const replacements = [
{
 id:"lwc49", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[10,10],
 prompt:"【オリジナル類題・2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nOn a hot afternoon, many students walked past the school garden because the leaves looked dry and the soil had cracks. Some students said watering one small garden would not change anything because the summer was too hot. Mei did not argue with them. She carried one bottle of water from the classroom sink and poured it around the weakest plants. The next day, two classmates brought water too. By the end of the week, each class had chosen a day to help. The garden did not become beautiful at once, but new green leaves appeared, and students began eating lunch near it again.\nMei showed that (1) ______ even if (2) ______.",
 model:"one small action can help / the problem seems too big",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) one small action can help / (2) the problem seems too big\n【全文要旨】一人の小さな行動が周囲に広がり、枯れかけた庭が少しずつ回復した。\n【空所条件】even ifで困難の大きさを認めながら教訓を述べる。\n【語数】各10語以内。\n【文法・語法】one small action can help が空所前のshowed thatにつながる。\n【過去問比較】2021型の教訓完成。小さな行動の意味を本文全体から判断する。\n【別解】small efforts can make a difference / others do not help at first など可。\n【戦略】A/B：行動の広がりと結果を教訓にする。\n【設問条件】指定語数内で、文法的・内容的につながる英文を書く。\n【最小限答案例】one small action can help / the problem is big\n【高得点答案例】one small action can start a change / the problem seems too big\n【合格戦略】B：途中経過を削り、最終的な学びを短く表す。"
},
{
 id:"lwc50", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[5,15],
 prompt:"【オリジナル類題・2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nTom was sure that a new app would make his English perfect. It showed many colorful stars after each short quiz, and Tom enjoyed collecting them on the train. However, he often chose answers quickly without reading the example sentences. Before a vocabulary test, he spent two hours tapping the app but did not write any words in his notebook. During the test, he remembered the colors on the screen but could not spell several important words. His friend, who had used the same app with a notebook, did much better. After school, Tom opened the app again, but this time he copied each useful phrase and made his own sentences.\nTom changed his study method and learned that (1) ______ and (2) ______.",
 model:"tools help / practice with care is necessary",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) tools help / (2) practice with care is necessary\n【全文要旨】アプリだけに頼ったTomは失敗し、丁寧な練習を加える必要を学んだ。\n【空所条件】(1)は短い結論、(2)は教訓として自然に続ける。\n【語数】(1)5語以内、(2)15語以内。\n【文法・語法】learned that A and B の形にそろえる。\n【過去問比較】2020型の結末＋教訓完成。道具の限界と本当の学びを読む。\n【別解】apps are useful / students must study actively など可。\n【戦略】B：便利な物と学習態度の違いを整理する。\n【設問条件】指定語数内で、空所前後につながる英文を書く。\n【最小限答案例】apps help / careful practice is important\n【高得点答案例】useful tools can help / careful practice is still necessary\n【合格戦略】B：失敗理由をそのまま教訓化する。"
},
{
 id:"lwc51", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[5,15],
 prompt:"【オリジナル類題・2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nA young runner named Sora always started races very fast. He liked hearing people shout his name in the first minute, and he believed a strong start was the same as a strong race. His coach warned him to save energy, but Sora did not listen. In an important school race, he ran far ahead of everyone at first. Halfway through the course, his legs became heavy, and several runners passed him. He finished near the end and sat silently beside the track. The next month, he practiced running at a steady speed. In the final race of the season, he did not lead at first, but he kept his pace and finished third.\nSora (1) ______ and learned that (2) ______.",
 model:"changed his plan / starting fast is not always best",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) changed his plan / (2) starting fast is not always best\n【全文要旨】速く出すぎて失敗したSoraが、一定のペースを学んで結果を出した。\n【空所条件】(1)は行動変化、(2)は教訓。\n【語数】(1)5語以内、(2)15語以内。\n【文法・語法】動名詞startingを主語にした教訓が自然。\n【過去問比較】2020型の経験から教訓を完成する形式。\n【別解】ran more steadily / keeping a pace matters など可。\n【戦略】A/B：最初と最後の走り方の違いを見る。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】changed his way / pace is important\n【高得点答案例】changed his running plan / keeping a steady pace is important\n【合格戦略】B：結果ではなく学んだ原則を書く。"
},
{
 id:"lwc52", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[5,15],
 prompt:"【オリジナル類題・2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nAya was chosen to be the leader of a group project. She wanted everything to be perfect, so she made the poster, wrote the speech, and checked the slides by herself. At first, the other members were happy because they had little work. Soon, however, Aya became tired and began making mistakes. One slide had the wrong date, and the speech was too long. The day before the presentation, a quiet member showed Aya a simple chart he had made at home. Another member suggested cutting two examples. Aya finally asked everyone to help. Their final presentation was shorter, clearer, and more relaxed than Aya's first plan.\nAya (1) ______ and learned that (2) ______.",
 model:"asked for help / teamwork can make work better",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) asked for help / (2) teamwork can make work better\n【全文要旨】一人で抱え込んだAyaが失敗しかけ、仲間の協力で発表を改善した。\n【空所条件】(1)は結末の行動、(2)は教訓。\n【語数】(1)5語以内、(2)15語以内。\n【文法・語法】learned that + 文の形。\n【過去問比較】2020型の物語全体から結末と教訓を補う形式。\n【別解】trusted her teammates / sharing work is important など可。\n【戦略】B：主人公の変化を短く表す。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】asked for help / teamwork is important\n【高得点答案例】learned to ask for help / teamwork can improve the final result\n【合格戦略】B：問題→助け→改善の流れを教訓にする。"
},
{
 id:"lwc53", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[10,10],
 prompt:"【オリジナル類題・2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nAt a volunteer event, students cleaned a small beach. Some of them picked up only large bottles because they looked important in photos. Yuna spent a long time collecting tiny plastic pieces between stones. A boy laughed and said no one would notice such small things. Later, a local guide explained that birds and fish often mistake tiny plastic pieces for food. He showed them a picture of a sick bird found near the same beach. The students became quiet. On the next cleaning day, many of them brought small bags and worked beside Yuna. The beach did not look very different from far away, but the guide thanked them for protecting the animals.\nYuna showed that (1) ______ even if (2) ______.",
 model:"small actions can protect life / they are hard to see",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) small actions can protect life / (2) they are hard to see\n【全文要旨】目立たない小さなごみ拾いが、鳥や魚を守る行動だと分かった。\n【空所条件】even ifで「目立たない」条件を認めて教訓を述べる。\n【語数】各10語以内。\n【文法・語法】small actions can protect life が自然。\n【過去問比較】2021型の教訓完成。小さな行動にも意味があることを読む。\n【別解】small pieces matter / people may not notice them など可。\n【戦略】B：見た目の大きさではなく影響を読む。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】small actions can help / people do not notice\n【高得点答案例】small actions can protect living things / they are difficult to see\n【合格戦略】B：説明部分から教訓を作る。"
},
{
 id:"lwc54", skill:"writing_completion", targetId:"writing-completion", type:"selfcheck", strategy:"B", source:"grammar_completion77_loop5", partLimits:[5,15],
 prompt:"【オリジナル類題・2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nDaiki loved taking photos with his new camera. At the sports festival, he tried to take every picture by himself. He ran from the soccer field to the gym, then back to the track, but he missed the best moment of his sister's relay because he was changing lenses. His friend Emi, who had a simple old camera, stayed near the goal and waited. She took one clear photo of Daiki's sister smiling after the race. Daiki was disappointed, but Emi shared her picture with him and explained that she had chosen one place and waited patiently. At the next event, Daiki planned fewer photos and watched more carefully.\nDaiki (1) ______ and learned that (2) ______.",
 model:"changed his approach / careful planning matters more than equipment",
 check:["本文全体の出来事を反映している","空所前後と文法的につながる","語数条件を守っている","過去問本文を写していない"],
 explanation:"【完成例】(1) changed his approach / (2) careful planning matters more than equipment\n【全文要旨】新しいカメラで動き回ったDaikiは大事な瞬間を逃し、計画と待つことの大切さを学ぶ。\n【空所条件】(1)は変化、(2)は教訓。\n【語数】(1)5語以内、(2)15語以内。\n【文法・語法】matters more than ... で比較の教訓を表す。\n【過去問比較】2020型の結末＋教訓完成。道具より判断が重要という流れ。\n【別解】planned better / patience is important など可。\n【戦略】B：失敗した原因と次の行動を結びつける。\n【設問条件】指定語数内で、空所前後に自然につながる英文を書く。\n【最小限答案例】changed his plan / planning is important\n【高得点答案例】changed his approach / careful planning matters more than new equipment\n【合格戦略】B：最後の行動から学びを表す。"
}
];
const existing = new Set(B.map(d=>d.id));
for (const q of replacements) {
  if (!existing.has(q.id)) {
    B.push(q);
    existing.add(q.id);
  }
}
})();
