import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DirtyFormGuard } from '@common/guards/dirty-form-guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServicesInterceptor } from '@common/interceptors/services.interceptor';
import { CommonAppModule } from "@common/common.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    HttpClientModule,
    CommonAppModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: ServicesInterceptor, multi: true,
    },
    DirtyFormGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
