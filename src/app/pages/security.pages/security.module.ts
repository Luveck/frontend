import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { DetalleUsuarioPage } from './detalle-usuario/detalle-usuario.page';
import { RolesPage } from './roles/roles.page';
import { MaterialModule } from 'src/app/material.module';

const routes: Routes = [
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  }
];

@NgModule({
  declarations: [
    RolesPage,
    DetalleUsuarioPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})

export class SecurityModule {}
