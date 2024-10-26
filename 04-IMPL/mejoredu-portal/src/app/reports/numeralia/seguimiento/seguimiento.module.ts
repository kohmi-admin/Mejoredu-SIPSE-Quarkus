import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguimientoComponent } from './seguimiento.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { ChartModule } from '@common/chart/chart.module';



@NgModule({
  declarations: [
    SeguimientoComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    ChartModule,
  ]
})
export class SeguimientoModule { }
