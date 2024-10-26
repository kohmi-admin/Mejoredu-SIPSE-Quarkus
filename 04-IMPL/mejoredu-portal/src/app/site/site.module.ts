import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteComponent } from './site.component';
import { SiteRoutingModule } from './site.module.routing';
import { NavComponent } from './nav/nav.component';
import { CommonAppModule } from '@common/common.module';
import { RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { LogoComponent } from './nav/logo/logo.component';
import { MatMenuModule } from '@angular/material/menu';
import { ModulesComponent } from './start/modules/modules.component';
import { FloatingWindowComponent } from './floating-window/floating-window.component';
import { NitificationComponent } from './floating-window/nitification/nitification.component';
import { HelpComponent } from './floating-window/help/help.component';
import { DocumentsComponent } from './floating-window/documents/documents.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SiteComponent,
    NavComponent,
    StartComponent,
    LogoComponent,
    ModulesComponent,
    FloatingWindowComponent,
    NitificationComponent,
    HelpComponent,
    DocumentsComponent,
  ],
  imports: [
    CommonModule,
    SiteRoutingModule,
    CommonAppModule,
    RouterModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ]
})
export class SiteModule { }
