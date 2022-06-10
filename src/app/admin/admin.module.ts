import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { MaterialModule } from '../material.module';
import { ComponentsModule } from '../components/components.module';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminPageRoutingModule,
    MaterialModule,
    ComponentsModule,
    NgMaterialMultilevelMenuModule
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
