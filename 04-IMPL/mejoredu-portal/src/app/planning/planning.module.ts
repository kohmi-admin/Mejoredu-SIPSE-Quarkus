import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning.component';
import { PlanningRoutingModule } from './planning.module.routing';
import { CommonAppModule } from '@common/common.module';



@NgModule({
  declarations: [
    PlanningComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    PlanningRoutingModule
  ],
  exports: [
    PlanningComponent
  ]
})
export class PlanningModule { }
