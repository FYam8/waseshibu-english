(()=> {
"use strict";
const B = window.DRILLS || [];
const oldIds = ["pr01","pr02","pr03","pr04","pr05","pr06","pr07","pr08","xpr1","xpr2","xpr3","xpr4","xpr5","xpr6","xpr7","xpr8","st01","st02","st03","st04","st05","st06","xst1","xst2","xst3","xst4","xst5","xst6","xst7","xst8"];
for (const d of B) {
  if (oldIds.includes(d.id)) {
    d.retired = true;
    d.retiredReason = "sound30-loop2: duplicate/position-bias/explanation-strengthening; legacy attempts preserved.";
    d.auditStatus = "retired_sound30_loop2";
  }
}
const newItems = [
  {
    "id": "lpr01",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 ea の発音が他と異なるものを選びなさい。",
    "options": [
      "seat",
      "dead",
      "team",
      "clean"
    ],
    "answer": 1,
    "explanation": "【正解】イ dead\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】dead の ea は /e/、seat / team / clean の ea は /iː/。\n【他選択肢との差】ア seat /iː/／イ dead /e/／ウ team /iː/／エ clean /iː/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-ea",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr02",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 ou の発音が他と異なるものを選びなさい。",
    "options": [
      "young",
      "touch",
      "country",
      "group"
    ],
    "answer": 3,
    "explanation": "【正解】エ group\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】group の ou は /uː/、young / touch / country の ou は /ʌ/。\n【他選択肢との差】ア young /ʌ/／イ touch /ʌ/／ウ country /ʌ/／エ group /uː/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-ou",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr03",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】太字 g の発音が他と異なるものを選びなさい。",
    "options": [
      "gesture",
      "goat",
      "great",
      "gate"
    ],
    "answer": 0,
    "explanation": "【正解】ア gesture\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】gesture の g は /dʒ/、goat / great / gate の g は /g/。\n【他選択肢との差】ア gesture /dʒ/／イ goat /g/／ウ great /g/／エ gate /g/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-g",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr04",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 th の発音が他と異なるものを選びなさい。",
    "options": [
      "this",
      "think",
      "those",
      "there"
    ],
    "answer": 1,
    "explanation": "【正解】イ think\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】think の th は /θ/、this / those / there の th は /ð/。\n【他選択肢との差】ア this /ð/／イ think /θ/／ウ those /ð/／エ there /ð/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-th",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr05",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 oo の発音が他と異なるものを選びなさい。",
    "options": [
      "food",
      "school",
      "book",
      "room"
    ],
    "answer": 2,
    "explanation": "【正解】ウ book\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】book の oo は /ʊ/、food / school / room の oo は /uː/。\n【他選択肢との差】ア food /uː/／イ school /uː/／ウ book /ʊ/／エ room /uː/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-oo",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr06",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 a の発音が他と異なるものを選びなさい。",
    "options": [
      "make",
      "name",
      "late",
      "many"
    ],
    "answer": 3,
    "explanation": "【正解】エ many\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】many の a は /e/、make / name / late の a は /eɪ/。\n【他選択肢との差】ア make /eɪ/／イ name /eɪ/／ウ late /eɪ/／エ many /e/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-a",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr07",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 ch の発音が他と異なるものを選びなさい。",
    "options": [
      "machine",
      "chair",
      "teacher",
      "lunch"
    ],
    "answer": 0,
    "explanation": "【正解】ア machine\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】machine の ch は /ʃ/、chair / teacher / lunch の ch は /tʃ/。\n【他選択肢との差】ア machine /ʃ/／イ chair /tʃ/／ウ teacher /tʃ/／エ lunch /tʃ/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-ch",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr08",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 o の発音が他と異なるものを選びなさい。",
    "options": [
      "home",
      "hope",
      "come",
      "note"
    ],
    "answer": 2,
    "explanation": "【正解】ウ come\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】come の o は /ʌ/、home / hope / note の o は /oʊ/。\n【他選択肢との差】ア home /oʊ/／イ hope /oʊ/／ウ come /ʌ/／エ note /oʊ/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-o",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr09",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 u の発音が他と異なるものを選びなさい。",
    "options": [
      "use",
      "bus",
      "music",
      "student"
    ],
    "answer": 1,
    "explanation": "【正解】イ bus\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】bus の u は /ʌ/、use / music / student の u は /juː/。\n【他選択肢との差】ア use /juː/／イ bus /ʌ/／ウ music /juː/／エ student /juː/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-u",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr10",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 i の発音が他と異なるものを選びなさい。",
    "options": [
      "bird",
      "first",
      "girl",
      "mirror"
    ],
    "answer": 3,
    "explanation": "【正解】エ mirror\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】mirror の i は /ɪ/、bird / first / girl の ir は /ɜːr/。\n【他選択肢との差】ア bird /ɜːr/／イ first /ɜːr/／ウ girl /ɜːr/／エ mirror /ɪ/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-i",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr11",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 ea の発音が他と異なるものを選びなさい。",
    "options": [
      "bread",
      "head",
      "great",
      "weather"
    ],
    "answer": 2,
    "explanation": "【正解】ウ great\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】great の ea は /eɪ/、bread / head / weather の ea は /e/。\n【他選択肢との差】ア bread /e/／イ head /e/／ウ great /eɪ/／エ weather /e/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-ea",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr12",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】語末 -ed の発音が他と異なるものを選びなさい。",
    "options": [
      "played",
      "wanted",
      "needed",
      "visited"
    ],
    "answer": 0,
    "explanation": "【正解】ア played\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】played の -ed は /d/、wanted / needed / visited の -ed は /ɪd/。\n【他選択肢との差】ア played /d/／イ wanted /ɪd/／ウ needed /ɪd/／エ visited /ɪd/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound--ed",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr13",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 ow の発音が他と異なるものを選びなさい。",
    "options": [
      "snow",
      "cow",
      "show",
      "window"
    ],
    "answer": 1,
    "explanation": "【正解】イ cow\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】cow の ow は /aʊ/、snow / show / window の ow は /oʊ/。\n【他選択肢との差】ア snow /oʊ/／イ cow /aʊ/／ウ show /oʊ/／エ window /oʊ/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-ow",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr14",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 s の発音が他と異なるものを選びなさい。",
    "options": [
      "sit",
      "see",
      "sun",
      "sugar"
    ],
    "answer": 3,
    "explanation": "【正解】エ sugar\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】sugar の s は /ʃ/、sit / see / sun の s は /s/。\n【他選択肢との差】ア sit /s/／イ see /s/／ウ sun /s/／エ sugar /ʃ/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-s",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr15",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 c の発音が他と異なるものを選びなさい。",
    "options": [
      "city",
      "cat",
      "cup",
      "cold"
    ],
    "answer": 0,
    "explanation": "【正解】ア city\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】city の c は /s/、cat / cup / cold の c は /k/。\n【他選択肢との差】ア city /s/／イ cat /k/／ウ cup /k/／エ cold /k/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-c",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lpr16",
    "skill": "pronunciation",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】下線部 ow の発音が他と異なるものを選びなさい。",
    "options": [
      "now",
      "cow",
      "know",
      "how"
    ],
    "answer": 2,
    "explanation": "【正解】ウ know\n【設問和訳】発音が他と異なる語を1つ選ぶ。\n【発音】know の ow は /oʊ/、now / cow / how の ow は /aʊ/。\n【他選択肢との差】ア now /aʊ/／イ cow /aʊ/／ウ know /oʊ/／エ how /aʊ/\n【元弱点とのつながり】早稲渋大問3の発音問題と同じく、つづりではなく音の違いを見る。\n【戦略】A：見た目で選ばず、下線部の音だけを比較する。",
    "targetId": "pronunciation-contrast",
    "focusTag": "sound-ow",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst01",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "problem",
      "climate",
      "reduce",
      "weather"
    ],
    "answer": 2,
    "explanation": "【正解】ウ reduce\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア problem: PROB-lem／イ climate: CLI-mate／ウ reduce: re-DUCE／エ weather: WEA-ther\n【他選択肢との差】reduce は第2音節、problem / climate / weather は第1音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst02",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "continue",
      "decide",
      "passenger",
      "return"
    ],
    "answer": 2,
    "explanation": "【正解】ウ passenger\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア continue: con-TIN-ue／イ decide: de-CIDE／ウ passenger: PAS-sen-ger／エ return: re-TURN\n【他選択肢との差】passenger は第1音節、continue / decide / return は後ろの音節に第一アクセント。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst03",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "character",
      "musician",
      "delicious",
      "official"
    ],
    "answer": 0,
    "explanation": "【正解】ア character\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア character: CHAR-ac-ter／イ musician: mu-SI-cian／ウ delicious: de-LI-cious／エ official: of-FI-cial\n【他選択肢との差】character は第1音節、musician / delicious / official は第2音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst04",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "volunteer",
      "government",
      "Japanese",
      "engineer"
    ],
    "answer": 1,
    "explanation": "【正解】イ government\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア volunteer: vol-un-TEER／イ government: GOV-ern-ment／ウ Japanese: Jap-a-NESE／エ engineer: en-gi-NEER\n【他選択肢との差】government は第1音節、volunteer / Japanese / engineer は語末音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst05",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "expensive",
      "festival",
      "important",
      "computer"
    ],
    "answer": 1,
    "explanation": "【正解】イ festival\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア expensive: ex-PEN-sive／イ festival: FES-ti-val／ウ important: im-POR-tant／エ computer: com-PU-ter\n【他選択肢との差】festival は第1音節、expensive / important / computer は第2音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst06",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "hotel",
      "Japan",
      "table",
      "police"
    ],
    "answer": 2,
    "explanation": "【正解】ウ table\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア hotel: ho-TEL／イ Japan: Ja-PAN／ウ table: TA-ble／エ police: po-LICE\n【他選択肢との差】table は第1音節、hotel / Japan / police は第2音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst07",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "dangerous",
      "important",
      "expensive",
      "delicious"
    ],
    "answer": 0,
    "explanation": "【正解】ア dangerous\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア dangerous: DAN-ger-ous／イ important: im-POR-tant／ウ expensive: ex-PEN-sive／エ delicious: de-LI-cious\n【他選択肢との差】dangerous は第1音節、important / expensive / delicious は第2音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst08",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "family",
      "animal",
      "computer",
      "beautiful"
    ],
    "answer": 2,
    "explanation": "【正解】ウ computer\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア family: FAM-i-ly／イ animal: AN-i-mal／ウ computer: com-PU-ter／エ beautiful: BEAU-ti-ful\n【他選択肢との差】computer は第2音節、family / animal / beautiful は第1音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst09",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "telephone",
      "remember",
      "September",
      "together"
    ],
    "answer": 0,
    "explanation": "【正解】ア telephone\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア telephone: TEL-e-phone／イ remember: re-MEM-ber／ウ September: Sep-TEM-ber／エ together: to-GETH-er\n【他選択肢との差】telephone は第1音節、remember / September / together は第2音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst10",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "hospital",
      "idea",
      "holiday",
      "history"
    ],
    "answer": 1,
    "explanation": "【正解】イ idea\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア hospital: HOS-pi-tal／イ idea: i-DE-a／ウ holiday: HOL-i-day／エ history: HIS-to-ry\n【他選択肢との差】idea は第2音節、hospital / holiday / history は第1音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst11",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "education",
      "information",
      "conversation",
      "comfortable"
    ],
    "answer": 3,
    "explanation": "【正解】エ comfortable\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア education: ed-u-CA-tion／イ information: in-for-MA-tion／ウ conversation: con-ver-SA-tion／エ comfortable: COM-fort-a-ble\n【他選択肢との差】comfortable は第1音節、education / information / conversation は -tion の直前の音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst12",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "understand",
      "afternoon",
      "Japanese",
      "interesting"
    ],
    "answer": 3,
    "explanation": "【正解】エ interesting\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア understand: un-der-STAND／イ afternoon: af-ter-NOON／ウ Japanese: Jap-a-NESE／エ interesting: IN-ter-est-ing\n【他選択肢との差】interesting は第1音節、understand / afternoon / Japanese は後ろの音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst13",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "customer",
      "engineer",
      "volunteer",
      "employee"
    ],
    "answer": 0,
    "explanation": "【正解】ア customer\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア customer: CUS-tom-er／イ engineer: en-gi-NEER／ウ volunteer: vol-un-TEER／エ employee: em-ploy-EE\n【他選択肢との差】customer は第1音節、engineer / volunteer / employee は語末音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  },
  {
    "id": "lst14",
    "skill": "stress",
    "level": 1,
    "type": "choice",
    "prompt": "【オリジナル類題】第一アクセントの位置が他と異なるものを選びなさい。",
    "options": [
      "accident",
      "continue",
      "passenger",
      "finally"
    ],
    "answer": 1,
    "explanation": "【正解】イ continue\n【設問和訳】第一アクセントの位置が他と異なる語を1つ選ぶ。\n【強勢位置】ア accident: AC-ci-dent／イ continue: con-TIN-ue／ウ passenger: PAS-sen-ger／エ finally: FI-nal-ly\n【他選択肢との差】continue は第2音節、accident / passenger / finally は第1音節。\n【元弱点とのつながり】早稲渋大問3のアクセント問題と同じく、第一強勢の音節だけを比較する。\n【戦略】A：単語の意味ではなく、どの音節を最も強く読むかで判断する。",
    "targetId": "stress-position",
    "focusTag": "stress-contrast",
    "examFormat": "choice",
    "source": "sound30-loop2"
  }
];
for (const item of newItems) {
  if (!B.some(d => d.id === item.id)) B.push(item);
}
})();