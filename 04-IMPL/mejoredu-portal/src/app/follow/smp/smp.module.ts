import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmpComponent } from './smp.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatCustomTableModule } from '@common/mat-custom-table/mat-custom-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MetaComponent } from './meta/meta.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { ProductsComponent } from './products/products.component';
import { FileManagmentModule } from '@common/file-managment/file-managment.module';



@NgModule({
  declarations: [
    SmpComponent,
    MetaComponent,
    IndicadoresComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatCustomTableModule,
    MatTabsModule,
    FileManagmentModule,
  ]
})
export class SmpModule { }
