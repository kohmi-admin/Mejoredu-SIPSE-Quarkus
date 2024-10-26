import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonAppModule } from '@common/common.module';
import { AnalyticalDocumentComponent } from './analytical-document.component';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    AnalyticalDocumentComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule
  ]
})
export class AnalyticalDocumentModule { }
