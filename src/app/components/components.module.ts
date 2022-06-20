import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DialogConfComponent } from './dialog-conf/dialog-conf.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    DialogConfComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    BreadcrumbComponent,
    DialogConfComponent
  ]
})

export class ComponentsModule{}
