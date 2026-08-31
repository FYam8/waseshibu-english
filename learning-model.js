(function(){
"use strict";
const D=window.EXAM_DATA||{}, B=window.DRILLS||[];

const reorderFocus={
 "2019:3-3-1":"indirect-question","2019:3-3-2":"fixed-pattern",
 "2020:3-3-1":"relative-clause","2020:3-3-2":"indirect-question",
 "2021:3-3-1":"relative-clause","2021:3-3-2":"fixed-pattern",
 "2022:3-3-1":"indirect-question","2022:3-3-2":"relative-clause",
 "2023:3-3-1":"relative-clause","2023:3-3-2":"fixed-pattern",
 "2024:3-3-1":"effort-into-ing","2024:3-3-2":"indirect-question",
 "2025:3-3-1":"conjunction-phrasal","2025:3-3-2":"relative-clause",
 "2026:4-1":"indirect-question","2026:4-2":"comparison"
};
const targetBySkill={
 pronunciation:"pronunciation-contrast",stress:"stress-position",vocab_definition:"definition-initial",
 paraphrase:"paraphrase-context",reference:"reference-cohesion",context:"context-fit",emotion:"emotion-change",
 reason:"reason-evidence",detail:"detail-evidence",example:"example-principle",insertion:"insertion-cohesion",
 content_match:"content-traps",extract:"extract-evidence",sentence_completion:"sentence-grammar",
 writing_completion:"writing-story-completion",summary:"summary-main-points",rebuttal:"rebuttal-dialogue",
 connector:"connector-logic"
};
const trapBySkill={
 detail:"本文に書かれた事実と推測を区別",content_match:"at first/finally・most/all・did/did not",
 insertion:"指示語・接続詞・時系列・論理関係",emotion:"出来事から心情変化を追う",
 reason:"because・目的・直前の出来事を根拠にする",reference:"単語だけでなく前文全体も確認",
 summary:"重要点を選び、因果と結末を残す",rebuttal:"相手の主張→転換→反論→理由",
 reorder:"構文のかたまりを先に作る",vocab_definition:"定義と与えられた頭文字を照合"
};
function actualMeta(year,q){
 const focus=q.skill==="reorder"?(reorderFocus[`${year}:${q.id}`]||"fixed-pattern"):
   q.skill==="detail"?(q.priority==="A"?"explicit-evidence":"inference-evidence"):
   q.skill==="content_match"?(q.type==="multi"?"choose-two":"single-match"):
   q.skill==="writing_completion"?`story-${year}`:
   q.skill==="summary"?`summary-${year}`:
   q.skill==="rebuttal"?`rebuttal-${year}`:q.skill;
 return {targetId:q.skill==="reorder"?`reorder-${focus}`:(targetBySkill[q.skill]||q.skill),focusTag:focus,examFormat:q.type,trap:trapBySkill[q.skill]||q.category};
}
Object.entries(D).forEach(([year,rows])=>rows.forEach(q=>Object.assign(q,actualMeta(year,q))));

function patch(id,values){const q=B.find(x=>x.id===id);if(q)Object.assign(q,values)}
patch("xro8",{retired:true,retiredReason:"英文が不完全"});
patch("in01",{retired:true,retiredReason:"挿入位置が一意でない"});
patch("xin8",{retired:true,retiredReason:"時系列上、複数位置が成立し得る"});
patch("xrf4",{retired:true,retiredReason:"代名詞の指示対象が曖昧"});
patch("xdt3",{prompt:"The shop opens at 10 a.m. and closes at 6 p.m. How long is it open?",explanation:"10:00から18:00まで8時間。"});
patch("xvd3",{prompt:"A planned piece of work done to achieve a particular purpose is a ___.",options:["project","passenger","promise","problem"],answer:0,explanation:"project は特定の目的のために計画して行う仕事・活動。"});
patch("ex01",{prompt:"“Small rewards can encourage animals to repeat an action.” の具体例として最も適切なのは？",options:["A bee touches the same target repeatedly because it receives sugar water each time.","A bird sleeps in a tree.","A dog sees a red ball.","A fish swims at night."],answer:0,explanation:"報酬を受けることで同じ行動を繰り返す例。"});
patch("co03",{prompt:"The first method seemed promising. ___, the experiment failed, so the team changed the method and tried again.",options:["However","For example","Because","Unless"],answer:0,explanation:"期待と失敗の対比なので However。"});
patch("su01",{prompt:"40語以内で要約：A woman thought glasses would help her read, but after trying many pairs she still could not read because she had never learned how.",maxWords:40,focusTag:"summary-2022"});
patch("su02",{prompt:"50語以内で要約：Ken got a lot of money and first felt happy, but he became worried about losing it. He finally returned it and felt peaceful again.",maxWords:50,focusTag:"summary-2023"});
patch("su01",{check:["人物","試したこと","うまくいかなかった理由","40語以内"]});
patch("su02",{check:["最初の状況","お金を得た","心情の悪化","返して平穏を取り戻す","50語以内"]});
for(let i=1;i<=8;i++){
 const q=B.find(x=>x.id===`xsu${i}`),limit=i===6||i===8?40:50;
 patch(`xsu${i}`,{prompt:q?.prompt.replace(/^40[～〜]50語で/,`${limit}語以内で`),maxWords:limit,focusTag:`summary-${limit===40?2022:2023}`,check:[...(q?.check||[]).filter(x=>!/40[～〜]50語/.test(x)),`${limit}語以内`]});
}
for(const q of B.filter(x=>x.skill==="rebuttal")){q.approxWords=50;q.focusTag=q.focusTag||"rebuttal-2025"}

const reorderTargets={
 ro01:"indirect-question",ro03:"indirect-question",ro04:"indirect-question",ro07:"indirect-question",ro09:"indirect-question",xro2:"indirect-question",xro4:"indirect-question",
 ro02:"relative-clause",ro05:"relative-clause",ro06:"effort-into-ing",xro7:"effort-into-ing",ro08:"conjunction-phrasal",ro10:"comparison",
 xro1:"fixed-pattern",xro3:"fixed-pattern",xro5:"fixed-pattern",xro6:"fixed-pattern"
};
const familyAliases={pr02:"pron-ou-1",xpr2:"pron-ou-1",co01:"connector-while-1",xco6:"connector-while-1",et01:"extract-exhausted-1",xet1:"extract-exhausted-1"};
function normalizedFamily(q){return `${q.skill}:${String(q.prompt||"").toLowerCase().replace(/\s+/g," ").replace(/[『』「」]/g,"").trim()}:${JSON.stringify(q.options||q.tokens||q.answerText||q.model||"")}`}
for(const q of B){
 if(q.skill==="reorder"){q.focusTag=q.focusTag||reorderTargets[q.id]||"fixed-pattern";q.targetId=`reorder-${q.focusTag}`}
 else q.targetId=q.targetId||targetBySkill[q.skill]||q.skill;
 q.focusTag=q.focusTag||q.targetId;
 q.examFormat=q.examFormat||q.type;q.familyId=q.familyId||familyAliases[q.id]||normalizedFamily(q);
}

function pair(id,focus,prompt,lead,tokens,solution){
 const answer=[tokens.indexOf(solution[1]),tokens.indexOf(solution[4])];
 if(answer.some(x=>x<0))throw new Error(`pair answer error: ${id}`);
 B.push({id,skill:"reorder",level:3,type:"pair",targetId:`reorder-${focus}`,focusTag:focus,examFormat:"pair",familyId:id,prompt,lead,tokens,solution,answer,explanation:`全文：${lead} ${solution.join(" ")}`});
}
pair("nr_iq1","indirect-question","彼がなぜ遅れたのか私は彼に尋ねた。","I",["why","late","asked","was","him","he"],["asked","him","why","he","was","late"]);
pair("nr_iq2","indirect-question","博物館がいつ開くか知っていますか。","Do you",["the","know","opens","museum","when"],["know","when","the","museum","opens"]);
pair("nr_iq3","indirect-question","彼女はその電車が正確にどこへ行くのか調べた。","She",["the train","found out","went","where","exactly"],["found out","exactly","where","the train","went"]);
pair("nr_iq4","indirect-question","何がその問題を引き起こしたのか明確に説明してください。","Please",["the problem","explain","caused","what","clearly"],["explain","clearly","what","caused","the problem"]);
pair("nr_iq5","indirect-question","その仕事を終えるのにどのくらい時間がかかるか彼は尋ねた。","He",["the work","asked","would take","how long","it","to finish"],["asked","how long","it","would take","to finish","the work"]);
pair("nr_rc1","relative-clause","私は駅で働いている女性に会った。","I",["at","a woman","met","the station","who","works"],["met","a woman","who","works","at","the station"]);
pair("nr_rc2","relative-clause","これは私が昨日買った本です。","This",["bought","book","is","yesterday","the","I"],["is","the","book","I","bought","yesterday"]);
pair("nr_rc3","relative-clause","英語を話せる人が必要です。","We",["English","who","need","someone","can speak"],["need","someone","who","can speak","English"]);
pair("nr_rc4","relative-clause","その大会で優勝した少年は私の友達です。","The",["is","the contest","won","boy","my friend","who"],["boy","who","won","the contest","is","my friend"]);
pair("nr_rc5","relative-clause","彼女は父親が医師である生徒を知っている。","She",["father","knows","is","a student","a doctor","whose"],["knows","a student","whose","father","is","a doctor"]);
pair("nr_ef1","effort-into-ing","彼らは行事の企画に多大な努力を注いだ。","They",["organizing","a great deal of","the event","put","effort","into"],["put","a great deal of","effort","into","organizing","the event"]);
pair("nr_ef2","effort-into-ing","私たちは英語力の向上に努力を注いだ。","We",["our English","improving","effort","into","put"],["put","effort","into","improving","our English"]);
pair("nr_ef3","effort-into-ing","彼女はその問題を解くことに多くの努力を注いだ。","She",["the problem","a lot of","solving","put","into","effort"],["put","a lot of","effort","into","solving","the problem"]);
pair("nr_ef4","effort-into-ing","生徒たちは教室を飾ることに努力を注いだ。","The students",["the classroom","into","effort","decorating","put"],["put","effort","into","decorating","the classroom"]);
pair("nr_ef5","effort-into-ing","彼は目標を達成することに全力を注いだ。","He",["achieving his goal","all his","put","effort","into"],["put","all his","effort","into","achieving his goal"]);
pair("nr_cp1","conjunction-phrasal","彼は課題を終えたが、提出するのを忘れた。","He",["it","finished","but","forgot","his assignment","to hand","in"],["finished","his assignment","but","forgot","to hand","it","in"]);
pair("nr_cp2","conjunction-phrasal","雨が降ったので、私たちは試合を中止した。","We",["the game","because","called","it rained","off"],["called","off","the game","because","it rained"]);
pair("nr_cp3","conjunction-phrasal","彼女は病気だったが、会議には現れた。","She",["the meeting","although","showed","was sick","up at","she"],["showed","up at","the meeting","although","she","was sick"]);
pair("nr_cp4","conjunction-phrasal","電車が遅れたため、彼は時間どおり到着できなかった。","He",["the train","because","on time","could not","was late","arrive"],["could not","arrive","on time","because","the train","was late"]);
pair("nr_cp5","conjunction-phrasal","私はその言葉を辞書で調べた。","I",["in","the word","looked","the dictionary","up"],["looked","the word","up","in","the dictionary"]);
pair("nr_cm1","comparison","ミカはクラスの誰よりも速く走る。","Mika",["anyone else","faster","her class","runs","than","in"],["runs","faster","than","anyone else","in","her class"]);
pair("nr_cm2","comparison","この本は私が思っていたより面白い。","This book",["I expected","interesting","than","more","is"],["is","more","interesting","than","I expected"]);
pair("nr_cm3","comparison","ケンは兄ほど背が高くない。","Ken",["his brother","not","tall","is","as","as"],["is","not","as","tall","as","his brother"]);
pair("nr_cm4","comparison","練習すればするほど上達する。","The",["you become","practice","you","better","more","the"],["more","you","practice","the","better","you become"]);
pair("nr_cm5","comparison","これは町で最も古い建物の一つです。","This is",["buildings","one","the oldest","in town","of"],["one","of","the oldest","buildings","in town"]);
pair("nr_fp1","fixed-pattern","彼女はできるだけ注意深く答えた。","She",["possible","carefully","answered","as","as"],["answered","as","carefully","as","possible"]);
pair("nr_fp2","fixed-pattern","その箱は私が運ぶには重すぎた。","The box",["carry","for me","too","was","heavy","to"],["was","too","heavy","for me","to","carry"]);
pair("nr_fp3","fixed-pattern","雨のため私たちは外で遊べなかった。","The rain",["playing","us","outside","prevented","from"],["prevented","us","from","playing","outside"]);
pair("nr_fp4","fixed-pattern","彼は二度と同じ間違いをしないように注意した。","He",["the same mistake","not to","was careful","again","make"],["was careful","not to","make","the same mistake","again"]);
pair("nr_fp5","fixed-pattern","彼女は疲れていたので歩けなかった。","She",["that","tired","so","could not","was","she walk"],["was","so","tired","that","she walk","could not"]);
// nr_fp5 は自然な英文になるよう選択肢を句単位にする。
Object.assign(B.find(x=>x.id==="nr_fp5"),{tokens:["was","so","tired","that","she could not walk"],solution:["was","so","tired","that","she could not walk"],answer:[1,4],explanation:"全文：She was so tired that she could not walk."});

function choice(id,skill,target,prompt,options,answer,explanation,focusTag){B.push({id,skill,level:3,type:"choice",targetId:target,focusTag:focusTag||target,examFormat:"choice",familyId:id,prompt,options,answer,explanation})}
choice("nd01","detail","detail-evidence","Lena planned to catch the 8:10 bus. When she reached the stop, she learned that it had been canceled, so she took the 8:25 train instead. How did Lena finally travel?",["By the 8:10 bus","By the 8:25 train","By taxi","On foot"],1,"最初の予定ではなく finally に当たる実際の移動手段を選ぶ。","state-change");
choice("nd02","detail","detail-evidence","The experiment was repeated three times. The first two results were similar, but the third was much higher because the room had become warmer. Why was the third result different?",["The equipment was new.","The room temperature changed.","The first test failed.","Fewer people joined."],1,"because 以下が第三の結果だけ異なった直接の理由。","cause-effect");
choice("nd03","detail","detail-evidence","Most of the 30 students chose the library, while six preferred the gym. Which statement is correct?",["All students chose the library.","Six students chose the library.","More students chose the library than the gym.","No one chose the gym."],2,"most と all を区別し、人数関係を読む。","explicit-evidence");
choice("nd04","detail","detail-evidence","At first, Amir believed the old map was useless. After comparing it with a photograph, he noticed that both showed the same unusual tree and decided to follow the map. What changed his mind?",["A warning from a friend","A matching detail in a photograph","The age of the map","The weather"],1,"考えが変わる直前の本文根拠を選ぶ。","state-change");
choice("nd05","detail","detail-evidence","The new machine finished the work quickly, but every result still had to be checked by an experienced worker. What limitation remained?",["It used too much paper.","It was slower than workers.","Its results required human checking.","It could not be turned on."],2,"but 以下に残る制約が示されている。","inference-evidence");
choice("nd06","detail","detail-evidence","Maya did not reply to the message that evening. Her phone had stopped working, and she did not see the message until the next morning. Why was her reply late?",["She disagreed with it.","She had lost the sender's address.","Her phone was not working.","She was traveling by train."],2,"did not と翌朝まで見なかった理由を対応させる。","cause-effect");
choice("nd07","detail","detail-evidence","The town first planned to build a road through the park. After residents suggested a different route, the council approved a road around the park. What was finally approved?",["No road at all","A road through the park","A road around the park","A larger park"],2,"first planned と finally approved を区別する。","state-change");
choice("nd08","detail","detail-evidence","Although the medicine reduced pain for many patients, the report says that it has not yet been tested on children. What can be concluded?",["It is safe for every child.","It helped no adults.","Its effect on children is still unknown.","The study included only children."],2,"未実施の対象について効果を断定しない。","inference-evidence");
choice("nd09","detail","detail-evidence","Nora left the key with Ben because she expected him to arrive first. Ben's train was delayed, however, and Nora reached the office before him. Who arrived first?",["Nora","Ben","Both together","The text does not say"],0,"予定ではなく実際の到着順を追う。","state-change");
choice("nd10","detail","detail-evidence","The article mentions two advantages of planting trees near classrooms: they block strong sunlight and reduce the need for air conditioning. Which benefit is NOT stated?",["Cooler rooms","Lower electricity use","Less direct sunlight","Quieter traffic"],3,"本文にない情報を選ぶ。","explicit-evidence");

function multi(id,prompt,options,answer,explanation){B.push({id,skill:"content_match",level:3,type:"multi_choice",targetId:"content-traps",focusTag:"choose-two",examFormat:"multi",familyId:id,prompt,options,answer,explanation})}
multi("ncm01","本文：At first Leo planned to visit London, but he finally went to Rome after his flight was canceled. 本文と一致するものを2つ選びなさい。",["Leo first planned to visit London.","Leo finally visited London.","His flight problem changed the plan.","He traveled to Paris.","He never changed his plan."],[0,2],"最初の予定と最終行動を分ける。" );
multi("ncm02","本文：The treatment helped most patients, although three reported no improvement. It has not yet been tested on children. 一致するものを2つ。",["It helped every patient.","Some patients did not improve.","It was tested on children.","A majority improved.","No patient improved."],[1,3],"most≠all、未実施を確認。" );
multi("ncm03","本文：Mina wanted to call Ken, but her battery died. She sent him an email after reaching home. 一致するものを2つ。",["Mina completed the phone call.","She intended to call Ken.","She never contacted him.","She later emailed him.","Ken's battery died."],[1,3],"意図と実行、誰の電池かを区別。" );
multi("ncm04","本文：Only the final group used the new machine. Its work was faster, but two results were incorrect. 一致するものを2つ。",["Every group used the machine.","The final group used it.","All results were correct.","The machine increased speed.","The machine was slower."],[1,3],"only・but の後を正確に読む。" );
multi("ncm05","本文：The event was moved indoors because rain was expected. In fact, the weather stayed dry, but the organizers did not move it outside again. 一致するものを2つ。",["Rain actually fell.","The event was held indoors.","The forecast influenced the decision.","The event was canceled.","The organizers moved it outside again."],[1,2],"予報と実際、決定後の行動を区別。" );

choice("nin01","insertion-cohesion","insertion-cohesion","挿入文：However, the second test produced a very different result.\nThe first test supported the idea. [1] The researchers repeated it with new equipment. [2] They checked the room temperature. [3] Finally, they discovered that heat had affected the test. [4]",["[1]","[2]","[3]","[4]"],1,"second test は repeat 後、They checked の前。","contrast-result");
choice("nin02","insertion-cohesion","insertion-cohesion","挿入文：For example, some birds use small sticks to reach insects.\nAnimals solve problems in many ways. [1] Such behavior was once thought to be unique to humans. [2] New studies have changed that view. [3] Researchers continue to observe animals in the wild. [4]",["[1]","[2]","[3]","[4]"],0,"一般論の直後に具体例を置き、Such behavior へつなぐ。","example-reference");
choice("nin03","insertion-cohesion","insertion-cohesion","挿入文：As a result, fewer residents drove into the center.\nThe city reduced bus fares in April. [1] Air quality began to improve during the summer. [2] The city kept the lower fares for another year. [3] A new train station opened much later. [4]",["[1]","[2]","[3]","[4]"],0,"施策→行動変化→大気改善の因果。","cause-effect");
choice("nin04","insertion-cohesion","insertion-cohesion","挿入文：Before that, the same task had taken several hours.\nA new machine completed the work in ten minutes. [1] Workers still checked every result. [2] This combination improved both speed and accuracy. [3] The company ordered another machine. [4]",["[1]","[2]","[3]","[4]"],0,"Before that は新機械導入前との時間対比。","time-order");
choice("nin05","insertion-cohesion","insertion-cohesion","挿入文：They therefore needed another way to communicate.\nThe team could not use mobile phones underground. [1] They created a set of hand signals. [2] Everyone practiced the signals before entering the tunnel. [3] The work was completed safely. [4]",["[1]","[2]","[3]","[4]"],0,"問題→必要→解決策の順。","reference-cause");

function textInitial(id,prompt,answer,explanation){B.push({id,skill:"vocab_definition",level:3,type:"text",targetId:"definition-initial",focusTag:"definition-initial",examFormat:"text",familyId:id,prompt,answerText:answer,initial:answer[0],explanation})}
textInitial("nvd01","A person who designs buildings is an (a        ).","architect","定義と頭文字 a から architect。" );
textInitial("nvd02","To (p        ) is to make something ready to be used or done.","prepare","定義と頭文字 p から prepare。" );
textInitial("nvd03","When a place is (c        ), there are too many people in it.","crowded","定義と頭文字 c から crowded。" );
textInitial("nvd04","Something that is (u        ) helps you do or get what you want.","useful","定義と頭文字 u から useful。" );
textInitial("nvd05","To (s        ) a problem means to find an answer to it.","solve","定義と頭文字 s から solve。" );

function fourBlank(id,prompt,answers,explanation,focusTag){B.push({id,skill:"sentence_completion",level:3,type:"text_multi",targetId:"sentence-grammar",focusTag,examFormat:"manual",familyId:id,prompt,answers,explanation})}
fourBlank("nsc01","次の日本語とほぼ同じ内容になるように、一語ずつ入れなさい。\n『その薬は人々が再び元気になるのを助けることができる。』\nThe medicine can (1) people (2) (3) (4).",["help","get","well","again"],"help＋人＋動詞原形、get well again。","help-object-verb");
fourBlank("nsc02","次の日本語とほぼ同じ内容になるように、一語ずつ入れなさい。\n『経験豊富な指導者がいなければ、自分たちだけでその仕事を終えるのは非常に難しい。』\n(1) an experienced leader, it is extremely (2) to complete the task (3) (4).",["Without","difficult","by","ourselves"],"Without＋名詞、by ourselves。","without-it-to");
fourBlank("nsc03","次の日本語とほぼ同じ内容になるように、一語ずつ入れなさい。\n『騒がしい場所には静かな場所の2倍の魚がいたと科学者たちは分かった。』\nScientists (1) that there were (2) as many fish in noisy places (3) in (4) ones.",["found","twice","as","quiet"],"twice as many A as B の比較。","multiple-comparison");
fourBlank("nsc04","次の日本語とほぼ同じ内容になるように、一語ずつ入れなさい。\n『ある種の機器が他の機器より脳に有害かどうか、彼らは調べたい。』\nThey want to find (1) whether some types of devices are (2) harmful (3) the brain (4) others.",["out","more","to","than"],"find out whether、more ... than。","whether-comparison");
fourBlank("nsc05","次の日本語とほぼ同じ内容になるように、一語ずつ入れなさい。\n『学校がより良い選択をできるように、私たちはこの情報を共有したい。』\nWe want (1) share this information (2) that schools can (3) better (4).",["to","so","make","choices"],"want to、so that、make choices。","purpose-so-that");

function self(id,skill,target,prompt,check,model,explanation,extra={}){B.push({id,skill,level:3,type:"selfcheck",targetId:target,focusTag:extra.focusTag||target,examFormat:"manual",familyId:id,prompt,check,model,explanation,...extra})}
self("nwc01","writing_completion","writing-story-completion","【2019型】次の物語を読み、(1)には例を5語以内、(2)には結論を10語以内で書きなさい。\nA teacher showed a white sheet with one black dot. The students spoke only about the dot. The teacher explained that people often notice one bad thing and ignore many good things.\nWe sometimes do this in daily life. (1) ____. Therefore, (2) ____.",["(1)が本文の教訓に合う具体例","(1)は5語以内","(2)は10語以内","2つの空所が論理的につながる"],"(1) We remember one mistake (2) we should notice the good things around us","2019年度の二つの空所と語数上限を再現。",{focusTag:"story-2019",partLimits:[5,10]});
self("nwc02","writing_completion","writing-story-completion","【2020型】次の物語を読み、(1)を5語以内、(2)を15語以内で完成しなさい。\nAya blamed her brother for moving her notebook. Later she found it under her own bed. She apologized to him.\nAya (1) ____. She learned that (2) ____.",["(1)が出来事の結末","(1)は5語以内","(2)が一般化した教訓","(2)は15語以内"],"(1) admitted her mistake (2) we should check the facts before blaming others","出来事完成＋教訓の2020年度型。",{focusTag:"story-2020",partLimits:[5,15]});
self("nwc03","writing_completion","writing-story-completion","【2021型】次の結論を二つの空所に各10語以内で書きなさい。\nRiku practiced the piano for ten minutes every day. At first he could not play the song, but after two months he performed it without stopping.\nSmall daily efforts (1) ____, so we should (2) ____.",["(1)(2)が文法的につながる","各空所10語以内","継続→成果の内容","本文にない主張を足さない"],"(1) can lead to a large improvement (2) continue even when progress seems slow","二つの空所が連動する2021年度型。",{focusTag:"story-2021",partLimits:[10,10]});
self("nwc04","writing_completion","writing-story-completion","【2020型】(1)を5語以内、(2)を15語以内で完成しなさい。\nNoah found a wallet and took it to the police station. The owner later called to thank him.\nNoah (1) ____. He realized that (2) ____.",["出来事と教訓を分けた","(1)は5語以内","(2)は15語以内","時制が自然"],"(1) helped the owner (2) an honest action can make both people feel better","年度形式に合わせた結末＋教訓。",{focusTag:"story-2020",partLimits:[5,15]});
self("nwc05","writing_completion","writing-story-completion","【2021型】二つの空所に各10語以内で書きなさい。\nMei and Sora could not lift a heavy table alone. When two classmates joined them, they moved it safely.\nWorking with others (1) ____, and it can also (2) ____.",["二つの効果が並列","各空所10語以内","協力の内容","文法的に完成"],"(1) makes difficult work easier (2) prevent people from getting hurt","連動する二空所の練習。",{focusTag:"story-2021",partLimits:[10,10]});

const sumPassage1="A woman entered a shop and asked for glasses because she wanted to read. The owner gave her several pairs, but none helped. He finally asked whether she had ever learned to read. She admitted that she had not. Her problem was not her eyesight but the fact that she could not read.";
const sumPassage2="A happy boy received a bag of gold from a rich man. At first he was delighted, but soon he began to fear that someone would steal it. He stopped sleeping peacefully and no longer enjoyed time with his friends. Finally, he returned the gold and recovered the calm life he had valued.";
const sumPassage3="Researchers studied bacteria found in soil and discovered a substance that killed some bacteria resistant to older drugs. The result may lead to a useful antibiotic. However, the substance has only been tested in laboratories, so scientists must examine its safety and effectiveness before it can be used to treat people.";
self("nsu01","summary","summary-main-points",`【2022型・40語以内】次の英文を要約しなさい。\n${sumPassage1}`,["眼鏡を試したこと","読めなかった本当の理由","40語以内","本文にない情報を加えていない"],"A woman tried several pairs of glasses because she wanted to read, but none helped. Her eyesight was not the problem; she had never learned to read.","本文から原因と結論を選ぶ。",{maxWords:40,focusTag:"summary-2022"});
self("nsu02","summary","summary-main-points",`【2023型・50語以内】次の英文を要約しなさい。\n${sumPassage2}`,["金を得たこと","不安になったこと","返して平穏を取り戻したこと","50語以内"],"A happy boy received gold and was delighted at first. However, fear of losing it took away his sleep and enjoyment. He finally returned the gold to the rich man because he valued his peaceful life more than wealth.","出来事→心情変化→結末。",{maxWords:50,focusTag:"summary-2023"});
self("nsu03","summary","summary-main-points",`【2022型・40語以内】次の英文を要約しなさい。\n${sumPassage3}`,["土壌細菌の研究","耐性菌に効く候補","人への使用前に追加試験が必要","40語以内"],"Scientists found a possible new antibiotic in soil bacteria that worked against resistant bacteria. However, more tests are necessary to confirm its safety and effectiveness before human use.","発見と限界を両方残す。",{maxWords:40,focusTag:"summary-2022"});
self("nsu04","summary","summary-main-points","【2023型・50語以内】次の英文を要約しなさい。\nWeaver ants carry large food together without following one leader. Each ant reacts to the direction of the others. In experiments, larger groups moved more accurately because individual mistakes were corrected by the group. Their behavior shows that cooperation can produce reliable decisions even when no single member controls the group.",["リーダー不在","集団判断","大集団ほど正確な理由","50語以内"],"Weaver ants carry food without a leader by responding to one another. Experiments showed that larger groups moved more accurately because the group corrected individual mistakes. Their behavior demonstrates that cooperation can produce reliable decisions without control by a single member.","仕組みと実験結果を残す。",{maxWords:50,focusTag:"summary-2023"});
self("nsu05","summary","summary-main-points","【2023型・50語以内】次の英文を要約しなさい。\nA school planted trees outside classroom windows to block strong afternoon sunlight. The rooms became cooler, students could concentrate more easily, and the school used less electricity for air conditioning. The project cost less than installing a new cooling system and also created a greener space around the building.",["施策","教室と電力への効果","費用面または環境面","50語以内"],"A school planted trees to block sunlight from classroom windows. The trees cooled the rooms, helped students concentrate, and reduced electricity use. The cheaper project also created greener surroundings, showing that one simple environmental change can provide several benefits.","施策→複数の効果を整理。",{maxWords:50,focusTag:"summary-2023"});

const dialogue=(claim)=>`次の会話を読み、Bの主張を要約したうえで反論しなさい。\nA: What do you think?\nB: ${claim}\nA: (                              )`;
self("nrb01","rebuttal","rebuttal-dialogue",`【2024型・60語以内】${dialogue("Students are already busy with lessons and club activities. Schools should therefore stop giving homework so that students have enough time to rest.")}`,["忙しさと宿題廃止の主張を要約","However/Butで転換","反論","理由または具体例","60語以内"],"You are saying that schools should stop giving homework because students are busy and need rest. However, a reasonable amount of homework is useful because it helps students review lessons and shows teachers what they do not understand. Schools should reduce excessive homework rather than remove it completely.","相手の理由を正確に受けて条件付きで反論。",{maxWords:60,focusTag:"rebuttal-2024"});
self("nrb02","rebuttal","rebuttal-dialogue",`【2025・2026型・約50語】${dialogue("Tablets are convenient and can store many books. Schools should replace every printed book with a tablet as soon as possible.")}`,["利便性と全面置換を要約","転換","紙の本も残す反論","具体的な理由","約50語"],"You argue that tablets should replace all printed books because they are convenient. However, schools should keep both. Printed books need no batteries and may help students concentrate, while tablets are useful for searching and carrying many materials. Students can choose the better tool for each task.","全文会話から相手の理由を抽出する。",{approxWords:50,focusTag:"rebuttal-2025"});
self("nrb03","rebuttal","rebuttal-dialogue",`【2025・2026型・約50語】${dialogue("Club activities take time away from study, and academic results are more important. For this reason, schools should remove all clubs.")}`,["勉強時間の主張を要約","However/But","クラブの教育効果","時間制限などの代案","約50語"],"You say schools should remove clubs because they reduce study time. However, clubs teach teamwork, responsibility, and time management. Schools can limit activity hours instead of removing clubs completely, allowing students to gain both academic and personal benefits.","問題を認め、全面廃止以外の解決策を示す。",{approxWords:50,focusTag:"rebuttal-2026"});
self("nrb04","rebuttal","rebuttal-dialogue",`【2024型・60語以内】${dialogue("Building a parking area is more useful than keeping the town park. More parking spaces would make shopping easier and bring more visitors to local stores.")}`,["駐車場の利点を要約","転換","公園を残す立場","理由と代案","60語以内"],"You believe the park should become a parking area because easier parking may attract shoppers. However, the park gives children a safe place to play and helps reduce heat. The town should improve public transportation or use another site for parking instead of losing an important public space.","相手の具体的理由を落とさず反論。",{maxWords:60,focusTag:"rebuttal-2024"});
self("nrb05","rebuttal","rebuttal-dialogue",`【2025・2026型・約50語】${dialogue("Translation AI is becoming very accurate. Students no longer need to spend time learning foreign languages because technology can translate for them.")}`,["AI翻訳と不要論を要約","転換","学習を残す反論","文化・誤訳・故障などの理由","約50語"],"You believe accurate translation AI makes language study unnecessary. However, knowing another language helps people understand culture, notice translation mistakes, and communicate when technology fails. AI is a useful tool, but it cannot replace every part of direct human communication.","道具の利点を認めつつ能力の価値を示す。",{approxWords:50,focusTag:"rebuttal-2026"});

// 新規追加後に共通メタデータを補完する。
for(const q of B){q.familyId=q.familyId||familyAliases[q.id]||normalizedFamily(q);q.examFormat=q.examFormat||q.type}
for(const target of new Set(B.filter(x=>!x.retired).map(x=>x.targetId))){
 const rows=B.filter(x=>!x.retired&&x.targetId===target),level3=rows.filter(x=>x.level===3);
 if(level3.length<2)rows.slice(-(2-level3.length)).forEach(q=>q.level=3);
}

function migrateState(state){
 state.goal=[60,70,75].includes(Number(state.goal))?Number(state.goal):60;
 state.currentDrill=state.currentDrill&&typeof state.currentDrill==="object"?state.currentDrill:null;
 for(const w of Object.values(state.weak||{})){
   const q=(D[w.year]||[]).find(x=>x.id===w.id),meta=q?actualMeta(w.year,q):null;
   if(meta)Object.assign(w,{targetId:meta.targetId,focusTag:w.component&&w.component!=="main"?`manual:${q.skill}:${w.component}`:meta.focusTag,examFormat:meta.examFormat,trap:w.component&&w.component!=="main"?w.component:meta.trap});
   const valid=new Set(B.filter(x=>!x.retired&&x.targetId===w.targetId).map(x=>x.id));
   w.reservedConfirm=[...new Set(Array.isArray(w.reservedConfirm)?w.reservedConfirm:[])].filter(id=>valid.has(id)).slice(0,2);
 }
 return state;
}
window.ENGLISH_MODEL={actualMeta,migrateState,activeBank:()=>B.filter(x=>!x.retired)};
})();
