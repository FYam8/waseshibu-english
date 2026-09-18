import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function run(path,ctx={}){ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read(path),ctx,{filename:path});return ctx}
function plain(v){return JSON.parse(JSON.stringify(v))}

const contract=run('engine/contract.js').ENGLISH_ENGINE_CONTRACT;
const waseda=run('schools/waseshibu/config.js').ENGLISH_SCHOOL_CONFIG;
assert.equal(contract.validateSchoolConfig(waseda).ok,true,'legacy Waseda config must remain valid without new fields');

const rikkyo={
  contractVersion:1,
  schoolId:'rikkyo-uk',
  brand:{title:'Rikkyo UK English'},
  exam:{
    identityMode:'examId',
    years:[2024,2025,2026],
    examIds:['FY24A','FY24B','FY25A','FY25B','FY26A','FY26B'],
    route:['FY26A','FY24A','FY24B','FY25A','FY25B','FY26B'],
    defaultExamId:'FY26A',
    goalMode:'stage',
    goalTiers:[1],
    defaultGoal:1,
    scoring:{enabled:false},
    dailyTaskTarget:10
  },
  storage:{
    key:'rikkyo.uk.english.v1',
    legacyKeys:[],
    recoveryPrefix:'rikkyo.uk.english.pre-migration',
    importRecoveryPrefix:'rikkyo.uk.english.pre-import',
    schemaVersion:1,
    syncDb:'rikkyo-uk-english-progress-sync',
    syncDbVersion:1
  },
  progress:{enabled:false,endpoint:'',appId:'rikkyo-english'},
  aiWriting:{enabled:false,endpoint:'',skills:[]}
};
const result=contract.validateSchoolConfig(rikkyo);
assert.equal(result.ok,true,result.errors.join('\n'));

for(const mutate of [
  x=>{x.exam.identityMode='bad'},
  x=>{x.exam.examIds=[]},
  x=>{x.exam.examIds=['FY24A','FY24A']},
  x=>{x.exam.examIds=['FY24A',42]},
  x=>{x.exam.defaultExamId='UNKNOWN'},
  x=>{x.exam.route=['FY26A','UNKNOWN']},
  x=>{x.exam.scoring.enabled='no'},
  x=>{x.exam.goalMode='score'},
  x=>{x.exam.goalMode='bad'}
]){
  const invalid=plain(rikkyo);mutate(invalid);
  assert.equal(contract.validateSchoolConfig(invalid).ok,false,JSON.stringify(invalid.exam));
}

{
  const scored=plain(rikkyo);
  scored.exam.scoring={enabled:true};
  scored.exam.goalMode='score';
  scored.exam.goalTiers=[60,70,75];
  scored.exam.defaultGoal=60;
  assert.equal(contract.validateSchoolConfig(scored).ok,false,'scored consumer must still declare score maxima');
  Object.assign(scored.exam,{writtenMaxScore:80,listeningMaxScore:20,totalMaxScore:100});
  assert.equal(contract.validateSchoolConfig(scored).ok,true,contract.validateSchoolConfig(scored).errors.join('\n'));
}

{
  const legacyBad=plain(waseda);
  legacyBad.exam.route=[2024,9999];
  assert.equal(contract.validateSchoolConfig(legacyBad).ok,false,'legacy year-route validation must remain');
}

console.log('Shared English consumer contract v1.1: CLEAN');
