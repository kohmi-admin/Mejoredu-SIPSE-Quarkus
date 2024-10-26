import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonAppModule } from '@common/common.module';
import { UploadFileComponent } from './upload-file.component';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [UploadFileComponent],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatProgressSpinnerModule,
  ],
})
export class UploadFileModule { }
