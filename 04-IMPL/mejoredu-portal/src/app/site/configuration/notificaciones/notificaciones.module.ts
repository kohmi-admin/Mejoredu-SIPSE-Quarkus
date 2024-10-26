import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesComponent } from './notificaciones.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    NotificacionesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
  ]
})
export class NotificacionesModule { }
