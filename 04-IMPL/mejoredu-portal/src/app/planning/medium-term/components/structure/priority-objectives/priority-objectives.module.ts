import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityObjectivesComponent } from './priority-objectives.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { RelevancePriorityObjectivesModule } from '../relevance-priority-objectives/relevance-priority-objectives.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidateModule } from '@validate/validate.module';



@NgModule({
  declarations: [
    PriorityObjectivesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    RelevancePriorityObjectivesModule,
    MatProgressSpinnerModule,
    ValidateModule,
  ]
})
export class PriorityObjectivesModule { }
