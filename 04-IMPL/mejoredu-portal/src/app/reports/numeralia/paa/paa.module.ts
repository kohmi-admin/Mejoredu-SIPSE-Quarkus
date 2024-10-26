import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaaComponent } from './paa.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './paa.routing';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    PaaComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatTabsModule,
  ]
})
export class PaaModule { }
