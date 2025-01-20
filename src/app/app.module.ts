import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from './material.module';

//formato de fechas
import { registerLocaleData } from '@angular/common';
import localeEsHn from '@angular/common/locales/es-HN';
registerLocaleData(localeEsHn, 'es-Hn');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Hn' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
