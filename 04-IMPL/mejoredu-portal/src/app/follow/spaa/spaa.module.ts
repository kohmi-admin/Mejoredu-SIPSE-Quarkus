import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaaComponent } from './spaa.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    SpaaComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class SpaaModule { }
