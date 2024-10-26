import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from './assessment.component';
import { CommonAppModule } from '@common/common.module';
import { AssessmentRoutingModule } from './assessment.routing';



@NgModule({
  declarations: [
    AssessmentComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    AssessmentRoutingModule,
  ]
})
export class AssessmentModule { }
