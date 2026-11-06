import {chromium,expect} from '@playwright/test';import fs from 'node:fs/promises';
await fs.mkdir('artifacts/exam-preview-fix',{recursive:true});
const browser=await chromium.launch({channel:'chrome'});const results=[];
for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce',recordVideo:{dir:'artifacts/exam-preview-fix',size:{width,height:950}}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.CAPTURE_URL||'http://localhost:3000');const preview=page.locator('[data-exam-preview]');await preview.scrollIntoViewIfNeeded();await page.waitForTimeout(1200);await expect(preview.getByText('Question 1 of 17')).toBeVisible();await expect(preview.getByText('Play/Stop',{exact:true})).toBeVisible();
 await preview.screenshot({path:`artifacts/exam-preview-fix/room-${width}.png`});
 await page.locator('#exam-experience').getByRole('radio').nth(1).check();await preview.getByRole('button',{name:'Đánh dấu câu mẫu',exact:true}).click();await preview.getByRole('button',{name:'Danh sách câu hỏi',exact:true}).click();
 await expect(preview.getByRole('complementary',{name:'Question List'})).toBeVisible();await expect(preview.getByRole('button',{name:'Bookmarked (1)',exact:true})).toBeVisible();await preview.screenshot({path:`artifacts/exam-preview-fix/list-${width}.png`});await preview.getByRole('button',{name:'Mở câu mẫu 2',exact:true}).click();await preview.getByRole('button',{name:'Đóng danh sách câu',exact:true}).click();await expect(preview.getByText('Question 2 of 17')).toBeVisible();await preview.getByRole('button',{name:'Accessibility',exact:true}).click();await preview.getByRole('button',{name:'Dark mode',exact:false}).click();await preview.getByRole('button',{name:'Phóng to bản thử',exact:true}).click();await preview.screenshot({path:`artifacts/exam-preview-fix/access-${width}.png`});
 await preview.getByRole('button',{name:'Thông tin bản thử',exact:true}).click();await expect(preview.getByRole('status')).toContainText('hai câu tương tác');await preview.screenshot({path:`artifacts/exam-preview-fix/info-${width}.png`});
 results.push({width,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});const video=page.video();await context.close();await video.saveAs(`artifacts/exam-preview-fix/preview-${width}.webm`);
}
await fs.writeFile('artifacts/exam-preview-fix/checks.json',JSON.stringify(results,null,2));await browser.close();console.log(results);
