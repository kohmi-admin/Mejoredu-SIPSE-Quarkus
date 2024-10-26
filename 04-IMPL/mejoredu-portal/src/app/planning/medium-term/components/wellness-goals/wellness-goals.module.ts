import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WellnessGoalsComponent } from './wellness-goals.component';
import { RoutingModule } from './module.routing';
import { CommonAppModule } from '@common/common.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MetaElementsComponent } from './meta-elements/meta-elements.component';
import { CalculationMethodComponent } from './calculation-method/calculation-method.component';
import { ValueComponent } from './value/value.component';
import { HistoricalSeriesComponent } from './historical-series/historical-series.component';
import { IntermediateGoalsComponent } from './intermediate-goals/intermediate-goals.component';



@NgModule({
  declarations: [
    WellnessGoalsComponent,
    MetaElementsComponent,
    CalculationMethodComponent,
    ValueComponent,
    HistoricalSeriesComponent,
    IntermediateGoalsComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatTabsModule,
  ],
  exports: [
    WellnessGoalsComponent,
    MetaElementsComponent,
    CalculationMethodComponent,
    ValueComponent,
    HistoricalSeriesComponent,
    IntermediateGoalsComponent
  ]
})
export class WellnessGoalsModule { }
