import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MirComponent } from './mir.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    MirComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class MirModule { }
