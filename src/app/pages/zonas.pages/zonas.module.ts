import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'paises',
    loadChildren: () => import('./paises/paises.module').then( m => m.PaisesPageModule),
    data: {animation: 'paisesPage'}
  },
  {
    path: 'ciudades',
    loadChildren: () => import('./ciudades/ciudades.module').then( m => m.CiudadesPageModule),
    data: {animation: 'ciudadesPage'}
  },
  {
    path: 'departamentos',
    loadChildren: () => import('./departamentos/departamentos.module').then( m => m.DepartamentosPageModule),
    data: {animation: 'departamentosPage'}
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})

export class ZonasModule {}
