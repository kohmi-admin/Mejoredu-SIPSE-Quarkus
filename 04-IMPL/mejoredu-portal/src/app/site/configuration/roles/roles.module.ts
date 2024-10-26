import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    RolesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
  ]
})
export class RolesModule { }
