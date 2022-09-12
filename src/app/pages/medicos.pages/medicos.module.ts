import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../paginator-es';
import { MaterialModule } from 'src/app/material.module';
import { DetalleEspacialidadPage } from './detalle-especialidad/detalle-espacialidad.page';
import { DetalleMedicoPage } from './detalle-medico/detalle-medico.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: 'especialidades',
    loadChildren: () => import('./especialidades/especialidades.module').then( m => m.EspecialidadesPageModule)
  },
  {
    path: 'medicos',
    loadChildren: () => import('./medicos/medicos.module').then( m => m.MedicosPageModule)
  }
];

@NgModule({
  declarations:[
    DetalleEspacialidadPage,
    DetalleMedicoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ]
})

export class MedicosModule {}
