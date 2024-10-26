import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartBoardComponent } from './chart-board.component';
import { CommonAppModule } from '@common/common.module';
import { CardComponent } from './card/card.component';
import { ChartModule } from '@common/chart/chart.module';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMasonryModule } from 'ngx-masonry';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ChartBoardComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    ChartModule,
    MatMenuModule,
    NgxMasonryModule,
    RouterModule,
  ],
  exports: [
    ChartBoardComponent,
  ]
})
export class ChartBoardModule { }
