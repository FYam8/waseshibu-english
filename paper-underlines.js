(function(){
"use strict";
// PDFから失われた下線範囲を、年度・問題冊子ページ単位で復元する。
// text は行中の識別範囲、part がある場合はその範囲内の一部分だけを下線にする。
const U={
 "2019:4":[
  {text:"card",part:"ar"},{text:"bird",part:"ir"},{text:"return",part:"ur"},
  {text:"serve",part:"er"},{text:"worm",part:"or"}
 ],
 "2019:6":[{text:"no good"}],
 "2019:7":[{text:"④“Thank…”",part:"“Thank…”"},{text:"⑤“It’s a bad idea,” her husband said.",part:"“It’s a bad idea,” her husband said."}],
 "2019:8":[{text:"no good"}],
 "2019:10":[
  {text:"そのおかげで病気の人々はまた元気になることができる。"},{text:"are resistant to"},
  {text:"③right below",part:"right below"},{text:"our feet"},{text:"that’s the future"}
 ],
 "2020:4":[
  {text:"leave",part:"ea"},{text:"cheap",part:"ea"},{text:"dead",part:"ea"},{text:"sea",part:"ea"}
 ],
 "2020:6":[{text:"conceal"}],
 "2020:7":[
  {text:"④“Uh…wild ducks?”",part:"“Uh…wild ducks?”"},{text:"I took a knife from my pocket"},
  {text:"and cut the fishing line."}
 ],
 "2020:8":[{text:"conceal"}],
 "2020:10":[
  {text:"he probably won’t"},{text:"grow out of his allergy."},{text:"trigger"},
  {text:"③More than",part:"More than"},
  {text:"96% of the children who finished the treatment could handle at least 300 milligrams of"},
  {text:"peanut powder. That’s equal to about one peanut."},
  {text:"経験豊かな医者がいないところで、アレルギーを持っている食べ物を摂取するこ"},
  {text:"とは極めて危険である。"}
 ],
 "2021:6":[
  {text:"language",part:"a"},{text:"happen",part:"a"},{text:"act",part:"a"},{text:"radio",part:"a"}
 ],
 "2021:8":[{text:"starve"}],
 "2021:9":[
  {text:"he needed something more than ink and paper."},{text:"he walked very quickly to"},
  {text:"the counter to buy a stamp and attached it to the envelope by hitting it many times with"},
  {text:"his fist"}
 ],
 "2021:10":[{text:"starve"}],
 "2021:12":[
  {text:"when corals die off, it’s not just about the corals."},{text:"lure"},
  {text:"the scientists found that the noisy site [         1   ] [   2   ] [   3   ] many fish as the"},
  {text:"[   4      ] sites."},{text:"their method"}
 ],
 "2021:13":[{text:"lure"}],
 "2022:6":[
  {text:"thousand",part:"th"},{text:"either",part:"th"},{text:"through",part:"th"},{text:"math",part:"th"}
 ],
 "2022:8":[{text:"detestation"}],
 "2022:9":[
  {text:"“I’ve seen a weekend cottage near Dorking that I would like to buy,” continued Miss"},
  {text:"Mebbin. “Six hundred and eighty pounds. Good price, but I don’t happen to have the money.”"},
  {text:"she answered, “The unplanned costs were just too heavy"}
 ],
 "2022:10":[{text:"detestation"}],
 "2022:12":[
  {text:"a new study in the scientific journal Nature"},{text:"The survey"},
  {text:"They want to find out [ 1 ] [ 2 ] is one type"},
  {text:"of digital device that [ 3 ] [ 4 ] [ 5 ] to the brain than others."},{text:"resist"}
 ],
 "2022:13":[{text:"resist"},{text:"不適切"}],
 "2023:4":[
  {text:"breathe",part:"ea"},{text:"spread",part:"ea"},{text:"weapon",part:"ea"},{text:"feather",part:"ea"}
 ],
 "2023:6":[
  {text:"①“If people are bad at studies, they are usually good at something else. For you,",part:"“If people are bad at studies, they are usually good at something else. For you,"},
  {text:"though, that ‘something else’ definitely isn’t art.”"},
  {text:"He picked them up and looked at Ray’s drawing and back at the earplugs."},{text:"legitimate"}
 ],
 "2023:8":[{text:"legitimate"}],
 "2023:10":[
  {text:"The scientists were [ 1 ] that magpies might [ 2 ]"},
  {text:"a hard [ 3 ] living in a [ 4 ] environment caused by climate change."},
  {text:"outsmarted us"},{text:"the difficult problem"},{text:"their original research"}
 ],
 "2023:11":[{text:"outsmarted us"}],
 "2024:4":[
  {text:"trouble",part:"ou"},{text:"thousand",part:"ou"},{text:"enough",part:"ou"},{text:"touch",part:"ou"}
 ],
 "2024:6":[{text:"Yollie found it difficult to watch, so she decided to leave her mother alone"}],
 "2024:7":[{text:"her face turned pale"}],
 "2024:10":[
  {text:"bumblebees might enjoy rolling wooden balls without any training or rewards"},
  {text:"This is similar to what we see in other animals"},{text:"when they play."},
  {text:"scientists are ( 1 ) not"},{text:"( 2 ) ( 3 ) bees play and how playing ( 4 ) them."}
 ],
 "2025:6":[
  {text:"gesture",part:"g"},{text:"globally",part:"g"},{text:"greet",part:"g"},{text:"gate",part:"g"}
 ],
 "2025:9":[
  {text:"➂Bill turned and saw the boy, and",part:"Bill turned and saw the boy, and"},
  {text:"then sat down on the ground. He couldn’t stand up for an hour."}
 ],
 "2025:10":[{text:"➄he started shouting and held tightly to Bill’s leg.",part:"he started shouting and held tightly to Bill’s leg."}],
 "2025:12":[
  {text:"➁Activity levels were much lower for girls than boys",part:"Activity levels were much lower for girls than boys"},
  {text:"in primary schools with uniforms."},
  {text:"➂we want to share this information (      1 ) ( 2 ) schools can",part:"we want to share this information (      1 ) ( 2 ) schools can"},
  {text:"(   3 ) ( 4 ) choices."},{text:"➃barriers",part:"barriers"}
 ],
 "2025:13":[{text:"➃barriers",part:"barriers"}],
 "2026:6":[
  {text:"home",part:"o"},{text:"remove",part:"o"},{text:"gold",part:"o"},{text:"notice",part:"o"}
 ],
 "2026:9":[{text:"③She put them in her bag",part:"She put them in her bag"}],
 "2026:10":[{text:"⑤The next morning, Norma made a big breakfast",part:"The next morning, Norma made a big breakfast"}],
 "2026:12":[
  {text:"①many ants work [ 1 ] to",part:"many ants work [ 1 ] to"},
  {text:"carry a large food item, [ 2 ] [ 3 ] a dead [ 4 ], back to their nest"},
  {text:"③the tethered-object",part:"the tethered-object"},{text:"test. In this test",part:"test"},
  {text:"wisdom of the crowd"}
 ],
 "2026:13":[{text:"行われていない"}]
};
window.PAPER_UNDERLINES=U;
})();
