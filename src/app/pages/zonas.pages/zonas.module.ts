import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { CustomMatPaginatorIntl } from '../paginator-es';
import { DetallePaisPage } from './detalle-pais/detalle-pais.page';
import { DetalleCiudadPage } from './detalle-ciudad/detalle-ciudad.page';
import { DetalleFarmaciaPage } from './detalle-farmacia/detalle-farmacia.page';
import { MaterialModule } from 'src/app/material.module';

const routes: Routes = [
  {
    path: 'paises',
    loadChildren: () => import('./paises/paises.module').then( m => m.PaisesPageModule)
  },
  {
    path: 'ciudades',
    loadChildren: () => import('./ciudades/ciudades.module').then( m => m.CiudadesPageModule)
  },
  {
    path: 'farmacias',
    loadChildren: () => import('./farmacias/farmacias.module').then( m => m.FarmaciasPageModule)
  },
];

@NgModule({
  declarations:[
    DetallePaisPage,
    DetalleCiudadPage,
    DetalleFarmaciaPage
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

export class ZonasModule {}
