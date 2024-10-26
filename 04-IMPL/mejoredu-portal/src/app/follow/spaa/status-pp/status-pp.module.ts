import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPpComponent } from './status-pp.component';
import { CommonAppModule } from '@common/common.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { RoutingModule } from './module.routing';
import { ProyectsComponent } from './proyects/proyects.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { ActivitiesComponent } from './activities/activities.component';
import { ProductsComponent } from './products/products.component';
import { GeneralDataComponent } from './general-data/general-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduledExpenseComponent } from './general-data/scheduled-expense/scheduled-expense.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { BudgetCalendarComponent } from './general-data/budget-calendar/budget-calendar.component';



@NgModule({
  declarations: [
    StatusPpComponent,
    ProyectsComponent,
    ActivitiesComponent,
    ProductsComponent,
    GeneralDataComponent,
    ScheduledExpenseComponent,
    BudgetCalendarComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    MatTabsModule,
    RouterModule,
    RoutingModule,
    MatButtonToggleModule,
    MatCustomTableModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
  ]
})
export class StatusPpModule { }
