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
        path: 'zonas',
        loadChildren: () => import('../pages/zonas.pages/zonas.module').then( m => m.ZonasModule),
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
