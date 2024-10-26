import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectsComponent } from './proyects/proyects.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ProductsComponent } from './products/products.component';
import { MetaComponent } from './proyects/meta/meta.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NoProgramadosComponent } from './proyects/no-programados/no-programados.component';
import { AvanceComponent } from './avance/avance.component';
import { MatSelectModule } from '@angular/material/select';
import { MetaNoEditableComponent } from './proyects/MetaNoEditable/meta-no-editable/meta-no-editable.component';



@NgModule({
  declarations: [
    RegistroComponent,
    ProyectsComponent,
    ActivitiesComponent,
    ProductsComponent,
    MetaComponent,
    NoProgramadosComponent,
    AvanceComponent,
    MetaNoEditableComponent,
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
    MatDialogModule,
  ]
})
export class RegistroModule { }
