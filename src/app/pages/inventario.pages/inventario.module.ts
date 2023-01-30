import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../paginator-es';
import { MaterialModule } from 'src/app/material.module';
import { DetalleCategoriaPage } from './detalle-categoria/detalle-categoria.page';
import { DetalleProductoPage } from './detalle-producto/detalle-producto.page';
import { DetalleReglasComponent } from './detalle-reglas/detalle-reglas.component';

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
    path: 'reglas',
    loadChildren: () => import('./reglas/reglas.module').then( m => m.reglasPageModule)
  }
];

@NgModule({
  declarations:[
    DetalleCategoriaPage,
    DetalleProductoPage,
    DetalleReglasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
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
