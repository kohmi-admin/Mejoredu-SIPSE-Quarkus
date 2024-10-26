import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.module.routing';
import { MatButtonModule } from '@angular/material/button';
import { LogoComponent } from './components/logo/logo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonAppModule } from '@common/common.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FloatingWindowModule } from '@common/floating-window/floating-window.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [LoginComponent, LogoComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonAppModule,
    MatProgressSpinnerModule,
    FloatingWindowModule,
    MatTooltipModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule { }
