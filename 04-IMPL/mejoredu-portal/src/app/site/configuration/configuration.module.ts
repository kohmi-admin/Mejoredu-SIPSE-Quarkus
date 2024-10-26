import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    MatTabsModule,
  ]
})
export class ConfigurationModule { }
