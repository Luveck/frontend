import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { CustomMatPaginatorIntl } from '../paginator-es';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { UsuariosPage } from './usuarios/usuarios.page';
import { DetalleUsuario } from './detalle-usuario/detalle-usuario';
import { RolesPage } from './roles/roles.page';

const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosPage
  }
];

@NgModule({
  declarations: [
    UsuariosPage,
    DetalleUsuario,
    RolesPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ]
})

export class SecurityModule {}
