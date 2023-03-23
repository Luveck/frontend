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
import { ChangePasswordPage } from './change-password/change-password.page';
import { LoginGuard } from 'src/app/guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [LoginGuard]
  },
  {
    path: 'resetpassword',
    component: ResetPasswordPage,
    canActivate: [LoginGuard]
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordPage,
    canActivate: [LoginGuard]
  },
  {
    path: 'changepassword',
    component: ChangePasswordPage
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
    ChangePasswordPage,
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
