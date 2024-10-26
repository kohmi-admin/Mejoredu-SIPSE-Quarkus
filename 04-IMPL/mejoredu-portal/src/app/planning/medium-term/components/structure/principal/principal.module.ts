import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './principal.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { PublicProblemsModule } from '../public-problems/public-problems.module';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidateModule } from '@validate/validate.module';



@NgModule({
  declarations: [
    PrincipalComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    PublicProblemsModule,
    MatCustomTableModule,
    MatProgressSpinnerModule,
    ValidateModule,
  ]
})
export class PrincipalModule { }
