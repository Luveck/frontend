import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { CustomMatPaginatorIntl } from '../paginator-es';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { DetalleEspacialidad } from './detalle-especialidad/detalle-espacialidad';
import { DetalleMedico } from './detalle-medico/detalle-medico';
import { EspecialidadesPage } from './especialidades/especialidades.page';
import { MedicosPage } from './medicos/medicos.page';
import { PatologiaPage } from './patologia/patologia.page';
import { DetallePatologia } from './detalle-patologia/detalle-patologia';

const routes: Routes = [
  {
    path: 'especialidades',
    component: EspecialidadesPage
  },
  {
    path: 'patologias',
    component: PatologiaPage
  },
  {
    path: 'medicos',
    component: MedicosPage
  }
];

@NgModule({
  declarations:[
    DetalleEspacialidad,
    DetalleMedico,
    EspecialidadesPage,
    MedicosPage,
    PatologiaPage,
    DetallePatologia
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

export class MedicosModule {}
