import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevisionComponent } from './revision.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ProyectsComponent } from './proyects/proyects.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ProductsComponent } from './products/products.component';
import { ValidateModule } from '@common/validate/validate.module';



@NgModule({
  declarations: [
    RevisionComponent,
    ProyectsComponent,
    ActivitiesComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatTabsModule,
    RouterModule,
    MatButtonToggleModule,
    MatCustomTableModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    ValidateModule,
  ]
})
export class RevisionModule { }
