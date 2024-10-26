import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { CommonAppModule } from '@common/common.module';
import { ReportsRoutingModule } from './reports.routing';
import { ChartModule } from '@common/chart/chart.module';
import { ChartBoardModule } from './chart-board/chart-board.module';
import { ManageChartComponent } from './manage-chart/manage-chart.component';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    ReportsComponent,
    ManageChartComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    ReportsRoutingModule,
    ChartModule,
    ChartBoardModule,
    MatTabsModule,
  ]
})
export class ReportsModule { }
