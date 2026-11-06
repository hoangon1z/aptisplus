import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome'});const errors=[];
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000');await page.getByRole('button',{name:'Bỏ qua ↗'}).click();
 await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 for(const id of ['stories','why','pricing','faq']){
  await page.locator('#'+id).evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY+20));await page.waitForTimeout(1100);
  if(id==='why')await page.getByRole('button',{name:'Đánh dấu câu hỏi minh họa'}).click();
  if(id==='faq')await page.getByText('Tôi có thể luyện những kỹ năng nào?',{exact:true}).click();
  await page.screenshot({path:`artifacts/ultimate-landing/stage-c-${id}-${width}.png`});
 }
 await page.close();
}
await browser.close();console.log({errors});
