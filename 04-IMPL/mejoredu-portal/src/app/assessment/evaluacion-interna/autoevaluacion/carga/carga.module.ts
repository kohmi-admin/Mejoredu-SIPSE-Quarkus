import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargaComponent } from './carga.component';
import { CommonAppModule } from '@common/common.module';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { RoutingModule } from './module.routing';
import { InformComponent } from './inform/inform.component';
import { FilesComponent } from './files/files.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    CargaComponent,
    InformComponent,
    FilesComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    MatCustomTableModule,
    RoutingModule,
    MatDialogModule,
  ]
})
export class CargaModule { }
