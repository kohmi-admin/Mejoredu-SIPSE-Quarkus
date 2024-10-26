import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformesComponent } from './informes.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import { FilesComponent } from './files/files.component';



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
    MatTabsModule,
  ]
})
export class InformesModule { }
