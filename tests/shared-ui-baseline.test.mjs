import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const plain=v=>JSON.parse(JSON.stringify(v));
function run(path,ctx={}){ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read(path),ctx,{filename:path});return ctx}
function compact(s){return String(s).replace(/\s+/g,' ').replace(/> </g,'><').trim()}

const manifest=JSON.parse(read('ui/manifest.json'));
assert.equal(manifest.name,'shared-english-ui');
assert.equal(manifest.uiVersion,'0.1.0-alpha.1');
assert.equal(manifest.contractVersion,1);
assert.deepEqual(manifest.artifactRoots,['ui/']);
assert.equal(manifest.runtimeWiring,false);
assert.equal(manifest.consumerPolicy,'pinned-vendor-pr-only');

const contract=run('ui/contract.js').ENGLISH_UI_CONTRACT;
const school=run('schools/waseshibu/ui.js').ENGLISH_SCHOOL_UI;
assert.equal(contract.version,1);
assert.equal(contract.validateSchoolUi(school).ok,true,contract.validateSchoolUi(school).errors.join('\n'));
assert.deepEqual([...contract.viewIds],['home','route','exam','review','drill','stats','guide']);
assert.deepEqual(plain(school.views.map(x=>x.id)),plain(contract.viewIds));

const index=read('index.html');
const labels=[...index.matchAll(/<button data-v="([^"]+)"(?: class="active")?>([^<]+)<\/button>/g)].map(m=>({id:m[1],label:m[2]}));
assert.deepEqual(labels,plain(school.views),'Waseda nav baseline changed');
assert.ok(index.includes('<div class="eyebrow">'+school.brand.eyebrow+'</div><h1>'+school.brand.heading+'</h1>'));
assert.ok(index.includes('<footer>'+school.footer+'</footer>'));

const shell=run('ui/shell.js').ENGLISH_UI_SHELL;
const shellHeader=compact(shell.headerMarkup(school));
const currentHeader=compact(index.match(/<header>[\s\S]*?<\/header>/)[0]);
assert.equal(shellHeader,currentHeader,'shared header helper must reproduce current Waseda header');
const shellNav=compact(shell.navMarkup(school,'home'));
const currentNav=compact(index.match(/<nav>[\s\S]*?<\/nav>/)[0]);
assert.equal(shellNav,currentNav,'shared nav helper must reproduce current Waseda nav');
assert.equal(compact(shell.footerMarkup(school)),compact(index.match(/<footer>[\s\S]*?<\/footer>/)[0]));

const sourceCss=read('styles.css').trimStart();
const theme=read('schools/waseshibu/theme.css'),compat=read('schools/waseshibu/ui-compat.css').trim();
const sourceWithoutSchoolPolicy=sourceCss.replace(theme,'').replace(compat,'');
assert.equal(read('ui/base.css'),sourceWithoutSchoolPolicy,'shared base CSS must equal Waseda CSS minus school-owned theme/policy rules');

for(const file of ['ui/contract.js','ui/shell.js','ui/base.css']){
  assert.doesNotMatch(read(file),/waseshibu|rikkyo|早稲|立教|fyam8|workers\.dev/i,file+' leaks school/provider identity');
}
assert.doesNotMatch(read('ui/base.css'),/\.A\{|\.B\{|\.C\{/,'shared base CSS must not encode Waseda A/B/C strategy classes');
assert.ok(!index.includes('ui/base.css'),'UI0 must not change production loading yet');
assert.ok(!index.includes('ui/shell.js'),'UI0 must not change production loading yet');

const bad=plain(school);bad.views[0].id='exam';
assert.equal(contract.validateSchoolUi(bad).ok,false);
const badFeature=plain(school);badFeature.features.backupImport='yes';
assert.equal(contract.validateSchoolUi(badFeature).ok,false);

console.log('Shared English UI baseline characterization: CLEAN');
