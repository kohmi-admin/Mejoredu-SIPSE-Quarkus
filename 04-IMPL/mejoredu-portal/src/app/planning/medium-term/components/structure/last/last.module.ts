import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastComponent } from './last.component';
import { UploadPiModule } from '../../upload-pi/upload-pi.module';
import { CommonAppModule } from '@common/common.module';
import { RouterModule } from '@angular/router';
import { RoutingModule } from './module.routing';



@NgModule({
  declarations: [
    LastComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RoutingModule,
    UploadPiModule,
    RouterModule,
  ]
})
export class LastModule { }
