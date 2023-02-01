import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { CustomMatPaginatorIntl } from '../paginator-es';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/material.module';

import { DetalleCategoria } from './detalle-categoria/detalle-categoria';
import { DetalleProducto } from './detalle-producto/detalle-producto';
import { DetalleReglas } from './detalle-reglas/detalle-reglas';
import { CategoriasPage } from './categorias/categorias.page';
import { ProductosPage } from './productos/productos.page';
import { ReglasPage } from './reglas/reglas.page';

const routes: Routes = [
  {
    path: 'categorias',
    component: CategoriasPage
  },
  {
    path: 'productos',
    component: ProductosPage
  },
  {
    path: 'reglas',
    component: ReglasPage
  }
];

@NgModule({
  declarations:[
    DetalleCategoria,
    DetalleProducto,
    DetalleReglas,
    CategoriasPage,
    ProductosPage,
    ReglasPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ]
})

export class InventarioModule {}
