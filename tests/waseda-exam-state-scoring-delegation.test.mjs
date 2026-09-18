import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0);
  let depth=0,inSingle=false,inDouble=false,inTemplate=false,escaped=false;
  for(let i=brace;i<source.length;i++){
    const ch=source[i];
    if(escaped){escaped=false;continue}
    if(ch==='\\'){escaped=true;continue}
    if(!inDouble&&!inTemplate&&ch==="'"){inSingle=!inSingle;continue}
    if(!inSingle&&!inTemplate&&ch==='"'){inDouble=!inDouble;continue}
    if(!inSingle&&!inDouble&&ch==='`'){inTemplate=!inTemplate;continue}
    if(inSingle||inDouble||inTemplate)continue;
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
const fns=Object.fromEntries(['interruptAttempt','attemptComparable','objectiveScore','createWeak','markActualCorrect'].map(n=>[n,functionSource(app,n)]));

for(const [name,helper] of [
  ['interruptAttempt','interruptExamAttempt'],
  ['attemptComparable','isExamAttemptComparable'],
  ['objectiveScore','scoreObjectiveQuestion'],
  ['createWeak','buildWrongWeaknessState'],
  ['markActualCorrect','markWeaknessesActuallyCorrect']
]){
  assert.match(fns[name],new RegExp(`ENGLISH_ENGINE_CORE\\?\\.${helper}`),`${name} must delegate to ${helper}`);
  assert.match(fns[name],/typeof window!=="undefined"/,`${name} must preserve non-browser fallback`);
}

// Attempt interruption keeps app-owned side effects and delegates only the state mutation.
{
  const calls={shared:0,save:0,render:0,alerts:[]};
  const attempt={id:'a',mode:'timed',interrupted:false};
  const ctx={
    S:{currentAttempt:attempt},
    ENGLISH_ENGINE_CORE:{interruptExamAttempt(a){calls.shared++;a.interrupted=true;a.mode='untimed';return a}},
    save(){calls.save++},render(){calls.render++},alert(m){calls.alerts.push(m)}
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${fns.interruptAttempt}\nglobalThis.f=interruptAttempt;`,ctx);
  ctx.f();
  assert.equal(calls.shared,1);assert.equal(attempt.interrupted,true);assert.equal(attempt.mode,'untimed');
  assert.equal(calls.save,1);assert.equal(calls.render,1);assert.equal(calls.alerts.length,1);
}

// Comparability delegates the deterministic predicate.
{
  const calls=[];
  const ctx={ENGLISH_ENGINE_CORE:{isExamAttemptComparable(a){calls.push(a);return a?.custom===1}}};
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${fns.attemptComparable}\nglobalThis.f=attemptComparable;`,ctx);
  const a={custom:1};assert.equal(ctx.f(a),true);assert.equal(calls[0],a);
}

// Objective scoring passes Waseda normalization/match callbacks into the generic helper.
{
  const calls=[];
  const norm=s=>String(s||'').trim().toLowerCase();
  const matches=(q,a)=>norm(a)===norm(q.answer);
  const ctx={norm,matches,ENGLISH_ENGINE_CORE:{scoreObjectiveQuestion(q,a,opts){calls.push({q,a,opts});return 2.5}}};
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${fns.objectiveScore}\nglobalThis.f=objectiveScore;`,ctx);
  const q={type:'multi',answer:'a,b',points:5};
  assert.equal(ctx.f(q,'A'),2.5);
  assert.equal(calls.length,1);assert.equal(calls[0].q,q);assert.equal(calls[0].a,'A');
  assert.equal(calls[0].opts.normalize,norm);assert.equal(calls[0].opts.matchAnswer,matches);
}

// Weakness creation keeps Waseda metadata mapping/policy outside the engine.
{
  const calls=[];
  const old={wrongCount:2,seenDrills:['d1'],extra:'keep'};
  const q={id:'q1',label:'Q',category:'英作文',skill:'summary',targetId:'t',focusTag:'f',examFormat:'manual',trap:'x',points:10};
  const ctx={
    S:{weak:{'2025:q1:grammar':old}},
    k:(y,id)=>`${y}:${id}`,
    strategyPriority:()=> 'B',
    today:()=> '2026-09-18',
    ENGLISH_ENGINE_CORE:{buildWrongWeaknessState(previous,args){calls.push({previous,args});return {...previous,...args,last:'wrong',status:'active',streak:0,confirmStreak:0,next:args.today,wrongCount:(previous.wrongCount||0)+1,reservedConfirm:[],seenDrills:previous.seenDrills||[]}}}
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${fns.createWeak}\nglobalThis.f=createWeak;`,ctx);
  ctx.f(2025,q,'自己採点 6/10','grammar',['grammar','logic']);
  assert.equal(calls.length,1);assert.equal(calls[0].previous,old);
  assert.deepEqual(plain(calls[0].args),{
    year:2025,id:'q1',label:'Q',category:'英作文：grammar',component:'grammar',skill:'summary',targetId:'t',
    focusTag:'manual:summary:grammar',examFormat:'manual',trap:'grammar',priority:'B',points:10,user:'自己採点 6/10',
    today:'2026-09-18',manualComponents:['grammar','logic']
  });
  assert.equal(ctx.S.weak['2025:q1:grammar'].status,'active');
}

// Actual-correct updates delegate the collection mutation.
{
  const calls=[];
  const rows={a:{year:2024,id:'q',actualCorrect:0},b:{year:2023,id:'q',actualCorrect:4}};
  const ctx={
    S:{weak:rows},
    ENGLISH_ENGINE_CORE:{markWeaknessesActuallyCorrect(values,args){calls.push({values,args});for(const w of values)if(w.year===Number(args.year)&&w.id===args.id){w.user=args.user;w.last='correct';w.actualCorrect=(w.actualCorrect||0)+1}return values}}
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${fns.markActualCorrect}\nglobalThis.f=markActualCorrect;`,ctx);
  ctx.f(2024,{id:'q'},'ア');
  assert.equal(calls.length,1);assert.deepEqual(plain(calls[0].args),{year:2024,id:'q',user:'ア'});
  assert.equal(rows.a.user,'ア');assert.equal(rows.a.last,'correct');assert.equal(rows.a.actualCorrect,1);
  assert.equal(rows.b.actualCorrect,4);
}

console.log('Waseda exam scoring/weakness runtime delegation: CLEAN');
