import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { P016Component } from './p016.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { JustifyComponent } from './justify/justify.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { JustifyActivityComponent } from './justify-activity/justify-activity.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    P016Component,
    JustifyComponent,
    JustifyActivityComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatCustomTableModule,
    MatProgressSpinnerModule,
  ]
})
export class P016Module { }
