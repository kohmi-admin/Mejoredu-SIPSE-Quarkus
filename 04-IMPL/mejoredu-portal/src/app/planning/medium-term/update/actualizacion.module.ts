import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualizacionComponent } from './actualizacion.component';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    ActualizacionComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
  ]
})
export class ActualizacionModule { }
