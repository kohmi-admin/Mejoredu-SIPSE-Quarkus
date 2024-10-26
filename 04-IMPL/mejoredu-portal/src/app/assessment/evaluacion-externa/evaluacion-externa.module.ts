import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluacionExternaComponent } from './evaluacion-externa.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    EvaluacionExternaComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatTabsModule,
  ]
})
export class EvaluacionExternaModule { }
