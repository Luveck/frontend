import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DialogConfComponent } from './dialog-conf/dialog-conf.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { SesionEndComponent } from './sesion-end/sesion-end.component';
import { ModalReportComponent } from './modal-report/modal-report.component';
import { DialogcountryComponent } from './dialog-country/dialog-country.component';
import { ProductsPurchaseComponent } from './products-purchase/products-purchase.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    DialogConfComponent,
    ScrollToTopComponent,
    SesionEndComponent,
    ModalReportComponent,
    DialogcountryComponent,
    ProductsPurchaseComponent
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
    SesionEndComponent,
    ModalReportComponent,
    DialogcountryComponent,
    ProductsPurchaseComponent
  ]
})

export class ComponentsModule{}
