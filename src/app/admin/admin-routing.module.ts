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
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'zonas',
        loadChildren: () => import('../pages/zonas.pages/zonas.module').then( m => m.ZonasModule),
      },
      {
        path: 'security',
        loadChildren: () => import('../pages/security.pages/security.module').then( m => m.SecurityModule),
      },
      {
        path: 'inventario',
        loadChildren: () => import('../pages/inventario.pages/inventario.module').then( m => m.InventarioModule),
      },
      {
        path: 'medicos',
        loadChildren: () => import('../pages/medicos.pages/medicos.module').then( m => m.MedicosModule),
      },
      {
        path: 'ventas',
        loadChildren: () => import('../pages/ventas.pages/ventas.module').then( m => m.VentasModule),
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
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdminPageRoutingModule {}
