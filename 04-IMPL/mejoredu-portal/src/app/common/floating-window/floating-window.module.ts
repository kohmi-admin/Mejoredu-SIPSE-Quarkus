import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingWindowComponent } from './floating-window.component';



@NgModule({
  declarations: [
    FloatingWindowComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    FloatingWindowComponent,
  ]
})
export class FloatingWindowModule { }
