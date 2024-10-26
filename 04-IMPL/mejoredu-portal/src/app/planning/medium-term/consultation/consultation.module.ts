import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationComponent } from './consultation.component';
import { RoutingModule } from './module.routing';
import { UploadPiModule } from '../components/upload-pi/upload-pi.module';



@NgModule({
  declarations: [
    ConsultationComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
    UploadPiModule,
  ]
})
export class ConsultationModule { }
