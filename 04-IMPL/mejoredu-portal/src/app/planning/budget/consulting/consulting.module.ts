import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultingComponent } from './consulting.component';
import { CommonAppModule } from '@common/common.module';
import { ConsultingRoutingmoodule } from './consultation.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    ConsultingComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    ConsultingRoutingmoodule,
    MatCustomTableModule,
  ]
})
export class ConsultingModule { }
