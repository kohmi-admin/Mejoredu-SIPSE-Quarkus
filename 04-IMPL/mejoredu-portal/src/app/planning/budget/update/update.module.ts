import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateComponent } from './update.component';
import { CommonAppModule } from '@common/common.module';
import { UpdateRoutingmoodule } from './update.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    UpdateComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    UpdateRoutingmoodule,
    MatCustomTableModule,
  ]
})
export class UpdateModule { }
