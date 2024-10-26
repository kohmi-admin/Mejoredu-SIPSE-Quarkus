import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnualProjectComponent } from './annual-project.component';
import { CommonAppModule } from '@common/common.module';
import { AnnualProjectRoutingModule } from './module.routing';



@NgModule({
  declarations: [
    AnnualProjectComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    AnnualProjectRoutingModule
  ]
})
export class AnnualProjectModule { }
