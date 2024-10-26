import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosticComponent } from './diagnostic.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidateModule } from '@common/validate/validate.module';



@NgModule({
  declarations: [
    DiagnosticComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatProgressSpinnerModule,
    ValidateModule,
  ]
})
export class DiagnosticModule { }
