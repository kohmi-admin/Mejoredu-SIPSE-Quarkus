import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixComponent } from './matrix.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatDialogModule } from '@angular/material/dialog';
import { GeneralDataIndicatorComponent } from './general-data-indicator/general-data-indicator.component';
import { ValidateModule } from '@common/validate/validate.module';
import { RegistryIndicatorsTabComponent } from './registry-indicators-tab/registry-indicators-tab.component';
import { AddIndicatorComponent } from './add-indicator/add-indicator.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    MatrixComponent,
    GeneralDataIndicatorComponent,
    RegistryIndicatorsTabComponent,
    AddIndicatorComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatDialogModule,
    ValidateModule,
    MatProgressSpinnerModule,
  ]
})
export class MatrixModule { }
