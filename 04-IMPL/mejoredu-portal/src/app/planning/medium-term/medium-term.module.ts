import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonAppModule } from '@common/common.module';
import { MediumTermRoutingModule } from './medium-term.routing';
import { MediumTermComponent } from './medium-term.component';



@NgModule({
  declarations: [
    MediumTermComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    MediumTermRoutingModule,
  ],
  exports: [MediumTermComponent]
})
export class MediumTermModule { }
