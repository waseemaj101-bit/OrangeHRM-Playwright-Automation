import { expect, Locator, Page } from '@playwright/test';
import { env } from '@config/env.config';
import { routes } from '@config/routes';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.forgotPasswordLink = page.getByText('Forgot your password?');
  }

  async open(): Promise<void> {
    await this.page.goto(routes.login);
    await expect(this.loginButton).toBeVisible();
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submit();
  }

  async loginAsAdmin(): Promise<void> {
    await this.login(env.admin.username, env.admin.password);
  }

  async openForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/auth\/login/);
    await expect(this.loginButton).toBeVisible();
  }

  async expectOnResetPage(): Promise<void> {
    await expect(this.page).toHaveURL(/requestPasswordResetCode/);
    await expect(this.page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  }
}
