import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesempenioComponent } from './desempenio.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { FilesComponent } from './files/files.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    DesempenioComponent,
    FilesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatDialogModule,
  ]
})
export class DesempenioModule { }
