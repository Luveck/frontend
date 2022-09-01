import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../paginator-es';

const routes: Routes = [
  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.productosPageModule)
  },
  {
    path: 'detalle-producto/:id',
    loadChildren: () => import('./detalle-producto/detalle-producto.module').then( m => m.DetalleProductoPageModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
