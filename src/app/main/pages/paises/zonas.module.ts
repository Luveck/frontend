import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { ListPaisesComponent } from './list-paises/list-paises.component';
import { DetallePaisComponent } from './detalle-pais/detalle-pais.component';
import { ListDepartamentosComponent } from './list-departamentos/list-departamentos.component';
import { DetalleDepartamentoComponent } from './detalle-departamento/detalle-departamento.component';
import { ListCiudadesComponent } from './list-ciudades/list-ciudades.component';
import { DetalleCiudadComponent } from './detalle-ciudad/detalle-ciudad.component';

import { AuthGuard } from 'app/auth/helpers/auth.guards';

const routes = [
  {
    path: 'zona/listpaises',
    component: ListPaisesComponent,
    data: { animation: 'listpaises' },
    canActivate: [AuthGuard]
  },
  {
    path: 'zona/detallepais/:id',
    component: DetallePaisComponent,
    data: { animation: 'detallepais' },
    canActivate: [AuthGuard]
  },
  {
    path: 'zona/listdepartamentos',
    component: ListDepartamentosComponent,
    data: { animation: 'listdepartamentos' },
    canActivate: [AuthGuard]
  },
  {
    path: 'zona/detalledepartamento',
    component: DetalleDepartamentoComponent,
    data: { animation: 'detalledepartamento' },
    canActivate: [AuthGuard]
  },
  {
    path: 'zona/listciudades',
    component: ListCiudadesComponent,
    data: { animation: 'listciudades' },
    canActivate: [AuthGuard]
  },
  {
    path: 'zona/detalleciudad',
    component: DetalleCiudadComponent,
    data: { animation: 'detalleciudad' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [ListPaisesComponent, DetallePaisComponent, ListDepartamentosComponent, DetalleDepartamentoComponent, ListCiudadesComponent, DetalleCiudadComponent],
  imports: [CoreCommonModule, RouterModule.forChild(routes), ContentHeaderModule, TranslateModule, CoreCommonModule, NgxDatatableModule],
  exports: [ListPaisesComponent, DetallePaisComponent, ListDepartamentosComponent, DetalleDepartamentoComponent, ListCiudadesComponent, DetalleCiudadComponent]
})
export class ZonasModule {}
