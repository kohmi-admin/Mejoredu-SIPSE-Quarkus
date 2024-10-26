import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortTermComponent } from './short-term.component';
import { CommonAppModule } from '@common/common.module';
import { ShortTermRoutingModule } from './short-term.module.routing';
import { FormulationComponent } from './formulation/formulation.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [ShortTermComponent, FormulationComponent],
  imports: [
    CommonModule,
    CommonAppModule,
    ShortTermRoutingModule,
    MatButtonModule,
  ],
  exports: [
    ShortTermComponent
  ]
})
export class ShortTermModule { }
