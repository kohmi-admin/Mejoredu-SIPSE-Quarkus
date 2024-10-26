import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonAppModule } from '@common/common.module';
import { UploadFileComponent } from './upload-file.component';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule
  ]
})
export class UploadFileModule { }
