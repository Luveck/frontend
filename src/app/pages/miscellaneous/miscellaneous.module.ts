import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// routing
const routes: Routes = [
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then( m => m.ErrorPageModule)
  },
  {
    path: 'not-authorized',
    loadChildren: () => import('./not-authorized/not-authorized.module').then( m => m.NotAuthorizedPageModule)
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MiscellaneousModule {}
