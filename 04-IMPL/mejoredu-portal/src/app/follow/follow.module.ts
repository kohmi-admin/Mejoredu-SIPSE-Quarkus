import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowComponent } from './follow.component';
import { FollowRoutingModule } from './follow.routing';
import { CommonAppModule } from '@common/common.module';



@NgModule({
  declarations: [
    FollowComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    FollowRoutingModule,
  ]
})
export class FollowModule { }
