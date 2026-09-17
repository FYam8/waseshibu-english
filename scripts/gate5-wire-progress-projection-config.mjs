import fs from 'node:fs';

const path=new URL('../progress-sync.js',import.meta.url);
let source=fs.readFileSync(path,'utf8');

const storageLine="const SCHOOL_STORAGE_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.storage||null;";
if(!source.includes(storageLine))throw new Error('progress-sync storage adapter declaration changed unexpectedly');
if(source.includes('const SCHOOL_EXAM_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.exam||null;'))throw new Error('progress projection config is already delegated');
source=source.replace(storageLine,`${storageLine}\nconst SCHOOL_EXAM_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.exam||null;`);

const validIso="function validIso(v){return typeof v==='string'&&Number.isFinite(Date.parse(v))&&Date.parse(v)>0?v:null}";
if(!source.includes(validIso))throw new Error('validIso boundary changed unexpectedly');
const projectionConfig=`${validIso}\nconst SYNC_YEARS=typeof SCHOOL_EXAM_CONFIG!=='undefined'&&Array.isArray(SCHOOL_EXAM_CONFIG?.years)?[...SCHOOL_EXAM_CONFIG.years]:[2019,2020,2021,2022,2023,2024,2025,2026];\nconst SYNC_GOAL_TIERS=typeof SCHOOL_EXAM_CONFIG!=='undefined'&&Array.isArray(SCHOOL_EXAM_CONFIG?.goalTiers)?[...SCHOOL_EXAM_CONFIG.goalTiers]:[60,70,75];\nconst SYNC_DEFAULT_GOAL=typeof SCHOOL_EXAM_CONFIG!=='undefined'&&Number.isFinite(Number(SCHOOL_EXAM_CONFIG?.defaultGoal))?Number(SCHOOL_EXAM_CONFIG.defaultGoal):60;\nconst SYNC_WRITTEN_MAX=typeof SCHOOL_EXAM_CONFIG!=='undefined'?Number(SCHOOL_EXAM_CONFIG?.writtenMaxScore)||80:80;\nfunction syncGoal(s){const goal=Number(s?.goal);return SYNC_GOAL_TIERS.includes(goal)?goal:SYNC_DEFAULT_GOAL}`;
source=source.replace(validIso,projectionConfig);

const drillYearOld="function drillYear(d){const m=/^(20(?:19|2[0-6])):/.exec(String(d?.key||''));return m?.[1]||null}";
const drillYearNew="function drillYear(d){const year=Number(String(d?.key||'').split(':')[0]);return SYNC_YEARS.includes(year)?String(year):null}";
if(!source.includes(drillYearOld))throw new Error('drillYear Waseda range changed unexpectedly');
source=source.replace(drillYearOld,drillYearNew);

const maxCount=source.split('maxScore:80').length-1;
if(maxCount!==2)throw new Error(`unexpected maxScore:80 count ${maxCount}`);
source=source.replaceAll('maxScore:80','maxScore:SYNC_WRITTEN_MAX');

const goalExpr='[60,70,75].includes(Number(s.goal))?Number(s.goal):60';
const goalCount=source.split(goalExpr).length-1;
if(goalCount!==2)throw new Error(`unexpected Waseda goal expression count ${goalCount}`);
source=source.replaceAll(goalExpr,'syncGoal(s)');

const yearLoop='for(let year=2019;year<=2026;year++)';
if(!source.includes(yearLoop))throw new Error('year state loop changed unexpectedly');
source=source.replace(yearLoop,'for(const year of SYNC_YEARS)');

const baselineYearOld="for(const keyName of [...Object.keys(s.answers||{}),...Object.keys(s.manual||{})]){const m=/^(20(?:19|2[0-6])):/.exec(keyName);if(m&&!years[m[1]])years[m[1]]=1}";
const baselineYearNew="for(const keyName of [...Object.keys(s.answers||{}),...Object.keys(s.manual||{})]){const year=String(keyName).split(':')[0];if(SYNC_YEARS.includes(Number(year))&&!years[year])years[year]=1}";
if(!source.includes(baselineYearOld))throw new Error('baseline answer-year mapping changed unexpectedly');
source=source.replace(baselineYearOld,baselineYearNew);

const labelOld='progressLabel:`english target ${syncGoal(s)}`';
if(!source.includes(labelOld))throw new Error('baseline progress label changed unexpectedly');
source=source.replace(labelOld,'progressLabel:`${APP_ID} target ${syncGoal(s)}`');

for(const token of ['SYNC_YEARS','SYNC_GOAL_TIERS','SYNC_DEFAULT_GOAL','SYNC_WRITTEN_MAX','syncGoal(s)','maxScore:SYNC_WRITTEN_MAX','for(const year of SYNC_YEARS)','`${APP_ID} target ${syncGoal(s)}`'])if(!source.includes(token))throw new Error(`projection delegation missing ${token}`);
fs.writeFileSync(path,source);
console.log('Waseda progress projection config delegation prepared');
