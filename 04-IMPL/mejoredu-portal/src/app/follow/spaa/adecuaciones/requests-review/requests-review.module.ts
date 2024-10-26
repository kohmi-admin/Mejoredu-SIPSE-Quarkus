import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsReviewComponent } from './requests-review.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { TimeLineModule } from '@common/time-line/time-line.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    RequestsReviewComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    TimeLineModule,
    MatProgressSpinnerModule,
  ]
})
export class RequestsReviewModule { }
