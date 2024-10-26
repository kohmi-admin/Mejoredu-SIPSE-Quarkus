import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumeraliaComponent } from './numeralia.component';
import { NumeraliaRoutingModule } from './numeralia.module.routing';
import { CommonAppModule } from '@common/common.module';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    NumeraliaComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    NumeraliaRoutingModule,
    MatTabsModule,
  ]
})
export class NumeraliaModule { }
