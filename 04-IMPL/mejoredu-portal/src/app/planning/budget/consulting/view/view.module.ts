import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    ViewComponent,
  ],
  imports: [
    CommonModule,
    RoutingModule,
  ]
})
export class ViewModule { }
