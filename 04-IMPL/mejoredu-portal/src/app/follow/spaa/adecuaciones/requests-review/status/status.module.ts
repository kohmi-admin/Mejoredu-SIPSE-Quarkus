import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { TimeLineModule } from '@common/time-line/time-line.module';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    StatusComponent,
    AddCommentComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    TimeLineModule,
    MatCustomTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ]
})
export class StatusModule { }
