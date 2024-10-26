import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate.component';
import { CommonAppModule } from '@common/common.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ValidateComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    ValidateComponent
  ],
})
export class ValidateModule { }
