import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0,`missing body for ${name}`);
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
const normSrc=functionSource(app,'norm');
const matchesSrc=functionSource(app,'matches');
const scoreSrc=functionSource(app,'objectiveScore');
const comparableSrc=functionSource(app,'attemptComparable');
const interruptSrc=functionSource(app,'interruptAttempt');
const weakSrc=functionSource(app,'createWeak');
const correctSrc=functionSource(app,'markActualCorrect');

// Attempt comparability is a strict conjunction.
{
  const ctx={};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${comparableSrc}\nglobalThis.f=attemptComparable;`,ctx);
  const cases=[
    [{exposure:'first',mode:'timed',interrupted:false,overtime:false},true],
    [{exposure:'partial',mode:'timed',interrupted:false,overtime:false},false],
    [{exposure:'first',mode:'untimed',interrupted:false,overtime:false},false],
    [{exposure:'first',mode:'timed',interrupted:true,overtime:false},false],
    [{exposure:'first',mode:'timed',interrupted:false,overtime:true},false],
    [null,false]
  ];
  for(const [attempt,expected] of cases)assert.equal(ctx.f(attempt),expected,JSON.stringify(attempt));
}

// Interrupting preserves the attempt object/identity but makes it untimed/non-comparable.
{
  const attempt={id:'a1',year:2024,status:'active',mode:'timed',interrupted:false,custom:'keep'};
  const calls={save:0,render:0,alerts:[]};
  const ctx={S:{currentAttempt:attempt},save(){calls.save++},render(){calls.render++},alert(m){calls.alerts.push(m)}};
  ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(`${interruptSrc}\nglobalThis.f=interruptAttempt;`,ctx);
  ctx.f();
  assert.equal(ctx.S.currentAttempt,attempt);assert.equal(attempt.id,'a1');assert.equal(attempt.custom,'keep');
  assert.equal(attempt.interrupted,true);assert.equal(attempt.mode,'untimed');
  assert.equal(calls.save,1);assert.equal(calls.render,1);assert.equal(calls.alerts.length,1);assert.match(calls.alerts[0],/本番比較/);
}

// Freeze Waseda normalization/matching, including the current data-specific peanut(s) alias.
{
  const ctx={};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${normSrc}\n${matchesSrc}\n${scoreSrc}\nglobalThis.api={norm,matches,objectiveScore};`,ctx);
  assert.equal(ctx.api.norm(' A B ， C '),'ab,c');
  assert.equal(ctx.api.matches({type:'text',answer:'PEANUT(S)'},'peanut'),true);
  assert.equal(ctx.api.matches({type:'text',answer:'peanut(s)'},'PEANUTS'),true);
  assert.equal(ctx.api.matches({type:'text',answer:'peanut(s)'},'peanut(s)'),false);
  assert.equal(ctx.api.matches({type:'text',answer:'New York'},' new   york '),true);
  assert.equal(ctx.api.matches({type:'choice',answer:'ア'},' ア '),true);
  assert.equal(ctx.api.matches({type:'multi',answer:'ア,ウ'},'ウ， ア'),true);
  assert.equal(ctx.api.matches({type:'multi',answer:'ア,ウ'},'ア,イ'),false);

  assert.equal(ctx.api.objectiveScore({type:'choice',answer:'ア',points:5},'ア'),5);
  assert.equal(ctx.api.objectiveScore({type:'choice',answer:'ア',points:5},'イ'),0);
  assert.equal(ctx.api.objectiveScore({type:'text',answer:'peanut(s)',points:4},'peanuts'),4);
  assert.equal(ctx.api.objectiveScore({type:'multi',answer:'ア,ウ',points:6},'ア,ウ'),6);
  assert.equal(ctx.api.objectiveScore({type:'multi',answer:'ア,ウ',points:6},'ア,イ'),3);
  assert.equal(ctx.api.objectiveScore({type:'multi',answer:'ア,ウ',points:6},'イ,エ'),0);
  // objectiveScore itself does not penalize extra wrong choices; grade() separately checks selection count.
  assert.equal(ctx.api.objectiveScore({type:'multi',answer:'ア,ウ',points:6},'ア,ウ,エ'),6);
}

