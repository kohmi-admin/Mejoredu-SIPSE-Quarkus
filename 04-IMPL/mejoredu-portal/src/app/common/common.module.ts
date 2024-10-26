import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ModuleBtnComponent } from './module-btn/module-btn.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynamicFieldComponent } from './form/dynamic-field/dynamic-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionControlService } from './form/services/question-control.service';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LogoComponent } from './header/logo/logo.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericModalComponent } from './modal/components/generic-modal/generic-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalService } from './modal/modal.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { UpdateOutlineGapDirective } from './form/directives/update-outline-gap.directive';
import { ValidateSubmitDirective } from './form/directives/validate-submit.directive';
import { AlfrescoService } from './services/alfresco.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageService } from './message/message.service';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AlertService } from './services/alert.service';
import { TblWidthService } from './services/tbl-width.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GlobalFunctionsService } from "./services/global-functions.service";
import { SafePipe } from './pipes/safe.pipe';
import { StatusPipe } from './pipes/status.pipe';
import { ServicesInterceptor } from './interceptors/services.interceptor';
import { AuthService } from './services/auth.service';
import { ServiceErrorsService } from './services/service-errors.service';
import { ProjectsService } from "./services/projects.service";
import { ProductsService } from "./services/products.service";
import { GoalsService } from "./services/goals.service";
import { ViewerPdfComponent } from './modal/components/viewer-pdf/viewer-pdf.component';
import { ActivitiesService } from './services/activities.service';
import { SelectFilterComponent } from './form/select-filter/select-filter.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { StrategiesService } from './services/strategies.service';
import { ActionsService } from './services/actions.service';
import { TableItemComponent } from './table-item/table-item.component';
import { ResumeComponent } from './resume/resume.component';
import { StepDisableDirective } from './directives/step-disable.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportBuilderComponent } from './report-builder/report-builder.component';
import { P016Service } from './services/seguimientoMirFid/p016.service';
import { EstatuspaaterminadoPipe } from './pipes/estatuspaaterminado.pipe';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    LogoComponent,
    HeaderComponent,
    ModuleBtnComponent,
    DynamicFieldComponent,
    GenericModalComponent,
    FileUploadComponent,
    UpdateOutlineGapDirective,
    ValidateSubmitDirective,
    AlertDialogComponent,
    ConfirmDialogComponent,
    SafePipe,
    StatusPipe,
    ViewerPdfComponent,
    SelectFilterComponent,
    TableItemComponent,
    ResumeComponent,
    StepDisableDirective,
    ReportBuilderComponent,
    EstatuspaaterminadoPipe,
  ],
  imports: [
    CommonModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatRippleModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    AlertService,
    MessageService,
    TblWidthService,
    QuestionControlService,
    ModalService,
    AlfrescoService,
    GlobalFunctionsService,
    ServicesInterceptor,
    AuthService,
    ServiceErrorsService,
    ProjectsService,
    ActivitiesService,
    ProductsService,
    GoalsService,
    StrategiesService,
    ActionsService,
    P016Service,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  exports: [
    MatIconModule,
    FontAwesomeModule,
    MatRippleModule,
    DynamicFieldComponent,
    ModuleBtnComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HeaderComponent,
    MatTooltipModule,
    MatButtonModule,
    FileUploadComponent,
    UpdateOutlineGapDirective,
    ValidateSubmitDirective,
    MatSnackBarModule,
    SafePipe,
    StatusPipe,
    SelectFilterComponent,
    TableItemComponent,
    ResumeComponent,
    StepDisableDirective,
    MatProgressSpinnerModule,
    EstatuspaaterminadoPipe
  ],
})
export class CommonAppModule { }
