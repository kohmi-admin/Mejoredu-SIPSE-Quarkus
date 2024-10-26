import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { ReviewRoutingModule } from './review.module.routing';
import { CommonAppModule } from '@common/common.module';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';



@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    ReviewRoutingModule,
    MatCustomTableModule,
  ]
})
export class ReviewModule { }
