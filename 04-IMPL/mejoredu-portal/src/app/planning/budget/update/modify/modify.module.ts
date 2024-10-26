import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModifyComponent } from './modify.component';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    ModifyComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
  ]
})
export class ModifyModule { }
