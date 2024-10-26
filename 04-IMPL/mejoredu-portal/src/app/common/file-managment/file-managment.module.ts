import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagmentComponent } from './file-managment.component';
import { CommonAppModule } from '@common/common.module';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    FileManagmentComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    MatCustomTableModule,
  ],
  exports: [
    FileManagmentComponent
  ],
})
export class FileManagmentModule { }
