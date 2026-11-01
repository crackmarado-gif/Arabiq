const { chromium } = require('playwright');const path=require('path');
(async()=>{const [html,...ts]=process.argv.slice(2);const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+path.resolve(html));await pg.evaluate(()=>document.fonts.ready);
for(const t of ts){await pg.evaluate(t=>window.render(t),+t);await pg.screenshot({path:`chk/s_${t}.png`});}
console.log(errs.join('\n')||'no errors');await b.close()})();
