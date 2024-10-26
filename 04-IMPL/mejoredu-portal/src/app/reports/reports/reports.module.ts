import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { CommonAppModule } from '@common/common.module';
import { ReportsRoutingModule } from './reports.module.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { FileManagmentModule } from '@common/file-managment/file-managment.module';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    ReportsRoutingModule,
    MatTabsModule,
    FileManagmentModule,
  ]
})
export class ReportsModule { }
