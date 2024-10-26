import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RvComponent } from './rv.component';
import { CommonAppModule } from '@common/common.module';
import { ReviewRoutingModule } from './rv.module.routing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    RvComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    ReviewRoutingModule,
    CurrencyMaskModule,
    MatProgressSpinnerModule,
  ]
})
export class RvModule { }
