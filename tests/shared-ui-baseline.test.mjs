import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const plain=v=>JSON.parse(JSON.stringify(v));
function run(path,ctx={}){ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read(path),ctx,{filename:path});return ctx}
function compact(s){return String(s).replace(/\s+/g,' ').replace(/> </g,'><').trim()}

const manifest=JSON.parse(read('ui/manifest.json'));
assert.equal(manifest.name,'shared-english-ui');
assert.equal(manifest.uiVersion,'1.3.0');
assert.equal(manifest.contractVersion,1);
assert.deepEqual(manifest.artifactRoots,['ui/']);
assert.equal(manifest.runtimeWiring,true);
assert.equal(manifest.consumerPolicy,'pinned-vendor-pr-only');

const contract=run('ui/contract.js').ENGLISH_UI_CONTRACT;
const school=run('schools/waseshibu/ui.js').ENGLISH_SCHOOL_UI;
assert.equal(contract.version,1);
assert.equal(contract.validateSchoolUi(school).ok,true,contract.validateSchoolUi(school).errors.join('\n'));
assert.deepEqual([...contract.viewIds],['home','route','exam','review','drill','stats','guide']);
assert.deepEqual(plain(school.views.map(x=>x.id)),plain(contract.viewIds));

const index=read('index.html');
const expectedViews=[
  {id:'home',label:'今日やること'},
  {id:'route',label:'学習ルート'},
  {id:'exam',label:'過去問'},
  {id:'review',label:'間違い対策'},
  {id:'drill',label:'克服ドリル'},
  {id:'stats',label:'成績・到達度'},
  {id:'guide',label:'使い方'}
];
assert.deepEqual(plain(school.views),expectedViews,'Waseda nav baseline changed');
assert.equal(school.brand.eyebrow,'WASEDA SHIBUYA ENGLISH');
assert.equal(school.brand.heading,'過去問 × 弱点克服');
assert.equal(school.footer,'2019〜2026年度の実際の筆記問題をテキスト収録。英単語・リスニングは別アプリ想定。');

const shell=run('ui/shell.js').ENGLISH_UI_SHELL;
assert.equal(compact(shell.headerMarkup(school)),compact('<header><div><div class="eyebrow">WASEDA SHIBUYA ENGLISH</div><h1>過去問 × 弱点克服</h1></div><button id="dark">◐</button></header>'));
assert.equal(compact(shell.navMarkup(school,'home')),compact('<nav><button data-v="home" class="active">今日やること</button><button data-v="route">学習ルート</button><button data-v="exam">過去問</button><button data-v="review">間違い対策</button><button data-v="drill">克服ドリル</button><button data-v="stats">成績・到達度</button><button data-v="guide">使い方</button></nav>'));
assert.equal(compact(shell.footerMarkup(school)),compact('<footer>2019〜2026年度の実際の筆記問題をテキスト収録。英単語・リスニングは別アプリ想定。</footer>'));
assert.ok(index.includes('id="shared-ui-header"'));
assert.ok(index.includes('id="shared-ui-nav"'));
assert.ok(index.includes('id="shared-ui-footer"'));

const sourceCss=read('styles.css').trimStart();
const theme=read('schools/waseshibu/theme.css'),compat=read('schools/waseshibu/ui-compat.css').trim();
const sourceWithoutSchoolPolicy=sourceCss.replace(theme,'').replace(compat,'');
assert.equal(read('ui/base.css'),sourceWithoutSchoolPolicy,'shared base CSS must equal Waseda CSS minus school-owned theme/policy rules');

for(const file of ['ui/contract.js','ui/shell.js','ui/base.css']){
  assert.doesNotMatch(read(file),/waseshibu|rikkyo|早稲|立教|fyam8|workers\.dev/i,file+' leaks school/provider identity');
}
assert.doesNotMatch(read('ui/base.css'),/\.A\{|\.B\{|\.C\{/,'shared base CSS must not encode Waseda A/B/C strategy classes');
assert.ok(index.includes('href="ui/base.css"'),'Waseda candidate must load shared base CSS');
assert.ok(index.includes('href="schools/waseshibu/theme.css"'),'Waseda candidate must load school theme');
assert.ok(index.includes('href="schools/waseshibu/ui-compat.css"'),'Waseda candidate must load school policy CSS');
assert.ok(index.includes('src="ui/contract.js"'));
assert.ok(index.includes('src="schools/waseshibu/ui.js"'));
assert.ok(index.includes('src="ui/shell.js"'));
assert.ok(index.includes('ENGLISH_UI_SHELL.mount'));
assert.ok(!index.includes('href="styles.css"'),'candidate must not double-load legacy CSS');

const bad=plain(school);bad.views[0].id='exam';
assert.equal(contract.validateSchoolUi(bad).ok,false);
const badFeature=plain(school);badFeature.features.backupImport='yes';
assert.equal(contract.validateSchoolUi(badFeature).ok,false);

console.log('Shared English UI baseline characterization: CLEAN');
