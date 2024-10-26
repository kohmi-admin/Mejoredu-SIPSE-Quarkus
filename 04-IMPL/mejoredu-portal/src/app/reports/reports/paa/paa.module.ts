import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaaComponent } from './paa.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './paa.routing';
import { ChartModule } from '@common/chart/chart.module';



@NgModule({
  declarations: [
    PaaComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    ChartModule,
  ]
})
export class PaaModule { }
