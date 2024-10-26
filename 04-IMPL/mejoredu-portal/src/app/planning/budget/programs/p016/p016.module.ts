import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { P016Component } from './p016.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [
    P016Component
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
  ]
})
export class P016Module { }
