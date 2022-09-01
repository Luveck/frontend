import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DetalleProductoPage } from './detalle-producto.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/material.module';

const routes: Routes = [
  {
    path: '',
    component: DetalleProductoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleProductoPage]
})

export class DetalleProductoPageModule {}
