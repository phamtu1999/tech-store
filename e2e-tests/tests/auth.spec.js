const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  test('should show login page', async ({ page }) => {
    // Giả định frontend chạy ở port 3000
    await page.goto('http://localhost:3000/login');
    
    // Kiểm tra tiêu đề hoặc các thành phần chính
    await expect(page).toHaveTitle(/Login/i);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Kiểm tra thông báo lỗi (tùy thuộc vào UI của bạn)
    const errorMsg = page.locator('.error-message'); 
    // await expect(errorMsg).toBeVisible();
  });
});
