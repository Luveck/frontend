import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../paginator-es';

const routes: Routes = [
  {
    path: 'paises',
    loadChildren: () => import('./paises/paises.module').then( m => m.PaisesPageModule)
  },
  {
    path: 'detalle-pais/:id',
    loadChildren: () => import('./detalle-pais/detalle-pais.module').then( m => m.DetallePaisPageModule)
  },
  {
    path: 'ciudades',
    loadChildren: () => import('./ciudades/ciudades.module').then( m => m.CiudadesPageModule)
  },
  {
    path: 'detalle-ciudad/:id',
    loadChildren: () => import('./detalle-ciudad/detalle-ciudad.module').then( m => m.DetalleCiudadPageModule)
  },
  {
    path: 'departamentos',
    loadChildren: () => import('./departamentos/departamentos.module').then( m => m.DepartamentosPageModule)
  },
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

export class ZonasModule {}
