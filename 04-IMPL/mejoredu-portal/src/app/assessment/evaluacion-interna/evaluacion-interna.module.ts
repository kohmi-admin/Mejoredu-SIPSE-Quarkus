import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluacionInternaComponent } from './evaluacion-interna.component';
import { CommonAppModule } from '@common/common.module';
import { EvaluacionInternaRoutingModule } from './evaluacion-interna.routing';



@NgModule({
  declarations: [
    EvaluacionInternaComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    EvaluacionInternaRoutingModule,
  ]
})
export class EvaluacionInternaModule { }
