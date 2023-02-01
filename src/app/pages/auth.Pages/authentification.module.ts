import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NgPasswordValidatorModule } from 'ng-password-validator';
import { MaterialModule } from 'src/app/material.module';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'resetpassword',
    component: ResetPasswordPage
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordPage
  },
  {
    path: 'noauthorized',
    component: NotAuthorizedComponent
  }
];

@NgModule({
  declarations:[
    LoginPage,
    RegisterPage,
    ResetPasswordPage,
    ForgotPasswordPage,
    NotAuthorizedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgPasswordValidatorModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})

export class AuthenticationModule {}
