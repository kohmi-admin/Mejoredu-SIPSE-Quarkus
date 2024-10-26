import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { M001Component } from './m001.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GeneralDataComponent } from './general-data/general-data.component';
import { GeneralDataModule } from '../p016/general-data/general-data.module';
import { ConsultingFilesComponent } from './general-data/consulting-files/consulting-files.component';
import { ValidateModule } from '@common/validate/validate.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [M001Component, GeneralDataComponent, ConsultingFilesComponent],
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
    GeneralDataModule,
    ValidateModule,
    MatProgressSpinnerModule,
  ],
})
export class M001Module { }