// Wrong-answer weakness recreation resets mastery progress but preserves seen drill history.
{
  const old={status:'mastered',streak:3,confirmStreak:2,wrongCount:2,reservedConfirm:['r1'],seenDrills:['d1'],manualComponents:['old'],extra:'preserve'};
  const question={id:'q1',label:'大問1 問1',category:'文脈',skill:'reason',targetId:'reason-evidence',focusTag:'cause',examFormat:'choice',trap:'根拠',points:5};
  const ctx={
    S:{weak:{'2024:q1:main':plain(old)}},
    k:(y,id)=>`${y}:${id}`,
    strategyPriority:()=> 'A',
    today:()=> '2026-09-18'
  };
  ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(`${weakSrc}\nglobalThis.f=createWeak;`,ctx);
  ctx.f(2024,question,'イ','main',[]);
  assert.deepEqual(plain(ctx.S.weak['2024:q1:main']),{
    status:'active',streak:0,confirmStreak:0,wrongCount:3,reservedConfirm:[],seenDrills:['d1'],manualComponents:['old'],extra:'preserve',
    year:2024,id:'q1',label:'大問1 問1',category:'文脈',component:'main',skill:'reason',targetId:'reason-evidence',
    focusTag:'cause',examFormat:'choice',trap:'根拠',priority:'A',points:5,user:'イ',last:'wrong',next:'2026-09-18'
  });
}
{
  const question={id:'q2',label:'記述',category:'英作文',skill:'summary',targetId:'summary-main',focusTag:'summary',examFormat:'manual',trap:'summary',points:10};
  const ctx={S:{weak:{}},k:(y,id)=>`${y}:${id}`,strategyPriority:()=> 'B',today:()=> '2026-09-18'};
  ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(`${weakSrc}\nglobalThis.f=createWeak;`,ctx);
  ctx.f(2025,question,'自己採点 6/10','logic',['logic','grammar','logic']);
  assert.deepEqual(plain(ctx.S.weak['2025:q2:logic']),{
    year:2025,id:'q2',label:'記述',category:'英作文：logic',component:'logic',skill:'summary',targetId:'summary-main',
    focusTag:'manual:summary:logic',examFormat:'manual',trap:'logic',priority:'B',points:10,user:'自己採点 6/10',
    last:'wrong',status:'active',streak:0,confirmStreak:0,next:'2026-09-18',wrongCount:1,reservedConfirm:[],seenDrills:[],manualComponents:['logic','grammar']
  });
}

// A later correct actual answer updates every component of that source question without deleting weakness history.
{
  const ctx={S:{weak:{
    a:{year:2024,id:'q1',component:'main',status:'active',actualCorrect:1,user:'old',last:'wrong'},
    b:{year:2024,id:'q1',component:'grammar',status:'pending',actualCorrect:0,user:'old2',last:'wrong'},
    c:{year:2023,id:'q1',status:'active',actualCorrect:7},
    d:{year:2024,id:'q2',status:'active',actualCorrect:9}
  }}};
  ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(`${correctSrc}\nglobalThis.f=markActualCorrect;`,ctx);
  ctx.f(2024,{id:'q1'},'ア');
  assert.equal(ctx.S.weak.a.user,'ア');assert.equal(ctx.S.weak.a.last,'correct');assert.equal(ctx.S.weak.a.actualCorrect,2);assert.equal(ctx.S.weak.a.status,'active');
  assert.equal(ctx.S.weak.b.user,'ア');assert.equal(ctx.S.weak.b.last,'correct');assert.equal(ctx.S.weak.b.actualCorrect,1);assert.equal(ctx.S.weak.b.status,'pending');
  assert.equal(ctx.S.weak.c.actualCorrect,7);assert.equal(ctx.S.weak.d.actualCorrect,9);
}

console.log('Waseda exam attempt/scoring/weakness characterization: CLEAN');
