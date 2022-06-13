import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule),
        data: {animation: 'homePage'}
      },
      {
        path: 'paises',
        loadChildren: () => import('../pages/paises/paises.module').then( m => m.PaisesPageModule),
        data: {animation: 'paisesPage'}
      },
      {
        path: 'ciudades',
        loadChildren: () => import('../pages/ciudades/ciudades.module').then( m => m.CiudadesPageModule),
        data: {animation: 'ciudadesPage'}
      },
      {
        path: 'departamentos',
        loadChildren: () => import('../pages/departamentos/departamentos.module').then( m => m.DepartamentosPageModule),
        data: {animation: 'departamentosPage'}
      },
      {
        path: '',
        redirectTo: '/admin/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/admin/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
