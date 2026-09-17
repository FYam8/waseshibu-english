import fs from 'node:fs';

const path=new URL('../app.js',import.meta.url);
let source=fs.readFileSync(path,'utf8');
const oldLine='const STORAGE_KEY="waseshibu.adaptive.v3", LEGACY_KEYS=["waseshibu.adaptive.v2"], RECOVERY_PREFIX="waseshibu.adaptive.pre-migration", IMPORT_RECOVERY_PREFIX="waseshibu.adaptive.pre-import", SCHEMA_VERSION=8;';
if(!source.includes(oldLine))throw new Error('Waseda storage constant declaration changed unexpectedly');
if(source.includes('const SCHOOL_STORAGE_CONFIG='))throw new Error('storage config is already delegated');
const replacement=`const SCHOOL_STORAGE_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.storage||null;\nconst STORAGE_KEY=String(SCHOOL_STORAGE_CONFIG?.key||"waseshibu.adaptive.v3"), LEGACY_KEYS=Array.isArray(SCHOOL_STORAGE_CONFIG?.legacyKeys)?[...SCHOOL_STORAGE_CONFIG.legacyKeys]:["waseshibu.adaptive.v2"], RECOVERY_PREFIX=String(SCHOOL_STORAGE_CONFIG?.recoveryPrefix||"waseshibu.adaptive.pre-migration"), IMPORT_RECOVERY_PREFIX=String(SCHOOL_STORAGE_CONFIG?.importRecoveryPrefix||"waseshibu.adaptive.pre-import"), SCHEMA_VERSION=Number(SCHOOL_STORAGE_CONFIG?.schemaVersion)||8;`;
source=source.replace(oldLine,replacement);
if(!source.includes('SCHOOL_STORAGE_CONFIG?.key'))throw new Error('storage key delegation missing');
if(!source.includes('SCHOOL_STORAGE_CONFIG?.legacyKeys'))throw new Error('legacy key delegation missing');
if(!source.includes('SCHOOL_STORAGE_CONFIG?.schemaVersion'))throw new Error('schema delegation missing');
fs.writeFileSync(path,source);
console.log('Waseda storage-config delegation prepared');
