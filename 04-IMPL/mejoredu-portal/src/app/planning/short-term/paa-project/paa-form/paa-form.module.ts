import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaaFormComponent } from './paa-form.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    PaaFormComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatExpansionModule,
  ]
})
export class PaaFormModule { }
