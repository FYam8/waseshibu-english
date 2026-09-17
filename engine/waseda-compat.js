(function(root){
'use strict';
const core=root.ENGLISH_ENGINE_CORE;
if(!core)throw new Error('Shared English engine core must load before Waseda compatibility bridge');

// Gate 2, second small runtime delegation. Keep this list limited to pure helpers
// with direct old-vs-engine parity tests and real-browser characterization.
const delegated=['wordCount','familyCount','localDate','plusDays'];
for(const name of delegated){
  if(typeof core[name]!=='function')throw new Error(`Shared English engine core is missing ${name}`);
  root[name]=core[name];
}

root.ENGLISH_ENGINE_COMPAT=Object.freeze({
  stage:'gate2-pure-helper-delegation-2',
  delegated:Object.freeze([...delegated])
});
})(typeof globalThis!=='undefined'?globalThis:this);
