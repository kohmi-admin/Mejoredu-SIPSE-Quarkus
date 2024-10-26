import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemTreeComponent } from './problem-tree.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { BoardModule } from '../board/board.module';
import { ValidateModule } from '@common/validate/validate.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ProblemTreeComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    BoardModule,
    ValidateModule,
    MatProgressSpinnerModule,
  ]
})
export class ProblemTreeModule { }
