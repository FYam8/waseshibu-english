(()=>{
  const byId = new Map((window.DRILLS||[]).map(d=>[d.id,d]));
  const reorderPatches = {
  "ro01": {
    "lead": "I [ ア have / イ no / ウ idea / エ what / オ I / カ should / キ say / ク to her ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n私は彼女に何と言えばよいかわからない。\nI (1) ______ ______ what (2) ______ say to her.",
    "answer": [
      0,
      4
    ],
    "explanation": "【完成英文】I have no idea what I should say to her.\n【全文和訳】私は彼女に何と言えばよいかわからない。\n【文構造】I have no idea + what + S + should + 動詞。\n【重要構文】have no idea what S should do「Sが何をすべきかわからない」。\n【語順理由】what節は間接疑問なので what I should say の語順にする。\n【指定位置】(1)：have ／ (2)：I\n【間違いやすい点】what should I say と疑問文語順にしない。\n【戦略】A：2026型は全文を完成させてから、番号空欄に入る語句だけを答える。"
  },
  "ro02": {
    "lead": "People [ ア who / イ stay / ウ up / エ late / オ may / カ catch / キ a cold / ク easily ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n夜更かしをする人は風邪をひきやすい。\nPeople (1) ______ ______ ______ (2) ______ catch a cold easily.",
    "answer": [
      0,
      4
    ],
    "explanation": "【完成英文】People who stay up late may catch a cold easily.\n【全文和訳】夜更かしをする人は風邪をひきやすい。\n【文構造】People + who stay up late + may catch ...。\n【重要構文】関係代名詞 who が People を説明する。\n【語順理由】who の後は stay up late、主節の動詞は may catch。\n【指定位置】(1)：who ／ (2)：may\n【間違いやすい点】修飾部分と主節を混ぜない。\n【戦略】A：関係詞節の切れ目を見つける。"
  },
  "ro05": {
    "lead": "He is [ ア looking / イ for / ウ someone / エ who / オ can / カ take care / キ of his dog ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n彼は休暇中に犬の世話をしてくれる人を探している。\nHe is (1) ______ ______ someone (2) ______ take care of his dog during his vacation.",
    "answer": [
      0,
      4
    ],
    "explanation": "【完成英文】He is looking for someone who can take care of his dog during his vacation.\n【全文和訳】彼は休暇中に犬の世話をしてくれる人を探している。\n【文構造】is looking for someone + who can take care of ...。\n【重要構文】look for「探す」／ someone who can ...「〜できる人」。\n【語順理由】looking for を先に作り、その後に someone を who節で説明する。\n【指定位置】(1)：looking ／ (2)：can\n【間違いやすい点】take care of を分けすぎない。\n【戦略】A：熟語と関係詞節を先に固める。"
  },
  "ro06": {
    "lead": "We [ ア put / イ a lot / ウ of / エ effort / オ into / カ preparing / キ for / ク the festival ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n私たちは学園祭の準備に多くの努力を注いだ。\nWe (1) ______ a lot of effort (2) ______ for the festival.",
    "answer": [
      0,
      5
    ],
    "explanation": "【完成英文】We put a lot of effort into preparing for the festival.\n【全文和訳】私たちは学園祭の準備に多くの努力を注いだ。\n【文構造】put + a lot of effort + into + 動名詞。\n【重要構文】put effort into -ing「〜に努力を注ぐ」。\n【語順理由】into の後ろは名詞か動名詞なので preparing にする。\n【指定位置】(1)：put ／ (2)：preparing\n【間違いやすい点】prepare とせず preparing にする。\n【戦略】B：熟語の後ろの品詞まで確認する。"
  },
  "ro07": {
    "lead": "We should [ ア find / イ out / ウ where / エ the information / オ comes / カ from ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nその情報がどこから来たのか調べた方がよい。\nWe should (1) ______ ______ (2) ______ the information comes from.",
    "answer": [
      0,
      2
    ],
    "explanation": "【完成英文】We should find out where the information comes from.\n【全文和訳】私たちはその情報がどこから来たのか調べるべきだ。\n【文構造】should find out + where + S + V。\n【重要構文】find out「調べる」／間接疑問の語順。\n【語順理由】where節は where the information comes from の平叙文語順。\n【指定位置】(1)：find ／ (2)：where\n【間違いやすい点】where does the information come from としない。\n【戦略】B：疑問詞節は主語＋動詞の順で作る。"
  },
  "ro08": {
    "lead": "He finished his report, [ ア but / イ he couldn’t / ウ hand / エ it / オ in / カ because / キ he got / ク sick ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\n彼はレポートを終えたが、病気になったため提出できなかった。\nHe finished his report, (1) ______ ______ hand it in (2) ______ he got sick.",
    "answer": [
      0,
      5
    ],
    "explanation": "【完成英文】He finished his report, but he couldn’t hand it in because he got sick.\n【全文和訳】彼はレポートを終えたが、病気になったため提出できなかった。\n【文構造】butで逆接、becauseで理由をつなぐ。\n【重要構文】hand in「提出する」。\n【語順理由】but he couldn’t ... で対比を作り、because he got sick で理由を続ける。\n【指定位置】(1)：but ／ (2)：because\n【間違いやすい点】hand in it ではなく hand it in。\n【戦略】B：接続関係と句動詞の語順を同時に確認する。"
  },
  "ro09": {
    "lead": "Sally [ ア tried / イ to / ウ find out / エ what / オ would make / カ her / キ happy ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nサリーは何が自分を幸せにするのかを探ろうとした。\nSally (1) ______ ______ find out (2) ______ would make her happy.",
    "answer": [
      0,
      3
    ],
    "explanation": "【完成英文】Sally tried to find out what would make her happy.\n【全文和訳】サリーは何が自分を幸せにするのかを探ろうとした。\n【文構造】tried to + 動詞原形 / find out + what節。\n【重要構文】try to do「〜しようとする」。\n【語順理由】whatが主語になり、what would make her happy の語順になる。\n【指定位置】(1)：tried ／ (2)：what\n【間違いやすい点】what her happy would make のようにしない。\n【戦略】B：whatが疑問詞か主語かを見分ける。"
  },
  "xro3": {
    "lead": "The box [ ア was / イ too / ウ heavy / エ for / オ me / カ to carry ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nその箱は私には重すぎて運べなかった。\nThe box (1) ______ too heavy (2) ______ me to carry.",
    "answer": [
      0,
      3
    ],
    "explanation": "【完成英文】The box was too heavy for me to carry.\n【全文和訳】その箱は私には重すぎて運べなかった。\n【文構造】too + 形容詞 + for 人 + to do。\n【重要構文】too ... to do「〜すぎて…できない」。\n【語順理由】形容詞heavyの後に for me to carry を続ける。\n【指定位置】(1)：was ／ (2)：for\n【間違いやすい点】for meの位置をto carryの後に置かない。\n【戦略】A：too ... for 人 to do を一まとまりで覚える。"
  },
  "nr_rc1": {
    "lead": "This is [ ア the book / イ that / ウ I / エ bought / オ yesterday ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nこれは私が昨日買った本です。\nThis is (1) ______ ______ I (2) ______ yesterday.",
    "answer": [
      0,
      3
    ],
    "explanation": "【完成英文】This is the book that I bought yesterday.\n【全文和訳】これは私が昨日買った本です。\n【文構造】the book + that I bought yesterday。\n【重要構文】目的格の関係代名詞that。\n【語順理由】thatの後は I bought yesterday と主語＋動詞の順にする。\n【指定位置】(1)：the book ／ (2)：bought\n【間違いやすい点】that bought I としない。\n【戦略】A：関係詞節は前の名詞を説明する。"
  },
  "nr_cp1": {
    "lead": "Ken is [ ア better / イ at / ウ speaking / エ than / オ anyone / カ else ].",
    "prompt": "【2026型オリジナル類題】次の英文が日本語の意味になるように、[ ]内を並べ替えたとき、文中の(1)(2)に入る語句を選びなさい。\nケンは話すことが他の誰よりも得意だ。\nKen is (1) ______ at speaking (2) ______ anyone else.",
    "answer": [
      0,
      3
    ],
    "explanation": "【完成英文】Ken is better at speaking than anyone else.\n【全文和訳】ケンは話すことが他の誰よりも得意だ。\n【文構造】better at A than B。\n【重要構文】比較級 + than anyone else「他の誰よりも」。\n【語順理由】better at speaking で得意な内容を示し、than anyone elseで比較対象を出す。\n【指定位置】(1)：better ／ (2)：than\n【間違いやすい点】gooder ではなく better。\n【戦略】A：比較級とthanをセットで確認する。"
  }
};
  for (const [id, patch] of Object.entries(reorderPatches)){
    const d = byId.get(id);
    if(d){
      Object.assign(d, patch, {
        type: "pair",
        examFormat: "numbered_blanks_2026",
        targetId: d.targetId || "reorder",
        pairInstruction: "文中の(1)(2)に入る語句を順にタップ",
        pairAlert: "(1)(2)に入る2つの語句を順に選んでください。"
      });
      d.auditStatus = "grammar77_loop3_2026_numbered_blank_patch";
    }
  }
  const retire = ["lwc01","lwc02","lwc03","lwc04","lwc05","lwc06","lwc07","lwc08","lwc09","lwc10","lwc11","lwc12","lwc13","lwc14"];
  for (const id of retire){
    const d = byId.get(id);
    if(d){
      d.retired = true;
      d.active = false;
      d.retiredReason = "grammar77_loop3_writing_completion_length_and_blank_constraints";
    }
  }
  const newItems = [
  {
    "id": "lwc29",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2020型】【2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nMr. Hill kept a small bakery near the station. Every morning, his old dog Max slept beside the back door. One winter day, Mr. Hill was busy putting bread into the oven when Max suddenly barked and ran outside. Mr. Hill thought Max wanted to play, so he shouted at him to be quiet. Max did not stop. He pulled Mr. Hill’s apron and ran toward the street. When Mr. Hill followed him, he saw smoke coming from the delivery room. A box of paper bags had fallen near a heater. Mr. Hill quickly turned it off and called for help. If Max had not warned him, the shop might have burned. Mr. Hill hugged Max and said, “I should have trusted you.”\nMr. Hill learned that (1) ______. The story teaches us that (2) ______.",
    "partLimits": [
      5,
      15
    ],
    "model": "animals can notice danger / we should not ignore warnings just because we are busy",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) animals can notice danger / (2) we should not ignore warnings just because we are busy\n【全文要旨】犬が異変を知らせ、店主が火事を防ぐ。\n【空所条件】(1)は結末から分かる事実、(2)は教訓。\n【語数】(1)5語以内、(2)15語以内。\n【文法・語法】that節として自然につながる文にする。\n【過去問比較】2020型の結末＋教訓完成に合わせた。\n【別解】同内容なら可。\n【戦略】B：細部ではなく出来事の意味をまとめる。"
  },
  {
    "id": "lwc30",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2021型】【2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nOn a hot afternoon, many students walked past the school garden without noticing the small plants. One girl, Emi, stopped and poured the water left in her bottle onto a dry flower. Her friend laughed and said, “One bottle of water will not save the whole garden.” Emi answered, “Maybe not, but this flower needs it now.” The next day, two other students brought extra water. By Friday, several classmates were taking turns caring for the garden. The teacher told them that a small action can start a larger change.\nThe story teaches us that (1) ______ even if (2) ______.",
    "partLimits": [
      10,
      10
    ],
    "model": "one small action can matter / it does not solve everything at once",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) one small action can matter / (2) it does not solve everything at once\n【全文要旨】一人の小さな行動が周囲に広がる。\n【空所条件】2021型に近く、even ifで譲歩を作る。\n【語数】各10語以内。\n【文法・語法】even if の後は主語＋動詞を置く。\n【過去問比較】starfish型の「小さな行動にも意味がある」処理。\n【別解】help one person / only a little など同趣旨なら可。\n【戦略】B：教訓を一般化する。"
  },
  {
    "id": "lwc31",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2020型】【2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nRina found a wallet under a bench after volleyball practice. It had a student card, two bus tickets, and some money inside. Her friends were already leaving, and one of them said, “Just give it to the owner tomorrow.” Rina looked at the card and saw that the owner lived far from school. Without the bus tickets, the student might not be able to get home easily. Rina took the wallet to the teachers’ room before going home. Ten minutes later, a first-year student came in, almost crying. When the teacher handed him the wallet, he bowed to Rina again and again.\nRina realized that (1) ______. The story shows that (2) ______.",
    "partLimits": [
      5,
      15
    ],
    "model": "quick action can help / doing the right thing soon can protect someone from trouble",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) quick action can help / (2) doing the right thing soon can protect someone from trouble\n【全文要旨】財布をすぐ届けたことで困っていた生徒を助けた。\n【空所条件】(1)はRinaの気づき、(2)は一般的教訓。\n【語数】5語以内・15語以内。\n【文法・語法】that節に名詞句または文を入れる。\n【過去問比較】2020型の出来事理解＋教訓完成。\n【別解】helping quickly matters など可。\n【戦略】A/B：行動の結果を教訓化する。"
  },
  {
    "id": "lwc32",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2021型】【2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nThe art club wanted to paint a large picture for the school festival. Everyone wanted to draw the most important part, so the picture remained unfinished for many days. A quiet student named Jun said nothing at first. Then he began cleaning brushes, mixing colors, and drawing the background. Other members noticed that his work made their parts look better. Soon they stopped arguing and finished the picture together. On the festival day, many visitors praised the whole work, not one student’s part.\nThe club learned that (1) ______ even if (2) ______.",
    "partLimits": [
      10,
      10
    ],
    "model": "supporting others is important / your work is not the most noticeable part",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) supporting others is important / (2) your work is not the most noticeable part\n【全文要旨】目立たない役割が全体を支えた。\n【空所条件】even ifで「目立たなくても」を表す。\n【語数】各10語以内。\n【文法・語法】supporting others など動名詞主語が使いやすい。\n【過去問比較】2021型の教訓文完成。\n【別解】teamwork matters など可。\n【戦略】B：具体出来事を一般的教訓にする。"
  },
  {
    "id": "lwc33",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2020型】【2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nTom was sure that a new app would make his English perfect. He downloaded it and showed it proudly to his mother. For a week, he only opened the app to collect points and choose easy words he already knew. Before a vocabulary quiz, he told his friend that studying was no longer necessary. The next day, he could not answer many questions because he had never practiced using the words in sentences. His teacher said the app was useful, but only if he used it seriously. Tom started writing his own example sentences after that.\nTom learned that (1) ______. The story teaches us that (2) ______.",
    "partLimits": [
      5,
      15
    ],
    "model": "tools are not magic / a tool helps only when people use it properly",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) tools are not magic / (2) a tool helps only when people use it properly\n【全文要旨】アプリを持つだけでは力がつかず、使い方が大切だと学ぶ。\n【空所条件】(1)はTomの学び、(2)は一般化された教訓。\n【語数】5語以内・15語以内。\n【文法・語法】that節に自然につながる文を入れる。\n【過去問比較】2022要約型にも通じる「道具の限界」だが、形式は2020完成型。\n【別解】practice is necessary など可。\n【戦略】A/B：道具と実力の関係を読む。"
  },
  {
    "id": "lwc34",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2021型】【2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nDuring a class trip, the teacher gave each group a map. Kaito said he knew the town well and put the map into his bag without looking at it. After lunch, he led his group down a narrow street because he remembered seeing a museum there years ago. The street ended at a construction fence. Another student opened the map and found a different route. They arrived late but safely. Kaito apologized and admitted that memory alone was not enough.\nThe story teaches us that (1) ______ even if (2) ______.",
    "partLimits": [
      10,
      10
    ],
    "model": "checking reliable information is important / you think you already know the way",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) checking reliable information is important / (2) you think you already know the way\n【全文要旨】記憶だけを頼りにして道に迷い、地図の必要性を学ぶ。\n【空所条件】even ifで「知っているつもりでも」を表す。\n【語数】各10語以内。\n【文法・語法】checking ... is important の形が自然。\n【過去問比較】2021型の一般教訓完成。\n【別解】using a map matters など可。\n【戦略】A/B：原因と教訓を結びつける。"
  },
  {
    "id": "lwc35",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2020型】【2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nMika promised to water her neighbor’s plants while he was away. On the first two days, she did it carefully. On the third day, her favorite drama was on TV, and she thought one missed day would not matter. The weather became unusually hot that afternoon. The next morning, several flowers were hanging down. Mika felt terrible and spent the weekend helping her neighbor plant new flowers. He forgave her, but she understood that a small job could still be an important promise.\nMika realized that (1) ______. The story shows that (2) ______.",
    "partLimits": [
      5,
      15
    ],
    "model": "promises need care / even small promises should be taken seriously",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) promises need care / (2) even small promises should be taken seriously\n【全文要旨】小さな約束を軽く見て失敗し、責任を学ぶ。\n【空所条件】(1)は気づき、(2)は教訓。\n【語数】5語以内・15語以内。\n【文法・語法】promise は名詞・動詞の両方に注意。\n【過去問比較】2020型の失敗からの教訓完成。\n【別解】responsibility is important など可。\n【戦略】A：結末から教訓を作る。"
  },
  {
    "id": "lwc36",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2021型】【2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nA school newspaper team had only three members. They wanted to write about every club, every teacher, and every event before the festival. At first, the plan looked exciting, but soon they could not finish even one article well. Their adviser told them to choose the stories that mattered most to readers. The team wrote fewer articles, checked the facts carefully, and added clear photos. Many students said the smaller newspaper was easier to read than the long unfinished one they had planned.\nThe team learned that (1) ______ even if (2) ______.",
    "partLimits": [
      10,
      10
    ],
    "model": "choosing important information is necessary / there are many things to include",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) choosing important information is necessary / (2) there are many things to include\n【全文要旨】全部入れようとして失敗し、重要情報を選ぶ大切さを学ぶ。\n【空所条件】even ifで「入れたい情報が多くても」を表す。\n【語数】各10語以内。\n【文法・語法】choosing ... is necessary が使いやすい。\n【過去問比較】2021型の教訓完成に加え、要約技能にもつながる。\n【別解】less can be better など可。\n【戦略】B：抽象化しすぎず本文の教訓を残す。"
  },
  {
    "id": "lwc37",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2020型】【2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nA young runner named Sora always started races very fast. He enjoyed hearing people cheer at the beginning and thought a strong start was the only thing that mattered. His coach told him to save some energy, but Sora did not listen. In an important race, he was leading after the first lap. Then his legs became heavy, and three runners passed him near the finish line. After the race, Sora watched the winner, who had run at a steady speed from start to finish. Sora decided to change his training.\nSora learned that (1) ______. The story teaches us that (2) ______.",
    "partLimits": [
      5,
      15
    ],
    "model": "pace is important / starting well is not enough if you cannot finish strongly",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) pace is important / (2) starting well is not enough if you cannot finish strongly\n【全文要旨】序盤だけ速く走って失敗し、ペース配分を学ぶ。\n【空所条件】(1)は短い学び、(2)は一般的教訓。\n【語数】5語以内・15語以内。\n【文法・語法】if節で条件を表すとまとめやすい。\n【過去問比較】2020型の出来事→結論→教訓。\n【別解】balance matters など可。\n【戦略】A/B：失敗の原因を教訓化する。"
  },
  {
    "id": "lwc38",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2021型】【2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nA boy found an old radio in his grandmother’s room and laughed at it. He said his phone could do everything better. That night, a storm cut the electricity, and the phone network stopped working. His grandmother turned on the radio with small batteries and listened to emergency information. It told them which road was flooded and where people could get help. The boy stopped laughing and helped his grandmother write down the important information.\nThe boy learned that (1) ______ even if (2) ______.",
    "partLimits": [
      10,
      10
    ],
    "model": "old things can still be useful / new technology seems better",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) old things can still be useful / (2) new technology seems better\n【全文要旨】古いラジオが災害時に役立ち、古い物の価値を知る。\n【空所条件】even ifで一見反対の条件を表す。\n【語数】各10語以内。\n【文法・語法】old things can still be useful が自然。\n【過去問比較】2021型の教訓完成。\n【別解】we should not judge only by age など可。\n【戦略】A/B：態度変化を教訓化する。"
  },
  {
    "id": "lwc39",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2020型】【2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nAya was chosen to be the leader of a group project. She wanted everything to be perfect, so she did most of the work by herself. When members offered ideas, she said it was faster if she decided alone. Two days before the presentation, Aya became sick and could not come to school. The other members did not know where the notes were or what they should say. They finally finished the project, but it was not as clear as it could have been. Aya apologized and shared all the files with them after that.\nAya realized that (1) ______. The story shows that (2) ______.",
    "partLimits": [
      5,
      15
    ],
    "model": "teamwork is necessary / a leader should share work and information with others",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) teamwork is necessary / (2) a leader should share work and information with others\n【全文要旨】一人で抱え込み、欠席で困らせたため、共有と協力を学ぶ。\n【空所条件】(1)は気づき、(2)は教訓。\n【語数】5語以内・15語以内。\n【文法・語法】should + 動詞原形で助言・教訓を表せる。\n【過去問比較】2020型の出来事理解＋教訓完成。\n【別解】leaders should trust others など可。\n【戦略】B：失敗の構造を抽象化する。"
  },
  {
    "id": "lwc40",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2021型】【2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nAt a volunteer event, students cleaned a small beach. Some of them wanted to leave after filling only one bag with plastic. “There is too much trash,” one student said. “This will not change anything.” A younger student kept picking up pieces near the water because birds were trying to eat them. After an hour, the group had filled five bags, and the birds were no longer walking among the plastic. The students could not clean the whole coast, but they had made that place safer.\nThe story teaches us that (1) ______ even if (2) ______.",
    "partLimits": [
      10,
      10
    ],
    "model": "helping one place is meaningful / you cannot solve the whole problem",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) helping one place is meaningful / (2) you cannot solve the whole problem\n【全文要旨】全体を解決できなくても、一部を安全にできた。\n【空所条件】even if で限界を示し、前半で価値を述べる。\n【語数】各10語以内。\n【文法・語法】helping ... is meaningful の動名詞主語が自然。\n【過去問比較】2021型の「一つでも助ける意味」を再現。\n【別解】small actions matter など可。\n【戦略】B：限界と価値を両方書く。"
  },
  {
    "id": "lwc41",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2020型】【2020型】次の物語を読み、空所(1)には5語以内、空所(2)には15語以内の英語を入れなさい。\n\nDaiki loved taking photos with his new camera. At the zoo, he spent most of his time changing filters and checking the screen. His little sister kept pointing at the animals and asking him to watch them move, but he said he was busy making perfect photos. On the way home, he noticed that many pictures were bright and beautiful, but he could not remember what the baby elephant had done or why his sister had laughed. The next weekend, he left the camera in his bag for a while and watched with his own eyes.\nDaiki realized that (1) ______. The story teaches us that (2) ______.",
    "partLimits": [
      5,
      15
    ],
    "model": "memories matter too / recording an experience is not the same as enjoying it",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) memories matter too / (2) recording an experience is not the same as enjoying it\n【全文要旨】写真に集中しすぎ、体験そのものを楽しめなかった。\n【空所条件】(1)は気づき、(2)は教訓。\n【語数】5語以内・15語以内。\n【文法・語法】not the same as ...で対比を作れる。\n【過去問比較】2020型の経験からの学びを完成させる。\n【別解】we should enjoy the moment など可。\n【戦略】A/B：行動の結果から一般化する。"
  },
  {
    "id": "lwc42",
    "skill": "writing_completion",
    "targetId": "writing-completion",
    "type": "selfcheck",
    "strategy": "B",
    "source": "grammar_completion77_loop3",
    "prompt": "【オリジナル類題・2021型】【2021型】次の英文を読み、空所(1)(2)にそれぞれ10語以内の英語を入れなさい。\n\nA new student, Lina, spoke quietly in class, so some students thought she had no ideas. During a science project, the group could not make their model bridge stand. While others argued, Lina drew a small triangle on her notebook and suggested adding the shape under the bridge. The group tried it, and the bridge became much stronger. After the presentation, everyone asked Lina to explain her idea. They realized they had judged her too quickly.\nThe group learned that (1) ______ even if (2) ______.",
    "partLimits": [
      10,
      10
    ],
    "model": "quiet people may have good ideas / they do not speak first",
    "check": [
      "本文全体の出来事を反映している",
      "空所前後と文法的につながる",
      "語数条件を守っている",
      "過去問本文を写していない"
    ],
    "explanation": "【完成例】(1) quiet people may have good ideas / (2) they do not speak first\n【全文要旨】静かな生徒が重要な案を出し、周囲が見方を改める。\n【空所条件】even ifで表面的な印象と本質を対比する。\n【語数】各10語以内。\n【文法・語法】may have で可能性を表す。\n【過去問比較】2021型の教訓完成。\n【別解】we should listen to everyone など可。\n【戦略】A/B：人物評価の変化を読む。"
  }
];

  for (const d of newItems){
    if(d.explanation){
      if(!d.explanation.includes('【設問条件】')) d.explanation += "\n【設問条件】指定語数内で、空所前後に文法的・内容的につながる英文を書く。";
      if(!d.explanation.includes('【最小限答案例】')) d.explanation += "\n【最小限答案例】" + d.model;
      if(!d.explanation.includes('【高得点答案例】')) d.explanation += "\n【高得点答案例】" + d.model;
      if(!d.explanation.includes('【合格戦略】')) d.explanation += "\n【合格戦略】A/B：本文全体から結末または教訓を取り、短く正確に書く。";
    }
  }

  window.DRILLS.push(...newItems);
})();