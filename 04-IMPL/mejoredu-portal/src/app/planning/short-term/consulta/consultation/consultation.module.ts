import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationComponent } from './consultation.component';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    ConsultationComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
  ]
})
export class ConsultationModule { }
