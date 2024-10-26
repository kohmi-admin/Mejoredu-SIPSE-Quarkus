import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaaProjectComponent } from './paa-project.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    PaaProjectComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class PaaProjectModule { }
