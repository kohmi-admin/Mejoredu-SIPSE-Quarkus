import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { O001Component } from './o001.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { M001Module } from '../m001/m001.module';



@NgModule({
  declarations: [
    O001Component
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    M001Module,
  ]
})
export class O001Module { }
