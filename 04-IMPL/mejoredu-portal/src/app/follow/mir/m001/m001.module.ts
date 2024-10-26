import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { M001Component } from './m001.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    M001Component
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
  ],
  exports: [
    M001Component
  ],
})
export class M001Module { }
