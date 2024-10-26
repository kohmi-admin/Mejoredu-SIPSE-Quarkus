import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsForWellBeingComponent } from './goals-for-well-being.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { WellnessGoalsModule } from '../../wellness-goals/wellness-goals.module';
import { ValidateModule } from '@validate/validate.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    GoalsForWellBeingComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    WellnessGoalsModule,
    MatCustomTableModule,
    MatProgressSpinnerModule,
    ValidateModule,
  ]
})
export class GoalsForWellBeingModule { }
