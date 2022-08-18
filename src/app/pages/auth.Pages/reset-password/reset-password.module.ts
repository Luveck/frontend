import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ResetPasswordPage } from './reset-password.page';
import { RouterModule, Routes } from '@angular/router';
import { NgPasswordValidatorModule } from 'ng-password-validator';
import { MaterialModule } from 'src/app/material.module';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgPasswordValidatorModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
