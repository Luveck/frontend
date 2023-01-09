import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DialogConfComponent } from './dialog-conf/dialog-conf.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ModalProdIniComponent } from './modal-prod-ini/modal-prod-ini.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    DialogConfComponent,
    ScrollToTopComponent,
    ModalProdIniComponent,
    ClientProfileComponent
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
    DialogConfComponent,
    ScrollToTopComponent,
    ClientProfileComponent
  ]
})

export class ComponentsModule{}
