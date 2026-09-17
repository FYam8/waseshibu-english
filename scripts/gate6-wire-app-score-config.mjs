import fs from 'node:fs';

const path=new URL('../app.js',import.meta.url);
let source=fs.readFileSync(path,'utf8');

function replaceExact(oldValue,newValue,expected=1){
  const count=source.split(oldValue).length-1;
  if(count!==expected)throw new Error(`unexpected count ${count} for ${oldValue.slice(0,80)}`);
  source=source.split(oldValue).join(newValue);
}

const goalLine='const GOAL_TIERS=Array.isArray(SCHOOL_EXAM_CONFIG?.goalTiers)?[...SCHOOL_EXAM_CONFIG.goalTiers]:[60,70,75];';
if(!source.includes(goalLine))throw new Error('goal-tier declaration changed unexpectedly');
if(source.includes('const WRITTEN_MAX_SCORE='))throw new Error('app score model is already config-backed');
source=source.replace(goalLine,`${goalLine}\nconst WRITTEN_MAX_SCORE=Number(SCHOOL_EXAM_CONFIG?.writtenMaxScore)||80;\nconst LISTENING_MAX_SCORE=Number.isFinite(Number(SCHOOL_EXAM_CONFIG?.listeningMaxScore))&&Number(SCHOOL_EXAM_CONFIG.listeningMaxScore)>=0?Number(SCHOOL_EXAM_CONFIG.listeningMaxScore):20;\nconst TOTAL_MAX_SCORE=Number(SCHOOL_EXAM_CONFIG?.totalMaxScore)||WRITTEN_MAX_SCORE+LISTENING_MAX_SCORE;`);

replaceExact('written>80','written>WRITTEN_MAX_SCORE');
replaceExact('Number(listening)>20','Number(listening)>LISTENING_MAX_SCORE');
replaceExact('Math.min(20,Number(value)||0)','Math.min(LISTENING_MAX_SCORE,Number(value)||0)');
replaceExact('if(need<=20)','if(need<=LISTENING_MAX_SCORE)');
replaceExact('`リスニング${need}/20以上が必要`','`リスニング${need}/${LISTENING_MAX_SCORE}以上が必要`');
replaceExact('`${total}/100`','`${total}/${TOTAL_MAX_SCORE}`',2);
replaceExact('`${last.score}/80`','`${last.score}/${WRITTEN_MAX_SCORE}`',2);
replaceExact('`${last.writtenScore}/80`','`${last.writtenScore}/${WRITTEN_MAX_SCORE}`');
replaceExact('`${a.writtenScore}/80`','`${a.writtenScore}/${WRITTEN_MAX_SCORE}`');
replaceExact('`${x.writtenScore}/80`','`${x.writtenScore}/${WRITTEN_MAX_SCORE}`');
replaceExact('`${x.totalScore}/100`','`${x.totalScore}/${TOTAL_MAX_SCORE}`');
replaceExact('筆記80点','筆記${WRITTEN_MAX_SCORE}点');
replaceExact('max=20 value="${a.listeningScore??""}"','max=${LISTENING_MAX_SCORE} value="${a.listeningScore??""}"');
replaceExact('> /20</label>','> /${LISTENING_MAX_SCORE}</label>');

for(const token of ['WRITTEN_MAX_SCORE','LISTENING_MAX_SCORE','TOTAL_MAX_SCORE','written>WRITTEN_MAX_SCORE','Number(listening)>LISTENING_MAX_SCORE','Math.min(LISTENING_MAX_SCORE','/${TOTAL_MAX_SCORE}','/${WRITTEN_MAX_SCORE}','max=${LISTENING_MAX_SCORE}'])if(!source.includes(token))throw new Error(`missing app score delegation token ${token}`);
fs.writeFileSync(path,source);
console.log('Waseda app score-model config delegation prepared');
