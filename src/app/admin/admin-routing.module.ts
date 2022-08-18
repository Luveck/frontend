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
        path: 'sbu',
        loadChildren: () => import('../pages/sbu/sbu.module').then( m => m.SbuPageModule),
      },
      {
        path: 'security',
        loadChildren: () => import('../pages/security.pages/security.module').then( m => m.SecurityModule),
      },
      {
        path: 'inventario',
        loadChildren: () => import('../pages/inventario.pages/security.module').then( m => m.InventarioModule),
      },
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
