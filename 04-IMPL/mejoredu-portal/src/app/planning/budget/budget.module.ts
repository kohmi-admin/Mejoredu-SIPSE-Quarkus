import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { ProgramsComponent } from './programs/programs.component';



@NgModule({
  declarations: [
    BudgetComponent,
    ProgramsComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class BudgetModule { }
