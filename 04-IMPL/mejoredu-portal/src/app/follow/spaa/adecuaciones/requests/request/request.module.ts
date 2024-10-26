import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './request.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { GeneralDataComponent } from './general-data/general-data.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectsComponent } from './projects/projects.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ProductsComponent } from './products/products.component';
import { ActionsComponent } from './actions/actions.component';
import { CancelationComponent } from './cancelation/cancelation.component';
import { AlternSwitchComponent } from './altern-switch/altern-switch.component';
import { ModifyProjectComponent } from './modification/modify-project/modify-project.component';
import { ModifyActivityComponent } from './modification/modify-activity/modify-activity.component';
import { ModifyProductComponent } from './modification/modify-product/modify-product.component';
import { ModifyActionComponent } from './modification/modify-action/modify-action.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { BudgetsTraspasoComponent } from './traspaso/budgets-traspaso/budgets-traspaso.component';
import { AddExpenseItemModule } from './add-expense-item/add-expense-item.module';
import { BudgetsArrComponent } from './arr/budgets-arr/budgets-arr.component';
import { ModifyBudgetsComponent } from './modification/modify-budgets/modify-budgets.component';
import { CancelationBudgetsComponent } from './cancelation/cancelation-budgets/cancelation-budgets.component';
import { JustificationComponent } from './products/justification/justification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActionsModComponent } from './actions/mod/actions-mod/actions-mod.component';
import { ModBudgetsComponent } from './budgets/mod/mod-budgets/mod-budgets.component';

@NgModule({
  declarations: [
    RequestComponent,
    GeneralDataComponent,
    ProjectsComponent,
    ActivitiesComponent,
    ProductsComponent,
    ActionsComponent,
    CancelationComponent,
    AlternSwitchComponent,
    ModifyProjectComponent,
    ModifyActivityComponent,
    ModifyProductComponent,
    ModifyActionComponent,
    BudgetsComponent,
    BudgetsTraspasoComponent,
    BudgetsArrComponent,
    ModifyBudgetsComponent,
    CancelationBudgetsComponent,
    JustificationComponent,
    ActionsModComponent,
    ModBudgetsComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatStepperModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    AddExpenseItemModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ]
})
export class RequestModule { }
