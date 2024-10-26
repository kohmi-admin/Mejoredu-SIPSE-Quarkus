import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvancesComponent } from './avances.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    AvancesComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class AvancesModule { }
