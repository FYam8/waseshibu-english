(()=> {
"use strict";
const B = window.DRILLS || [];

// Sound30 loop3: keep the sound-set active count at 30 while moving past-paper-too-close items out.
const retireIds = ["lst01","lst14","lpr03"];
for (const d of B) {
  if (retireIds.includes(d.id) && !d.retired) {
    d.retired = true;
    d.retiredReason = "sound30-loop3: past-paper comparison found the item too close to 2024/2025 original sets; legacy attempts preserved.";
    d.auditStatus = "retired_sound30_loop3_pastpaper_distance";
  }
}

const newItems = [
  {
    "id": "lpr17",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】太字 g の発音が他と異なるものを選びなさい。",
    "options": [
      "giant",
      "garden",
      "gold",
      "gum"
    ],
    "answer": 0,
    "explanation": "【正解】ア giant\n【設問和訳】太字 g の発音が他と異なる語を1つ選ぶ。\n【発音】giant の g は /dʒ/、garden / gold / gum の g は /g/。\n【他選択肢との差】ア giant /dʒ/／イ garden /g/／ウ gold /g/／エ gum /g/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、同じ文字でも音が変わる場合を見分ける。\n【過去問比較】2025年度の g 発音問題と同じ中心技能だが、gesture / globally / greet / gate の語セットは使っていない。\n【戦略】A：つづりの g だけを見ず、後ろの母音や単語ごとの発音を確認する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-g-hard-soft",
    "examFormat": "choice",
    "source": "sound30-loop3"
  },
  {
    "id": "lst15",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "teacher",
      "window",
      "arrive",
      "market"
    ],
    "answer": 2,
    "explanation": "【正解】ウ arrive\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア teacher: TEA-cher／イ window: WIN-dow／ウ arrive: ar-RIVE／エ market: MAR-ket\n【他選択肢との差】arrive は第2音節、teacher / window / market は第1音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【過去問比較】2025年度の problem / reduce / climate / weather とは語セットを重ねず、第1音節3語＋第2音節1語の処理だけを再現している。\n【戦略】A：意味ではなく、最も強く読む音節の位置を比べる。",
    "targetId": "stress-position",
    "focusTag": "stress-first-vs-second",
    "examFormat": "choice",
    "source": "sound30-loop3"
  },
  {
    "id": "lst16",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "family",
      "believe",
      "animal",
      "holiday"
    ],
    "answer": 1,
    "explanation": "【正解】イ believe\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア family: FAM-i-ly／イ believe: be-LIEVE／ウ animal: AN-i-mal／エ holiday: HOL-i-day\n【他選択肢との差】believe は第2音節、family / animal / holiday は第1音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【過去問比較】2024年度の continue / passenger / accident / finally とは語セットを重ねず、第1音節3語＋第2音節1語の処理だけを再現している。\n【戦略】A：長い語ほど見た目で判断せず、音節ごとに強く読む位置を確認する。",
    "targetId": "stress-position",
    "focusTag": "stress-first-vs-second",
    "examFormat": "choice",
    "source": "sound30-loop3"
  }
];

for (const item of newItems) {
  if (!B.some(d => d.id === item.id)) B.push(item);
}
})();
