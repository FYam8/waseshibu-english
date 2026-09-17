import fs from 'node:fs';

const path=new URL('../app.js',import.meta.url);
let source=fs.readFileSync(path,'utf8');

const oldStorage='const STORAGE_KEY="waseshibu.adaptive.v3", LEGACY_KEYS=["waseshibu.adaptive.v2"], RECOVERY_PREFIX="waseshibu.adaptive.pre-migration", IMPORT_RECOVERY_PREFIX="waseshibu.adaptive.pre-import", SCHEMA_VERSION=8, DAILY_TASK_TARGET=10;';
const newStorage='const STORAGE_KEY="waseshibu.adaptive.v3", LEGACY_KEYS=["waseshibu.adaptive.v2"], RECOVERY_PREFIX="waseshibu.adaptive.pre-migration", IMPORT_RECOVERY_PREFIX="waseshibu.adaptive.pre-import", SCHEMA_VERSION=8;\nconst SCHOOL_EXAM_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.exam||null;\nconst DAILY_TASK_TARGET=Number(SCHOOL_EXAM_CONFIG?.dailyTaskTarget)||10;';
if(!source.includes(oldStorage))throw new Error('storage/daily-target declaration changed unexpectedly');
source=source.replace(oldStorage,newStorage);

const oldRoute='const ROUTE=[2024,2023,2022,2021,2020,2019,2025,2026];';
const newRoute='const ROUTE=Array.isArray(SCHOOL_EXAM_CONFIG?.route)?[...SCHOOL_EXAM_CONFIG.route]:[2024,2023,2022,2021,2020,2019,2025,2026];\nconst DEFAULT_GOAL=Number(SCHOOL_EXAM_CONFIG?.defaultGoal)||60, DEFAULT_YEAR=Number(SCHOOL_EXAM_CONFIG?.defaultYear)||2024;';
if(!source.includes(oldRoute))throw new Error('route declaration changed unexpectedly');
source=source.replace(oldRoute,newRoute);

const oldInit='const INIT={schemaVersion:SCHEMA_VERSION,goal:60,year:2024,answers:{},manual:{},history:[],attempts:[],weak:{},cause:{},drillLog:[],currentSkill:null,currentDrill:null,currentAttempt:null,lastResultId:null,lastStartedWeakKey:null,dailyPlan:null,dailyProgress:null,recoveredDrills:[],exposure:{},theme:"light",answerSheetOpen:true,answerSheetExpanded:false,examInfoCompact:false,recoveryNotice:null};';
const newInit='const INIT={schemaVersion:SCHEMA_VERSION,goal:DEFAULT_GOAL,year:DEFAULT_YEAR,answers:{},manual:{},history:[],attempts:[],weak:{},cause:{},drillLog:[],currentSkill:null,currentDrill:null,currentAttempt:null,lastResultId:null,lastStartedWeakKey:null,dailyPlan:null,dailyProgress:null,recoveredDrills:[],exposure:{},theme:"light",answerSheetOpen:true,answerSheetExpanded:false,examInfoCompact:false,recoveryNotice:null};';
if(!source.includes(oldInit))throw new Error('INIT declaration changed unexpectedly');
source=source.replace(oldInit,newInit);

for(const required of [
  'SCHOOL_EXAM_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.exam||null',
  'DAILY_TASK_TARGET=Number(SCHOOL_EXAM_CONFIG?.dailyTaskTarget)||10',
  'ROUTE=Array.isArray(SCHOOL_EXAM_CONFIG?.route)?[...SCHOOL_EXAM_CONFIG.route]:[2024,2023,2022,2021,2020,2019,2025,2026]',
  'DEFAULT_GOAL=Number(SCHOOL_EXAM_CONFIG?.defaultGoal)||60',
  'DEFAULT_YEAR=Number(SCHOOL_EXAM_CONFIG?.defaultYear)||2024',
  'goal:DEFAULT_GOAL,year:DEFAULT_YEAR'
])if(!source.includes(required))throw new Error(`runtime config delegation missing: ${required}`);

fs.writeFileSync(path,source);
console.log('Waseda low-risk runtime config delegation prepared');
