import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeLineComponent } from './time-line.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    TimeLineComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatIconModule,
  ],
  exports: [
    TimeLineComponent
  ]
})
export class TimeLineModule { }
