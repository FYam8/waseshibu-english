(()=>{
'use strict';
const B=window.DRILLS||[];

// let01: keep same item, fix Japanese prompt/criteria so the one-word answer "naturally" matches the question.
{
  const q=B.find(d=>d.id==='let01');
  if(q){
    q.prompt="【オリジナル類題】次の本文を読み、『自然に』に当たる英語1語を本文中から抜き出しなさい。\n\nThe science club tested three boxes. The first was empty, the second was full of dry leaves, and the third was packed with old plastic bottles. After one week, only the leaves had begun to break down naturally. The teacher said this showed why plastic can remain in the environment for a long time.";
    q.answerText="naturally";
    q.explanation="【正解】naturally\n【設問和訳】本文中から『自然に』に当たる英語1語を抜き出す。\n【根拠英文】After one week, only the leaves had begun to break down naturally.\n【根拠英文和訳】1週間後、葉だけが自然に分解され始めていた。\n【なぜ正解か】naturally は『自然に』という意味で、本文中の break down naturally の中で分解のしかたを説明している。\n【他選択肢が違う理由】記述式なので選択肢はないが、break down は『分解する』で2語の句であり、今回の1語指定『自然に』には合わない。\n【弱点】本文抜き出しでは、日本語のどの部分に対応する語を聞かれているかを細かく確認する。\n【戦略】A。該当表現を見つけたあと、1語指定に合う部分だけを答える。";
  }
}

// lex11: retire because topic/answer direction was too close to 2025 original "barriers / uniforms / girls' activity".
{
  const old=B.find(d=>d.id==='lex11');
  if(old){
    old.retired=true;
    old.retiredReason='vocab45_correction_loop4_too_close_to_2025_barriers_uniforms';
    old.legacyCompletion=true;
  }
  B.push({
    id:"lex21",
    skill:"example",
    level:3,
    type:"choice",
    targetId:"example-contextual",
    focusTag:"example-contextual",
    examFormat:"choice",
    familyId:"lex21",
    prompt:"【オリジナル類題】次の本文を読み、下の考えに合う具体例として最も適切なものを選びなさい。\n\nThe community center started a weekend computer class for older residents. Many people wanted to join because they needed to use online forms for hospitals and public services. However, the application form for the class had to be completed on a website, and the instructions were written in very small letters. Several residents gave up before the first lesson began. The staff later made a paper form and added larger instructions at the front desk.\n\n考え: Some barriers can stop people from joining a useful activity.",
    options:[
      "A center offers a class that teaches people how to use online forms.",
      "A difficult online application form prevents older residents from joining a computer class.",
      "Several residents enjoy learning together after the staff helps them in class.",
      "A staff member chooses a larger classroom because many people are interested."
    ],
    answer:1,
    explanation:"【正解】A difficult online application form prevents older residents from joining a computer class.\n【設問和訳】本文を読み、『役に立つ活動への参加を妨げる障壁がある』という考えに合う具体例を選ぶ。\n【根拠英文】However, the application form for the class had to be completed on a website, and the instructions were written in very small letters. Several residents gave up before the first lesson began.\n【根拠英文和訳】しかし、その授業の申込書はウェブサイト上で記入しなければならず、説明はとても小さな文字で書かれていた。何人かの住民は最初の授業が始まる前にあきらめた。\n【なぜ正解か】申込方法と小さな説明文字が原因で、参加したい人が授業に参加できなくなっている。これは『barrier＝妨げ』の具体例である。\n【他選択肢が違う理由】Aは活動の内容で、妨げではない。Cは参加後の様子で、妨げではない。Dは人数が多いことへの対応で、参加を妨げる例ではない。\n【弱点】具体例問題では、抽象的な考えを本文中の具体的な出来事に結びつける。\n【戦略】B。『何が、誰の、どの行動を妨げたか』を本文で確認する。"
  });
}
})();