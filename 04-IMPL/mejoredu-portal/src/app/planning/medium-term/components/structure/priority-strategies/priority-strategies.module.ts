import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityStrategiesComponent } from './priority-strategies.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { SpecificActionsModule } from '../specific-actions/specific-actions.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidateModule } from '@validate/validate.module';

@NgModule({
  declarations: [
    PriorityStrategiesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    SpecificActionsModule,
    MatProgressSpinnerModule,
    ValidateModule,
  ]
})
export class PriorityStrategiesModule { }
