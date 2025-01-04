import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { MaterialModule } from '../material.module';
import { InicioPageModule } from '../pages/inicio/inicio.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminPageRoutingModule,
    MaterialModule,
    InicioPageModule,
    FormsModule
  ],
  declarations: [AdminPage],
  providers : [
  ]
})
export class AdminModule {}
