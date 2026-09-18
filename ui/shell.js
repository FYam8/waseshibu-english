(function(root){
'use strict';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function headerMarkup(ui){
  return '<header><div><div class="eyebrow">'+esc(ui.brand.eyebrow)+'</div><h1>'+esc(ui.brand.heading)+'</h1></div><button id="dark">◐</button></header>';
}
function navMarkup(ui,active='home'){
  return '<nav>'+ui.views.map(v=>'<button data-v="'+esc(v.id)+'" class="'+(v.id===active?'active':'')+'">'+esc(v.label)+'</button>').join('')+'</nav>';
}
function footerMarkup(ui){return '<footer>'+esc(ui.footer)+'</footer>'}
const api=Object.freeze({headerMarkup,navMarkup,footerMarkup});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.ENGLISH_UI_SHELL=api;
})(typeof globalThis!=='undefined'?globalThis:this);
