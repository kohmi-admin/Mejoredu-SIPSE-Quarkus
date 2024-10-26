import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogosComponent } from './catalogos.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { FormModalComponent } from './form-modal/form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    CatalogosComponent,
    FormModalComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatDialogModule,
  ]
})
export class CatalogosModule { }
