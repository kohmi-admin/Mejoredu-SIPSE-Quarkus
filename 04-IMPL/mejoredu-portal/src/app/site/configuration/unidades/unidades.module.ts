import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnidadesComponent } from './unidades.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    UnidadesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
  ]
})
export class UnidadesModule { }
