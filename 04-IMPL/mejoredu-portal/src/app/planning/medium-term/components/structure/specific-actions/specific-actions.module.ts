import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecificActionsComponent } from './specific-actions.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { ValidateModule } from '@validate/validate.module';



@NgModule({
  declarations: [
    SpecificActionsComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    ValidateModule,
  ],
  exports: [
    SpecificActionsComponent,
  ]
})
export class SpecificActionsModule { }
