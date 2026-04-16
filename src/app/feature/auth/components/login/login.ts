import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthApi, type LoginResponse } from '../../service/auth-api';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  loginResponse: LoginResponse | null = null;

  constructor(private authApi: AuthApi) {}

  async onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.authApi.login({
        username: this.username,
        password: this.password,
        expiresInMins: 30,
      });

      this.loginResponse = response;
      console.log('Login successful:', response);
      window.dispatchEvent(new CustomEvent('navigate-to-shell', { detail: {path: 'view', token: response} }));

      // Handle successful login (redirect, store token, etc.)
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
