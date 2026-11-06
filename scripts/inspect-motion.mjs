import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const out='artifacts/motion-v3'; await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const c=await browser.newContext({viewport:{width:1440,height:900}}); const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:3000');await p.waitForTimeout(4000);
const bounds=await p.locator('[data-motion-story]').evaluate(e=>({top:e.parentElement.getBoundingClientRect().top+scrollY,height:e.parentElement.offsetHeight,pin:e.parentElement.className}));console.log(bounds);
const states=[];for(const fraction of [.1,.35,.6,.9]){await p.evaluate(y=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,y)},bounds.top+3240*fraction);await p.waitForTimeout(1000);await p.screenshot({path:`${out}/scroll-${fraction}.png`});states.push(await p.locator('[data-motion-story]').evaluate(e=>({progress:e.dataset.storyProgress,chapter:e.dataset.chapter,scenes:[...e.querySelectorAll('[data-skill-scene]')].map(s=>({opacity:getComputedStyle(s).opacity,title:s.querySelector('h3')?.textContent,inert:s.inert}))})));}
await p.setViewportSize({width:768,height:1024});await p.waitForTimeout(600);console.log('resize',await p.locator('.pin-spacer').count());await p.screenshot({path:`${out}/tablet.png`,fullPage:true});
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);await p.screenshot({path:`${out}/mobile.png`,fullPage:true});
console.log(JSON.stringify({states,errors}));await fs.writeFile(`${out}/scroll-inspection.json`,JSON.stringify({bounds,states,errors},null,2));await browser.close();
