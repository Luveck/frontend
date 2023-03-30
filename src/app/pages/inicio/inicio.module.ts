import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InicioPage } from './inicio.page';
import { RouterModule, Routes } from '@angular/router';
import { NgPasswordValidatorModule } from 'ng-password-validator';
import { SwiperModule } from 'swiper/angular';

import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { InitComponent } from './sec/init/init.component';
import { BeneficiosComponent } from './sec/beneficios/beneficios.component';
import { ProdsComponent } from './sec/prods/prods.component';
import { RegisComponent } from './sec/regis/regis.component';
import { ModalProdIniComponent } from './sec/modal-prod-ini/modal-prod-ini.component';
import { ClientProfileComponent } from './sec/client-profile/client-profile.component';
import { CanjeComponent } from './sec/canje/canje.component';

const routes: Routes = [
  {
    path: '',
    component: InicioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgPasswordValidatorModule,
    SwiperModule,
    ComponentsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    InicioPage,
    InitComponent,
    BeneficiosComponent,
    ProdsComponent,
    RegisComponent,
    ModalProdIniComponent,
    ClientProfileComponent,
    CanjeComponent
  ]
})
export class InicioPageModule {}
