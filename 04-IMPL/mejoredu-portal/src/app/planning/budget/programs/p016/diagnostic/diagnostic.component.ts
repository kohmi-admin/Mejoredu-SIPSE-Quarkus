import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { P016DiagnosticService } from '@common/services/budget/p016/diagnostic.service';
import {
  IItemP016DiagnosticoResponse,
  IP016DiagnosticoPayload,
} from '@common/interfaces/budget/p016/diagnostico.interface';
import { ModalService } from '@common/modal/modal.service';
import { StateViewService } from '../../../services/state-view.service';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { IItemConsultaResponse } from '@common/interfaces/budget/consultas.interface';
import { ReportBuilderComponent } from '@common/report-builder/report-builder.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss'],
})
export class DiagnosticComponent {
  @Input() canNavigate = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  viewType: 'registro' | 'consulta' | 'actualizacion' = 'registro';

  ls = new SecureLS({ encodingType: 'aes' });
  editable = true;
  validation = false;
  consulting = false;
  notifier = new Subject();
  loading: boolean = false;
  dataUser: IDatosUsuario;
  yearNav: string = '';
  idSaveValidar: number = 0;
  isSubmiting: boolean = false;
  selectedFichaP016!: IItemConsultaResponse;
  canEdit: boolean = true;
  selectedAjustesPP!: any;
  selectedValidarPP!: any;

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    public modalService: ModalService,
    private ppConsultasService: PPConsultasService,
    private p016DiagnosticoService: P016DiagnosticService,
    public dialog: MatDialog,
    private alertService: AlertService
  ) {
    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');
    this.canEdit = this.ls.get('canEdit');
    this.editable = this._stateViewService.editable;
    this.validation = this._stateViewService.validation;
    this.consulting = this._stateViewService.consulting;
    this.selectedAjustesPP = this.ls.get('selectedAjustesPP');
    this.selectedValidarPP = this.ls.get('selectedValidarPP');
    if (this.canEdit && this.selectedValidarPP) {
      this.canEdit = false;
    }
    this.createQuestions();
    this.getDiagnosticoPorAnhio();
    this.getPrograma();
    this.form.disable();
  }

  getPrograma() {
    this.ppConsultasService
      .getConsultaPorProgramaYAnhio(this.yearNav, 'P016')
      .then((response) => {
        this.selectedFichaP016 = response;
        if (
          !this.selectedAjustesPP &&
          !this.selectedValidarPP &&
          !this.consulting &&
          (this.selectedFichaP016.estatusGeneral === 'P' ||
            this.selectedFichaP016.estatusGeneral === 'E')
        ) {
          this.alertService.showAlert(
            'El programa Está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
          );
        }
      })
      .catch((err) => {
        this.canEdit = false;
        this.alertService.showAlert(
          `No se ha Registrado un Programa para el Año ${this.yearNav}, vaya a Datos Generales y Guardelo para Poder Continuar.`
        );
      });
  }

  createQuestions() {
    this.questions = [
      new TextareaQuestion({
        idElement: 148,
        nane: 'antecedentes',
        label: 'Antecedentes',
        validators: [Validators.required, Validators.maxLength(3000)],
      }),
      new TextareaQuestion({
        idElement: 149,
        nane: 'estadoActualProblema',
        label: 'Estado Actual del Problema',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 172,
        nane: 'evolucionProblemaPublico',
        label: 'Evolución del Problema Público',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 150,
        nane: 'definicionProblemaPublic',
        label: 'Definicición del Problema Público',
        validators: [Validators.required, Validators.maxLength(300)],
      }),
      new TextareaQuestion({
        idElement: 151,
        nane: 'identificacionCaracterizacionEnfoquePotencial',
        label:
          'Identificación y Caracterización de la Población o Área de Enfoque Potencial',
        validators: [Validators.required, Validators.maxLength(1500)],
      }),
      new TextareaQuestion({
        idElement: 152,
        nane: 'cobertura',
        label: 'Cobertura',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 153,
        nane: 'identificacionCaracterizacionEnfoqueObjetivo',
        label:
          'Identificación y Caracterización de la Población o Área de Enfoque Objetivo',
        validators: [Validators.required, Validators.maxLength(1500)],
      }),
      new TextareaQuestion({
        idElement: 154,
        nane: 'cuantificacionEnfoqueObjetivo',
        label: 'Cuantificación de la población o Área de Enfoque Objetivo',
        validators: [Validators.required, Validators.maxLength(1500)],
      }),
      new TextboxQuestion({
        idElement: 155,
        nane: 'frecuenciaActualizacionPoblacion',
        label:
          'Frecuencia de Actualización de la Población o Área de Enfoque Potencial y Objetivo',
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      new TextareaQuestion({
        idElement: 156,
        nane: 'analisisAlternativas',
        label: 'Análisis de Alternativas',
        validators: [Validators.required, Validators.maxLength(1500)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this.editable) {
      this.form.disable();
    }
  }

  getDiagnosticoPorAnhio() {
    this.p016DiagnosticoService
      .getDiagnosticoPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.idSaveValidar = value.respuesta.idDiagnostico;
          this.uploadDataForm(value.respuesta);
        },
        error: (err) => { },
      });
  }

  uploadDataForm(data: IItemP016DiagnosticoResponse) {
    this.form.get('antecedentes')?.setValue(data.antecedentes);
    this.form.get('estadoActualProblema')?.setValue(data.estadoProblema);
    this.form.get('evolucionProblemaPublico')?.setValue(data.evolucionProblema);
    this.form
      .get('definicionProblemaPublic')
      ?.setValue(data.definicionProblema);
    this.form
      .get('identificacionCaracterizacionEnfoquePotencial')
      ?.setValue(data.identificacionPoblacionPotencial);
    this.form.get('cobertura')?.setValue(data.cobertura);
    this.form
      .get('identificacionCaracterizacionEnfoqueObjetivo')
      ?.setValue(data.identificacionPoblacionObjetivo);
    this.form
      .get('cuantificacionEnfoqueObjetivo')
      ?.setValue(data.cuantificacionPoblacionObjetivo);
    this.form
      .get('frecuenciaActualizacionPoblacion')
      ?.setValue(data.frecuenciaActualizacionPoblacion);
    this.form.get('analisisAlternativas')?.setValue(data.analisisAlternativas);
  }

  async submit() {
    this.isSubmiting = true;
    const formData = this.form.getRawValue();
    const p016Diagnostico: IP016DiagnosticoPayload = {
      anho: parseInt(this.yearNav),
      cveUsuario: this.dataUser.cveUsuario,
      antecedentes: formData.antecedentes,
      estadoProblema: formData.estadoActualProblema,
      evolucionProblema: formData.evolucionProblemaPublico,
      definicionProblema: formData.definicionProblemaPublic,
      identificacionPoblacionPotencial:
        formData.identificacionCaracterizacionEnfoquePotencial,
      cobertura: formData.cobertura,
      identificacionPoblacionObjetivo:
        formData.identificacionCaracterizacionEnfoqueObjetivo,
      cuantificacionPoblacionObjetivo: formData.cuantificacionEnfoqueObjetivo,
      frecuenciaActualizacionPoblacion:
        formData.frecuenciaActualizacionPoblacion,
      analisisAlternativas: formData.analisisAlternativas,
    };
    this.p016DiagnosticoService
      .createDiagnostico(p016Diagnostico)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmiting = false;
          if (value.mensaje.codigo === '200') {
            this.getDiagnosticoPorAnhio();
            this.form.disable();
            this.modalService.openGenericModal({
              idModal: 'modal-disabled',
              component: 'generic',
              data: {
                text: 'Se guardó correctamente.',
                labelBtnPrimary: 'Aceptar',
              },
            });
          }
        },
        error: (error) => {
          this.isSubmiting = false;
        },
      });
  }

  download() {
    const questions: QuestionBase<any>[] = this.questions.map((item) => {
      item.value = this.form.get(item.nane)?.value;
      return item;
    });
    this.dialog.open(ReportBuilderComponent, {
      data: {
        questions,
        reportName: 'Diagnostico',
      },
      width: '1000px',
    });
  }

  update() {
    this.form.enable();
  }

  get disabledBtnEdit(): boolean {
    if (
      this.selectedFichaP016?.estatusGeneral === 'T' ||
      this.selectedFichaP016?.estatusGeneral === 'P' ||
      this.selectedFichaP016?.estatusGeneral === 'E'
    ) {
      return true;
    } else {
      return this.form.enabled;
    }
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
