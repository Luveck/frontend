import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { CustomMatPaginatorIntl } from '../paginator-es';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { VentasPage } from './ventas/ventas.page';
import { DetalleVenta } from './detalle-ventas/detalle-venta';
import { PharmacySearchComponent } from './pharmacy-search/pharmacy-search.component';
import { FilesDirective } from './detalle-ventas/files.directive';

const routes: Routes = [
  {
    path: 'ventas',
    component: VentasPage
  },
  {
    path: 'venta-detalle/:noPurchase/:buyer',
    component: DetalleVenta
  }
];

@NgModule({
  declarations:[
    VentasPage,
    DetalleVenta,
    PharmacySearchComponent,
    FilesDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ]
})

export class VentasModule {}
