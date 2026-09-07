import { Component, signal } from '@angular/core';
import { Button } from '../../../../common/ui/button';
import { Input } from '../../../../common/ui/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppFormControl } from '../../../../common/ui/form-control';
import { RouterLink } from '@angular/router';
import { AppLogo } from '../../../../common/ui/app-logo';
import { DividerLine } from '../../../../common/ui/divider-line';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageBanner, MessageBannerType } from '../../../../common/ui/message-banner';
import { Gender } from '../../../../common/enum/gender';
import { LoginService } from '../../login.service';

@Component({
  imports: [Button,Input,ReactiveFormsModule,AppFormControl,AppLogo,RouterLink,DividerLine,MessageBanner],
  selector: 'app-register-form',
  styleUrl: './register-form.css',
  templateUrl: './register-form.html',
  host: {
    class: 'block w-full max-w-sm'
  }
})
export class RegisterForm {

  protected readonly MessageBannerType = MessageBannerType;
  protected readonly Gender = Gender;

  registerForm!:FormGroup;
  nameControl!:FormControl;
  genderControl!:FormControl;
  dobControl!:FormControl;
  emailControl!:FormControl;
  passwordControl!:FormControl;
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private registerService: LoginService
  ) {
    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.nameControl = this.fb.control(null,[Validators.required]);
    this.genderControl = this.fb.control(null,[Validators.required]);
    this.dobControl = this.fb.control(null,[Validators.required]);
    this.emailControl = this.fb.control(null,[Validators.required, Validators.email]);
    this.passwordControl = this.fb.control(null,[Validators.required, Validators.minLength(8)]);
    this.registerForm = this.fb.group({
      name: this.nameControl,
      gender: this.genderControl,
      dob: this.dobControl,
      email: this.emailControl,
      password: this.passwordControl
    });
  }

  register() {
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    const body = this.registerForm.value;
    this.registerService.register(body).subscribe({
      next: () => {
        this.registerService.onRegisterSuccess();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'Something went wrong. Please try again.');
      }
    });
  }

}
