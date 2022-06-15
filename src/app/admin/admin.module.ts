import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { MaterialModule } from '../material.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminPageRoutingModule,
    MaterialModule,
    ComponentsModule
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
