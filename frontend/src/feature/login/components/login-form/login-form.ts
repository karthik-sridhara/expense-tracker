import { Component, signal } from '@angular/core';
import { Button } from '../../../../common/ui/button';
import { Input } from '../../../../common/ui/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginType } from '../../../../common/interface/login/login-request';
import { AppFormControl } from '../../../../common/ui/form-control';
import { LoginService } from '../../login.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppLogo } from '../../../../common/ui/app-logo';
import { DividerLine } from '../../../../common/ui/divider-line';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageBanner,MessageBannerType } from '../../../../common/ui/message-banner';

@Component({
  imports: [Button,Input,ReactiveFormsModule,AppFormControl,AppLogo,RouterLink,DividerLine,MessageBanner],
  selector: 'app-login-form',
  styleUrl: './login-form.css',
  templateUrl: './login-form.html',
  host: {
    class: 'block w-full  max-w-sm'
  }
})
export class LoginForm {

  protected readonly MessageBannerType = MessageBannerType;

  loginForm!:FormGroup;
  usernameControl!:FormControl;
  passwordControl!:FormControl;
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private state: ActivatedRoute
  ) {
    this.createLoginForm();
  }

  private createLoginForm() {
    this.usernameControl = this.fb.control(null,[Validators.required, Validators.email]);
    this.passwordControl = this.fb.control(null,[Validators.required, Validators.minLength(8)]);
    this.loginForm = this.fb.group({
      username: this.usernameControl,
      password: this.passwordControl,
      type: this.fb.control(LoginType.APP)
    });
  }

  login() {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    // this.errorMessage.set(null);
    const body = this.loginForm.value;
    this.loginService.login(body).subscribe({
      next: (response) => {
        const redirectUrl = this.state.snapshot.queryParams['returnUrl'] || '/';
        this.loginService.onLoginSuccess(response.data,redirectUrl);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login error:', error.error);
        this.errorMessage.set(error.error?.message ?? 'Something went wrong. Please try again.');
      }
    });
  }

}
