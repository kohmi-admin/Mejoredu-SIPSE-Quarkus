import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MirPiComponent } from './mir-pi.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { NgxMasonryModule } from 'ngx-masonry';
import { ChartModule } from '@common/chart/chart.module';



@NgModule({
  declarations: [
    MirPiComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    NgxMasonryModule,
    ChartModule,
  ]
})
export class MirPiModule { }
