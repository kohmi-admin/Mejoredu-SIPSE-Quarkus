import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodComponent } from './period.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    PeriodComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatDatepickerModule,
  ]
})
export class PeriodModule { }
