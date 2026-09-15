(function(root){
'use strict';
const CONTRACT_VERSION=1;
const REQUIRED_TOP_LEVEL=['contractVersion','schoolId','brand','exam','storage','progress'];
function nonEmpty(value){return typeof value==='string'&&value.trim().length>0}
function validate(config){
  const errors=[];
  if(!config||typeof config!=='object')return{ok:false,errors:['config must be an object']};
  for(const key of REQUIRED_TOP_LEVEL)if(!(key in config))errors.push(`missing ${key}`);
  if(Number(config.contractVersion)!==CONTRACT_VERSION)errors.push(`contractVersion must be ${CONTRACT_VERSION}`);
  if(!nonEmpty(config.schoolId))errors.push('schoolId must be a non-empty string');
  if(!nonEmpty(config.brand?.title))errors.push('brand.title is required');
  if(!Array.isArray(config.exam?.years)||!config.exam.years.length)errors.push('exam.years must be a non-empty array');
  if(!Array.isArray(config.exam?.route)||!config.exam.route.length)errors.push('exam.route must be a non-empty array');
  if(!Array.isArray(config.exam?.goalTiers)||!config.exam.goalTiers.length)errors.push('exam.goalTiers must be a non-empty array');
  if(!config.exam?.goalTiers?.includes(config.exam?.defaultGoal))errors.push('exam.defaultGoal must exist in exam.goalTiers');
  if(!config.exam?.years?.includes(config.exam?.defaultYear))errors.push('exam.defaultYear must exist in exam.years');
  if(!nonEmpty(config.storage?.key))errors.push('storage.key is required');
  if(!nonEmpty(config.storage?.syncDb))errors.push('storage.syncDb is required');
  if(!Number.isInteger(Number(config.storage?.schemaVersion))||Number(config.storage.schemaVersion)<1)errors.push('storage.schemaVersion must be a positive integer');
  if(config.progress?.enabled){
    if(!nonEmpty(config.progress.endpoint))errors.push('progress.endpoint is required when progress is enabled');
    if(!nonEmpty(config.progress.appId))errors.push('progress.appId is required when progress is enabled');
  }
  return{ok:errors.length===0,errors};
}
const api=Object.freeze({version:CONTRACT_VERSION,validateSchoolConfig:validate});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.ENGLISH_ENGINE_CONTRACT=api;
})(typeof globalThis!=='undefined'?globalThis:this);
