import {test,expect} from '@playwright/test';
test('Aceternity sidebar uses real routes, keyboard expansion and light appearance',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await page.goto('/dashboard');
 const sidebar=page.getByRole('complementary',{name:'Thanh điều hướng'});await expect(sidebar).toHaveCSS('width','60px');await expect(page.locator('.workspace-aceternity')).toHaveCSS('color-scheme','light');await expect(sidebar).toHaveClass(/bg-neutral-100/);
 const practice=sidebar.getByRole('link',{name:'Luyện tập',exact:true});await practice.focus();await expect(sidebar).toHaveCSS('width','300px');await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/practice$/);await expect(sidebar.getByRole('link',{name:'Luyện tập',exact:true})).toHaveAttribute('aria-current','page');
 await page.getByRole('tab',{name:'Reading',exact:true}).focus();await page.mouse.move(1000,800);await expect(sidebar).toHaveCSS('width','60px');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Mở điều hướng'}).click();await expect(page.getByRole('dialog')).toHaveCSS('background-color','rgb(255, 255, 255)');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Mở điều hướng'})).toBeFocused();
});
test('local-data notice is keyboard accessible and Escape dismisses it',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/dashboard');
 const trigger=page.getByRole('button',{name:'Lưu trên thiết bị',exact:true});await trigger.focus();await expect(trigger).toBeFocused();await expect(page.getByRole('tooltip')).toContainText('chưa đồng bộ');await page.keyboard.press('Escape');await expect(page.getByRole('tooltip')).toHaveCount(0);
});
test('mobile Sheet restores focus, routes correctly and account dropdown works',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/practice');
 const menu=page.getByRole('button',{name:'Mở điều hướng',exact:true});await menu.click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(menu).toBeFocused();
 await menu.click();await page.getByRole('dialog').getByRole('link',{name:'Lịch sử bài thi',exact:true}).click();await expect(page).toHaveURL(/\/results$/);await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Menu tài khoản',exact:true}).click();await page.getByRole('menuitem',{name:'Thông tin tài khoản'}).click();await expect(page).toHaveURL(/\/account$/);
 await page.getByLabel('Họ và tên',{exact:true}).fill('Lan');await page.getByLabel('Email',{exact:true}).fill('lan@example.com');await page.getByRole('button',{name:'Lưu thay đổi'}).click();await expect(page.getByRole('status')).toContainText('Đã lưu');await expect(page.locator('.app-topbar [data-slot=avatar-fallback]')).toHaveText('L');
});
test('practice Tabs support keyboard and the unpracticed Switch uses real local history',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('aptis-attempts',JSON.stringify([{id:'fixture',skill:'reading',title:'Reading fixture',date:'2026-11-04',duration:600,answers:{}}])));await page.goto('/practice');
 await page.getByRole('tab',{name:'Reading',exact:true}).click();await expect(page.locator('.exam-card')).toHaveCount(1);await page.getByRole('switch',{name:'Chỉ kỹ năng chưa có bài nộp'}).check();await expect(page.getByText('Chưa tìm thấy bộ đề',{exact:true})).toBeVisible();
 await page.getByRole('switch',{name:'Chỉ kỹ năng chưa có bài nộp'}).uncheck();const tab=page.getByRole('tab',{name:'Reading',exact:true});await tab.focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'Speaking',exact:true})).toHaveAttribute('aria-selected','true');await expect(page.locator('.exam-card')).toContainText('Speaking Practice Test');
});
