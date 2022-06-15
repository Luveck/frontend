import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaisesPage } from './paises.page';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

const routes: Routes = [
  {
    path: '',
    component: PaisesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaisesPage]
})
export class PaisesPageModule {}
