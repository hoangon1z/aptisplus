import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.E2E_BASE_URL||'http://localhost:3000';
await fs.mkdir('artifacts/motion-v3/hero',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:'artifacts/motion-v3/raw',size:{width:1440,height:900}}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base,{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>document.querySelector('[data-motion-hero]')?.getAttribute('data-motion-state')==='playing');
const started=Date.now();const samples=[];
for(const t of [200,700,1500,3000]){
 await page.waitForTimeout(Math.max(0,t-(Date.now()-started)));
 samples.push({timeMs:Date.now()-started,targets:await page.locator('[data-logo-body],[data-logo-ribbon],[data-logo-plus],.hero-line,[data-exam-frame],[data-wave-bar]').evaluateAll(nodes=>nodes.map(n=>({target:n.getAttributeNames().find(k=>k.startsWith('data-'))||n.className,transform:getComputedStyle(n).transform,opacity:getComputedStyle(n).opacity,clipPath:getComputedStyle(n).clipPath})))});
 await page.screenshot({path:'artifacts/motion-v3/hero/frame-'+t+'.png'});
}
await page.waitForTimeout(1000);
await page.getByRole('button',{name:'A A change in the appointment'}).click();
await page.waitForTimeout(500);
await page.screenshot({path:'artifacts/motion-v3/hero/interactive-answer.png'});
const video=page.video();await context.close();await video.saveAs('artifacts/motion-v3/hero-entrance.webm');await browser.close();
await fs.writeFile('artifacts/motion-v3/hero/measurements.json',JSON.stringify({samples,errors},null,2));
console.log(JSON.stringify({video:'artifacts/motion-v3/hero-entrance.webm',errors,samples:samples.map(s=>({timeMs:s.timeMs,body:s.targets[0],ribbon:s.targets[1],plus:s.targets[2]}))}));
