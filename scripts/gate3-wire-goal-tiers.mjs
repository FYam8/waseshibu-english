import fs from 'node:fs';

const path=new URL('../app.js',import.meta.url);
let source=fs.readFileSync(path,'utf8');

const daily='const DAILY_TASK_TARGET=Number(SCHOOL_EXAM_CONFIG?.dailyTaskTarget)||10;';
const dailyWithGoals='const DAILY_TASK_TARGET=Number(SCHOOL_EXAM_CONFIG?.dailyTaskTarget)||10;\nconst GOAL_TIERS=Array.isArray(SCHOOL_EXAM_CONFIG?.goalTiers)?[...SCHOOL_EXAM_CONFIG.goalTiers]:[60,70,75];';
if(!source.includes(daily))throw new Error('daily target declaration changed unexpectedly');
if(source.includes('const GOAL_TIERS='))throw new Error('goal tiers are already wired');
source=source.replace(daily,dailyWithGoals);

const setGoalOld='function setGoal(goal){goal=Number(goal);if(![60,70,75].includes(goal))return;';
const setGoalNew='function setGoal(goal){goal=Number(goal);if(!GOAL_TIERS.includes(goal))return;';
if(!source.includes(setGoalOld))throw new Error('setGoal validation changed unexpectedly');
source=source.replace(setGoalOld,setGoalNew);

const mapToken='[60,70,75].map';
const count=source.split(mapToken).length-1;
if(count<3||count>5)throw new Error(`unexpected goal-tier map count: ${count}`);
source=source.replaceAll(mapToken,'GOAL_TIERS.map');

if(source.includes('[60,70,75].includes'))throw new Error('hard-coded goal validation remains');
if(source.includes('[60,70,75].map'))throw new Error('hard-coded goal rendering remains');
fs.writeFileSync(path,source);
console.log(`Waseda goal-tier config delegation prepared (${count} rendered maps)`);
