import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformesComponent } from './informes.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { FilesComponent } from './files/files.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    InformesComponent,
    FilesComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatDialogModule,
  ]
})
export class InformesModule { }
