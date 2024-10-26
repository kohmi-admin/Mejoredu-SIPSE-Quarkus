import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtractorComponent } from './extractor.component';
import { ExtractorRoutingModule } from './extractor.module.routing';
import { CommonAppModule } from '@common/common.module';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ExtractorComponent],
  imports: [
    CommonModule,
    ExtractorRoutingModule,
    CommonAppModule,
    MatCustomTableModule,
    MatProgressSpinnerModule,
    DragDropModule,
  ],
})
export class ExtractorModule { }
