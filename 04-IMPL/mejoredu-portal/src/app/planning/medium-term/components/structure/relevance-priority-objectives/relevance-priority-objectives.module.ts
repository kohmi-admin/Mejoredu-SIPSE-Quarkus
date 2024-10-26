import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelevancePriorityObjectivesComponent } from './relevance-priority-objectives.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { ValidateModule } from '@validate/validate.module';



@NgModule({
  declarations: [
    RelevancePriorityObjectivesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    ValidateModule,
  ],
  exports: [
    RelevancePriorityObjectivesComponent,
  ]
})
export class RelevancePriorityObjectivesModule { }
