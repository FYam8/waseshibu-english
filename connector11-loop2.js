(()=>{
"use strict";
const B=window.DRILLS||[];
const retireIds=new Set(["co01", "co02", "co03", "xco1", "xco2", "xco3", "xco4", "xco5", "xco6", "xco7", "xco8"]);
const retireReason="connector11 loop2: 1文完結型・接続語暗記型が多く、過去問型の前後文脈から論理関係を判断する負荷として軽いため、既存履歴保護のため非破壊retire。";
for(const q of B){if(retireIds.has(q.id)){q.retired=true;q.retiredBy="connector11-loop2";q.retiredReason=retireReason;q.legacyCompletion=true;}}
const replacements=[
  {
    "id": "lco01",
    "focusTag": "connector-example",
    "level": 3,
    "sourceComparison": "2022大問6問2型: 前文の抽象説明を受け、次文で具体例を導入する接続関係。",
    "prompt": "【オリジナル類題】Many students now use more than one screen while studying. They may read a textbook on a desk, keep a chat app open on a phone, and check short videos whenever they feel bored. (     ), some students try to solve math problems while replying to messages from friends. Researchers say this habit can make it harder to stay focused.",
    "options": [
      "For example",
      "However",
      "In other words",
      "As a result"
    ],
    "answer": 0,
    "explanation": "【正解】For example\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Many students now use more than one screen while studying. / some students try to solve math problems while replying to messages from friends.\n【根拠英文和訳】多くの生徒は勉強中に複数の画面を使う。数学の問題を解きながら友人へのメッセージに返信する生徒もいる。\n【なぜ正解か】前文の一般説明に対して、後文が具体例を出しているので For example が適切。\n【他選択肢】However は逆接、In other words は言い換え、As a result は結果なので合わない。\n【元弱点とのつながり】接続関係: 抽象説明と具体例の関係を判断する。\n【戦略分類】A/B: 具体例導入を見抜けば取れる。"
  },
  {
    "id": "lco02",
    "focusTag": "connector-contrast",
    "level": 3,
    "sourceComparison": "2021大問6問4型: 一般的な思い込みと本文で述べる実際の事実を対比する接続関係。",
    "prompt": "【オリジナル類題】Many people imagine that school gardens are used only by science classes. (     ), teachers in other subjects also use them. Art students draw plants there, and English classes sometimes write short poems after observing the flowers.",
    "options": [
      "However",
      "For example",
      "Therefore",
      "In addition"
    ],
    "answer": 0,
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】Many people imagine that school gardens are used only by science classes. / teachers in other subjects also use them.\n【根拠英文和訳】多くの人は学校の庭は理科だけで使われると思っている。しかし他教科の先生もそれを使う。\n【なぜ正解か】『理科だけ』という思い込みに対して『他教科も使う』と反対内容が続くので However。\n【他選択肢】For example は具体例導入、Therefore は結果、In addition は追加で、ここでは対比を示せない。\n【元弱点とのつながり】接続関係: 思い込みと実際の事実の逆接を読む。\n【戦略分類】A/B: only と also の対比を拾う。"
  },
  {
    "id": "lco03",
    "focusTag": "connector-contrast-limit",
    "level": 3,
    "sourceComparison": "2020大問6問4型: 前文で制限を述べ、後文でそれでも得られる利点を示す逆接。",
    "prompt": "【オリジナル類題】The new reading app does not make students love books immediately. Some students still prefer games and videos after using it for a few weeks. (     ), the app helps many of them read a little longer each day because it shows their progress clearly.",
    "options": [
      "However",
      "For example",
      "Because",
      "Otherwise"
    ],
    "answer": 0,
    "explanation": "【正解】However\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】does not make students love books immediately / the app helps many of them read a little longer each day\n【根拠英文和訳】すぐに本好きにするわけではないが、多くの生徒が毎日少し長く読む助けになる。\n【なぜ正解か】限界を述べた後に利点を述べているため逆接の However が合う。\n【他選択肢】For example は例、Because は理由、Otherwise は『そうでなければ』で文脈に合わない。\n【元弱点とのつながり】接続関係: マイナス情報の後のプラス情報を読む。\n【戦略分類】B: 前後の評価の向きが変わることを読む。"
  },
  {
    "id": "lco04",
    "focusTag": "connector-restatement",
    "level": 3,
    "sourceComparison": "近年説明文型: 専門的・抽象的な内容を別表現で言い換える接続関係。",
    "prompt": "【オリジナル類題】Some birds remember the places where they hide seeds for winter. They do not simply fly around until they find food by chance. (     ), they use memory to return to many small storage places when food becomes hard to find.",
    "options": [
      "In other words",
      "However",
      "For example",
      "As a result"
    ],
    "answer": 0,
    "explanation": "【正解】In other words\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】remember the places where they hide seeds / use memory to return to many small storage places\n【根拠英文和訳】種を隠した場所を覚え、記憶を使って多くの貯蔵場所へ戻る。\n【なぜ正解か】後文は前の内容を別の言い方で説明しているので In other words が適切。\n【他選択肢】However は逆接、For example は例、As a result は結果で、言い換えではない。\n【元弱点とのつながり】接続関係: 同じ内容の言い換えを見抜く。\n【戦略分類】B: remember と use memory の対応を読む。"
  },
  {
    "id": "lco05",
    "focusTag": "connector-result",
    "level": 3,
    "sourceComparison": "2022・2023説明文型: 実験や状況の結果を述べる接続関係。",
    "prompt": "【オリジナル類題】The town added more bicycle lanes and made the roads around schools safer. It also placed signs asking drivers to slow down. (     ), more children began riding bicycles to school instead of being driven by their parents.",
    "options": [
      "As a result",
      "For example",
      "However",
      "In other words"
    ],
    "answer": 0,
    "explanation": "【正解】As a result\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】added more bicycle lanes / made the roads around schools safer / more children began riding bicycles to school\n【根拠英文和訳】自転車レーンを増やし学校周辺の道路を安全にした。その結果、より多くの子どもが自転車で通学し始めた。\n【なぜ正解か】道路整備という原因・条件の後に、子どもの行動変化という結果が続くので As a result。\n【他選択肢】For example は例、However は逆接、In other words は言い換えで合わない。\n【元弱点とのつながり】接続関係: 原因となる取り組みと結果をつなぐ。\n【戦略分類】A/B: 前後の因果を読む。"
  },
  {
    "id": "lco06",
    "focusTag": "connector-addition",
    "level": 2,
    "sourceComparison": "説明文の列挙型: 1つ目の利点に加えて別の利点を述べる接続関係。",
    "prompt": "【オリジナル類題】Planting trees near classrooms can make the air cooler in summer. Students may feel more comfortable during break time. (     ), trees can give birds and insects a place to live, so the schoolyard becomes a better environment for nature.",
    "options": [
      "In addition",
      "However",
      "For example",
      "Therefore"
    ],
    "answer": 0,
    "explanation": "【正解】In addition\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】make the air cooler / trees can give birds and insects a place to live\n【根拠英文和訳】空気を涼しくする。さらに、鳥や昆虫のすみかにもなる。\n【なぜ正解か】木を植える利点を追加しているので In addition が自然。\n【他選択肢】However は反対、For example は例、Therefore は結果で、ここでは『追加』が中心。\n【元弱点とのつながり】接続関係: 利点の追加を読む。\n【戦略分類】A: also のような追加関係を見抜く。"
  },
  {
    "id": "lco07",
    "focusTag": "connector-concession",
    "level": 3,
    "sourceComparison": "物語・説明混合型: 一見不利な条件があっても結果が成立する譲歩関係。",
    "prompt": "【オリジナル類題】(     ) the robot was small and moved slowly, it was useful during the rescue practice. It could enter narrow spaces under desks and send pictures to the students controlling it.",
    "options": [
      "Although",
      "Because",
      "Until",
      "Unless"
    ],
    "answer": 0,
    "explanation": "【正解】Although\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】the robot was small and moved slowly / it was useful during the rescue practice\n【根拠英文和訳】ロボットは小さくゆっくり動いたが、救助訓練では役に立った。\n【なぜ正解か】不利に見える特徴と良い結果をつなぐ譲歩なので Although が適切。\n【他選択肢】Because は理由、Until は時、Unless は条件で、逆方向の関係を示せない。\n【元弱点とのつながり】接続関係: 『〜だけれども』の譲歩を読む。\n【戦略分類】A/B: 前半がマイナス、後半がプラス。"
  },
  {
    "id": "lco08",
    "focusTag": "connector-conclusion",
    "level": 3,
    "sourceComparison": "説明文結論型: 研究結果や複数情報から結論を導く接続関係。",
    "prompt": "【オリジナル類題】In the experiment, students who slept seven or eight hours remembered more English words than students who slept only four hours. They also made fewer careless mistakes on the next morning's quiz. (     ), getting enough sleep seems important for learning.",
    "options": [
      "Therefore",
      "For example",
      "However",
      "Instead"
    ],
    "answer": 0,
    "explanation": "【正解】Therefore\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】remembered more English words / made fewer careless mistakes / getting enough sleep seems important for learning\n【根拠英文和訳】より多くの英単語を覚え、ケアレスミスも少なかった。したがって十分な睡眠は学習に重要だと思われる。\n【なぜ正解か】実験結果から結論を導いているので Therefore が合う。\n【他選択肢】For example は例、However は逆接、Instead は代替で合わない。\n【元弱点とのつながり】接続関係: 複数結果から結論へ進む流れを読む。\n【戦略分類】B: 実験結果→結論を整理する。"
  },
  {
    "id": "lco09",
    "focusTag": "connector-alternative",
    "level": 3,
    "sourceComparison": "リスニング・読解の予定変更型にも通じる情報更新: 予定Aではなく別案Bに変わる接続関係。",
    "prompt": "【オリジナル類題】The class first planned to visit the river to collect water samples. Heavy rain made the path too muddy, so the teacher canceled that plan. (     ), the students used water kept in the school laboratory and practiced testing it indoors.",
    "options": [
      "Instead",
      "For example",
      "However",
      "In other words"
    ],
    "answer": 0,
    "explanation": "【正解】Instead\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】canceled that plan / used water kept in the school laboratory and practiced testing it indoors\n【根拠英文和訳】その計画を中止し、代わりに学校の実験室の水を使って室内で検査練習をした。\n【なぜ正解か】当初の計画をやめ、別の方法を選んでいるので Instead が適切。\n【他選択肢】For example は例、However は逆接、In other words は言い換えで、『代わりに』を表さない。\n【元弱点とのつながり】接続関係: 予定変更・代替案を読む。\n【戦略分類】A/B: canceled that plan を手がかりにする。"
  },
  {
    "id": "lco10",
    "focusTag": "connector-condition",
    "level": 3,
    "sourceComparison": "説明文の条件型: ある条件が満たされない場合の結果を示す接続関係。",
    "prompt": "【オリジナル類題】The museum allows visitors to take photographs of old paintings, but the flash must be turned off. Strong light can damage the colors over time. (     ) visitors follow this rule, the museum may have to stop allowing photographs altogether.",
    "options": [
      "Unless",
      "Although",
      "Because",
      "For example"
    ],
    "answer": 0,
    "explanation": "【正解】Unless\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】the flash must be turned off / visitors follow this rule / the museum may have to stop allowing photographs\n【根拠英文和訳】フラッシュは消さなければならない。来館者がこの規則を守らなければ、写真撮影自体を禁止する必要が出るかもしれない。\n【なぜ正解か】『規則を守らないなら』という条件なので Unless が適切。\n【他選択肢】Although は譲歩、Because は理由、For example は例で、条件を示さない。\n【元弱点とのつながり】接続関係: 条件と結果をつなぐ表現を選ぶ。\n【戦略分類】B: rule と stop allowing の関係を読む。"
  },
  {
    "id": "lco11",
    "focusTag": "connector-sequence-logic",
    "level": 3,
    "sourceComparison": "説明文の手順・因果型: 先行する準備の後に次の段階へ進む論理関係。",
    "prompt": "【オリジナル類題】The volunteers did not begin planting flowers as soon as they arrived. First, they removed stones from the ground and mixed in fresh soil. (     ), they placed the young plants in straight lines and watered them carefully.",
    "options": [
      "After that",
      "However",
      "For example",
      "Otherwise"
    ],
    "answer": 0,
    "explanation": "【正解】After that\n【設問和訳】空所に入る最も適切な接続表現を選ぶ。\n【根拠英文】First, they removed stones... / they placed the young plants... and watered them carefully.\n【根拠英文和訳】まず石を取り除いて新しい土を混ぜた。その後、若い苗をまっすぐ並べて植え、水をやった。\n【なぜ正解か】First の後に次の手順が続くので After that が最も自然。\n【他選択肢】However は逆接、For example は例、Otherwise は『そうしなければ』で手順関係に合わない。\n【元弱点とのつながり】接続関係: 時系列と作業手順を読む。\n【戦略分類】A: First に対応する次の段階を選ぶ。"
  }
];
for(const item of replacements){B.push(Object.assign({skill:"connector",type:"choice",targetId:"connector-logic",examFormat:"choice"}, item));}
})();
