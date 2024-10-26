import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate.component';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    ValidateComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
  ]
})
export class ValidateModule { }
