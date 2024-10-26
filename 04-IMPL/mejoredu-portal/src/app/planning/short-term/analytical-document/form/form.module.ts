import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';

@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
  ]
})
export class FormModule { }
