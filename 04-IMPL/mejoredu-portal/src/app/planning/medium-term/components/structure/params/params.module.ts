import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsComponent } from './params.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { WellnessGoalsModule } from '../../wellness-goals/wellness-goals.module';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { ValidateModule } from '@validate/validate.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    ParamsComponent
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
export class ParamsModule { }
