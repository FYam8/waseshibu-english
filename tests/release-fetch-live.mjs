import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const base='https://fyam8.github.io/waseshibu-english/';
const index=fs.readFileSync('index.html','utf8');
const files=['index.html',...[...index.matchAll(/(?:src|href)="([^"]+)"/g)].map(x=>x[1])];
const out='_live';const hash=b=>crypto.createHash('sha256').update(b).digest('hex');const manifest={};
for(const file of files){
 const response=await fetch(base+file,{headers:{'cache-control':'no-cache'}});assert.equal(response.status,200,file);
 const bytes=Buffer.from(await response.arrayBuffer());assert.equal(hash(bytes),hash(fs.readFileSync(file)),'live bytes mismatch: '+file);
 fs.mkdirSync(path.dirname(path.join(out,file)),{recursive:true});fs.writeFileSync(path.join(out,file),bytes);manifest[file]=hash(bytes);
}
for(const file of ['tests/waseda-browser-smoke.html','tests/waseda-browser-smoke.fixture.txt','docs/g2-content-map.json','workers/writing-grader/src/index.mjs']){
 const response=await fetch(base+file);assert.equal(response.status,404,'private audit file is publicly served: '+file);
}
fs.mkdirSync('g0-g1-results',{recursive:true});fs.writeFileSync('g0-g1-results/live-manifest.json',JSON.stringify({base,commit:process.env.GITHUB_SHA,manifest,excludedPaths:'404 verified'},null,2));
console.log('Live GET: '+files.length+' files match checkout; four audit/worker paths return 404');
