(function(root){
'use strict';
const core=root.ENGLISH_ENGINE_CORE;
if(!core)throw new Error('Shared English engine core must load before Waseda compatibility bridge');

// Gate 2, first runtime delegation. Keep the surface deliberately tiny.
// These functions are pure and have characterization/parity coverage.
const delegated=['wordCount','familyCount'];
for(const name of delegated){
  if(typeof core[name]!=='function')throw new Error(`Shared English engine core is missing ${name}`);
  root[name]=core[name];
}

root.ENGLISH_ENGINE_COMPAT=Object.freeze({
  stage:'gate2-pure-helper-delegation-1',
  delegated:Object.freeze([...delegated])
});
})(typeof globalThis!=='undefined'?globalThis:this);
