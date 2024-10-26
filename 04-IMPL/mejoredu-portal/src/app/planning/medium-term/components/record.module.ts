import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordComponent } from './record.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { StructureModule } from './structure/structure.module';



@NgModule({
  declarations: [
    RecordComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    StructureModule,
  ]
})
export class RecordModule { }
