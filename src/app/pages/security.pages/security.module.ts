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
import { DetalleRole } from './detalle-role/detalle-role';
import { RolesModulePage } from './roles-module/roles-module.page';

const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosPage
  },
  {
    path: 'roles',
    component: RolesPage
  },
  {
    path: 'moduleRoles',
    component: RolesModulePage  
  }
];

@NgModule({
  declarations: [
    UsuariosPage,
    DetalleUsuario,
    RolesPage,
    DetalleRole,
    RolesModulePage
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
