import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureComponent } from './structure.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { WellnessGoalsModule } from '../wellness-goals/wellness-goals.module';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    StructureComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatStepperModule,
    MatCustomTableModule,
    WellnessGoalsModule,
    MatTabsModule,
  ],
  providers: [
  ],
  exports: [
    StructureComponent,
  ]
})
export class StructureModule { }
