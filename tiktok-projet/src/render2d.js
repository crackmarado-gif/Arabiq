const { chromium } = require('playwright');const path=require('path');const fs=require('fs');
(async()=>{const [html,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
await pg.goto('file://'+path.resolve(html));await pg.evaluate(()=>document.fonts.ready);
const N=Math.round(await pg.evaluate(()=>window.DURATION)*30);
for(let i=0;i<N;i++){await pg.evaluate(t=>window.render(t),i/30);await pg.screenshot({path:`${out}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:94})}
await b.close();console.log('frames',N)})();
