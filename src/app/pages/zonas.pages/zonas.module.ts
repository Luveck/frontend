import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { CustomMatPaginatorIntl } from '../paginator-es';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { DetallePais } from './detalle-pais/detalle-pais';
import { DetalleFarmacia } from './detalle-farmacia/detalle-farmacia';
import { Detalledepartamento } from './detalle-departamento/detalle-departamento';
import { DetalleCiudad } from './detalle-ciudad/detalle-ciudad';
import { PaisesPage } from './paises/paises.page';
import { DepartamentosPage } from './departamentos/departamentos.page';
import { CiudadesPage } from './ciudades/ciudades.page';
import { FarmaciasPage } from './farmacias/farmacias.page';

const routes: Routes = [
  {
    path: 'paises',
    component: PaisesPage
  },
  {
    path: 'ciudades',
    component: CiudadesPage
  },
  {
    path: 'departamentos',
    component: DepartamentosPage
  },
  {
    path: 'farmacias',
    component: FarmaciasPage
  },
];

@NgModule({
  declarations:[
    DetallePais,
    Detalledepartamento,
    DetalleCiudad,
    DetalleFarmacia,
    PaisesPage,
    DepartamentosPage,
    CiudadesPage,
    FarmaciasPage
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

export class ZonasModule {}
