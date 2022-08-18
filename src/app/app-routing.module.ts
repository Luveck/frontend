import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./pages/auth.pages/authentification.module').then(m => m.AuthenticationModule)
  },
  {
    path: '**',
    redirectTo: '/admin/home' //Error 404 - Page not found
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
