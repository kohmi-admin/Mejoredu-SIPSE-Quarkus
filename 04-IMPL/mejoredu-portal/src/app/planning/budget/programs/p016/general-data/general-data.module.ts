import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralDataComponent } from './general-data.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCustomTableComponent } from '@common/mat-custom-table/mat-custom-table.component';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidateModule } from '@common/validate/validate.module';

@NgModule({
  declarations: [
    GeneralDataComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatDialogModule,
    MatCustomTableModule,
    MatProgressSpinnerModule,
    ValidateModule,
  ],
  exports: [
    GeneralDataComponent,
  ],
})
export class GeneralDataModule { }
