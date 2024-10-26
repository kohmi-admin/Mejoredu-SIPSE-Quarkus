import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro.component';
import { RoutingModule } from './module.routing';

@NgModule({
  declarations: [
    RegistroComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
  ]
})
export class RegistroModule { }
