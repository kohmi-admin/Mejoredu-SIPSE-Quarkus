import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkSpaceComponent } from './work-space.component';
import { CommonAppModule } from '@common/common.module';
import { RoutingModule } from './module.routing';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [
    WorkSpaceComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
    CommonAppModule,
  ]
})
export class WorkSpaceModule { }
