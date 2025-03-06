import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { CustomMatPaginatorIntl } from '../paginator-es';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ExchangePage } from './exchange/exchange.page';
import { ExchangeDetail } from './exchange-detail/exchange-detail';
import { PharmacySearchComponent } from '../../components/pharmacy-search/pharmacy-search.component';
import { FilesDirective } from './exchange-detail/files.directive';

const routes: Routes = [
  {
    path: 'canjes',
    component: ExchangePage,
  },
  {
    path: 'details-canje/:noPurchase/:buyer',
    component: ExchangeDetail,
  },
];

@NgModule({
  declarations: [
    ExchangePage,
    ExchangeDetail,
    PharmacySearchComponent,
    FilesDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
  ],
})
export class ExchangeModule {}
