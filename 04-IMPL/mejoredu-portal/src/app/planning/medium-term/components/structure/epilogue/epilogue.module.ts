import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpilogueComponent } from './epilogue.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { UploadPiModule } from '../../upload-pi/upload-pi.module';
import { ValidateModule } from '@validate/validate.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    EpilogueComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    UploadPiModule,
    MatCustomTableModule,
    ValidateModule,
    MatProgressSpinnerModule,
  ]
})
export class EpilogueModule { }
