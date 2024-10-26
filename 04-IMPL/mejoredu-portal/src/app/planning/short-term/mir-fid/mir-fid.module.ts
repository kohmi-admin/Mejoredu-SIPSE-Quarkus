import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MirFidComponent } from './mir-fid.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    MirFidComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class MirFidModule { }
