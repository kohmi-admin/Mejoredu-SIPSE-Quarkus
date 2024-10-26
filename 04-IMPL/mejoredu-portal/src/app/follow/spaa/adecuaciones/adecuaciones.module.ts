import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdecuacionesComponent } from './adecuaciones.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    AdecuacionesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class AdecuacionesModule { }
