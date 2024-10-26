import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { ProjectsComponent } from './v2/projects/projects.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivitiesComponent } from './v2/activities/activities.component';
import { ProductsComponent } from './v2/products/products.component';
import { BudgetsComponent } from './v2/budgets/budgets.component';
import { UploadComponent } from './upload/upload.component';
import { SaveUpdateFileComponent } from './upload/save-update/save-update.component';
import { MirComponent } from './v2/mir/mir.component';
import { GoalsWellBeingComponent } from './v2/goals-well-being/goals-well-being.component';
import { GeneralViewComponent } from './v2/general-view/general-view.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidateModule } from '@common/validate/validate.module';
import { ViewMirComponent } from './v2/mir/view-mir/view-mir.component';
import { ViewFichaIdentificadorComponent } from './v2/mir/view-ficha-identificador/view-ficha-identificador.component';
import { ViewProductComponent } from './v2/mir/view-product/view-product.component';
import { ViewParamsComponent } from './v2/goals-well-being/view-params/view-params.component';
import { WellnessGoalsModule } from 'src/app/planning/medium-term/components/wellness-goals/wellness-goals.module';

@NgModule({
  declarations: [
    FormComponent,
    ProjectsComponent,
    ActivitiesComponent,
    ProductsComponent,
    BudgetsComponent,
    UploadComponent,
    SaveUpdateFileComponent,
    MirComponent,
    GoalsWellBeingComponent,
    GeneralViewComponent,
    ViewMirComponent,
    ViewFichaIdentificadorComponent,
    ViewProductComponent,
    ViewParamsComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatTabsModule,
    MatStepperModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyMaskModule,
    MatProgressSpinnerModule,
    ValidateModule,
    WellnessGoalsModule
  ]
})
export class FormModule { }
