import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
export function validatePublication(index, tombstone, config, fixture, runner){
  assert.ok(!index.includes('\\n'),'literal backslash-n in production HTML');
  assert.doesNotMatch(tombstone,/<script\b|\son\w+\s*=|<iframe\b|http-equiv/i,'retired test URL must be inert');
  assert.doesNotMatch(fixture,/localStorage\.clear\s*\(/,'test must not clear all storage');
  for(const dir of ['tests','docs','workers'])assert.match(config,new RegExp('^  - '+dir+'$','m'),'Pages must exclude '+dir);
  assert.ok(runner.includes('cd "$SITE"'),'legacy characterization must use a disposable staged site');
  assert.ok(runner.includes('--user-data-dir="$PROFILE"'),'legacy characterization must use a fresh profile');
  assert.ok(runner.includes('--bind 127.0.0.1'),'legacy characterization must bind loopback');
  const excluded=config.split('\n').filter(x=>x.startsWith('  - ')).map(x=>x.slice(4));
  const assets=[...index.matchAll(/(?:src|href)="([^"]+)"/g)].map(x=>x[1]);
  for(const asset of assets){
    assert.ok(fs.existsSync(path.join(root,asset)),'missing runtime asset '+asset);
    assert.ok(!excluded.some(x=>asset===x||asset.startsWith(x+'/')),'runtime asset excluded '+asset);
  }
}
const args=[read('index.html'),read('tests/waseda-browser-smoke.html'),read('_config.yml'),read('tests/waseda-browser-smoke.fixture.txt'),read('tests/waseda-browser-smoke.sh')];
validatePublication(...args);
// Fault injection proves these guards reject the original classes of failure.
for(const [label,index,value] of [
  ['literal newline',0,args[0]+'\\n'],
  ['active old URL',1,'<script>localStorage.clear()</script>'],
  ['published tests',2,args[2].replace('  - tests\n','')],
  ['destructive fixture',3,args[3]+'localStorage.clear()'],
  ['shared working tree server',4,args[4].replace('cd "$SITE"','cd "$ROOT"')]
]){
  const broken=[...args];broken[index]=value;
  assert.throws(()=>validatePublication(...broken),undefined,label+' must fail');
}
console.log('G0 publication static guards PASS; five injected faults rejected (not a Jekyll build).');
