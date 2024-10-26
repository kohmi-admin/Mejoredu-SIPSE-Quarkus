import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RvPlanComponent } from './rv-plan.component';
import { RvPlanRoutingModule } from './rv-plan.routing';
import { CommonAppModule } from '@common/common.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ValidateModule } from '@common/validate/validate.module';
import { RubricComponent } from './rubric/rubric.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    RvPlanComponent,
    RubricComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RvPlanRoutingModule,
    CurrencyMaskModule,
    ValidateModule,
    MatProgressSpinnerModule,
  ]
})
export class RvPlanModule { }
