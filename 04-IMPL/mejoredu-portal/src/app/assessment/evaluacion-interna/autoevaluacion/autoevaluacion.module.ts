import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoevaluacionComponent } from './autoevaluacion.component';
import { CommonAppModule } from '@common/common.module';
import { AutoevaluacionRoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AutoevaluacionComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    AutoevaluacionRoutingModule,
    MatCustomTableModule,
    MatTabsModule,
    MatDialogModule,
  ]
})
export class AutoevaluacionModule { }
