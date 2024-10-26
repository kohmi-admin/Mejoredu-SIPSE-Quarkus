import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaComponent } from './consulta.component';
import { CommonAppModule } from '@common/common.module';
import { ConsultaRoutingModule } from './consulta.module.routing';
import { PaaAprobadosComponent } from './paa-aprobados/paa-aprobados.component';
import { ProyectoPaaComponent } from './proyecto-paa/proyecto-paa.component';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    ConsultaComponent,
    PaaAprobadosComponent,
    ProyectoPaaComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    ConsultaRoutingModule,
    MatCustomTableModule,
  ]
})
export class ConsultaModule { }
