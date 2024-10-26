import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GeneralDataIndicatorComponent } from './general-data-indicator/general-data-indicator.component';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { StateViewService } from '../../../services/state-view.service';
import { RegistryIndicatorsTabComponent } from './registry-indicators-tab/registry-indicators-tab.component';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { P016MirService } from '@common/services/budget/p016/mir.service';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
import {
  IItemP016MIRMatriz,
  IRegisterMIR,
} from '@common/interfaces/budget/p016/mir.interface';
import { AddIndicatorComponent } from './add-indicator/add-indicator.component';
import { MatrixI } from './interfaces/matrix.interface';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { AlertService } from '@common/services/alert.service';
import { Router } from '@angular/router';
import { IItemConsultaResponse } from '@common/interfaces/budget/consultas.interface';
import { ModalService } from '@common/modal/modal.service';
import { GenerateXLSXService } from '@common/report-builder/services/generate-xlsx.service';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss'],
})
export class MatrixComponent implements OnDestroy {
  table: IItemP016MIRMatriz[] = [];
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  editable = true;
  editing = false;
  validation = false;
  consulting = false;
  loading: boolean = false;
  isSubmitingFinalize: boolean = false;
  isSubmitingSend: boolean = false;
  idSaveValidar: number = 0;
  notifier = new Subject();
  ls = new SecureLS({ encodingType: 'aes' });
  yearNav: string = '';
  dataUser: IDatosUsuario;
  selectedFichaP016!: IItemConsultaResponse;
  canEdit: boolean = true;
  fichasComplete: boolean = true;
  selectedAjustesPP!: any;
  selectedValidarPP!: any;
  @ViewChild('tbl') tbl!: ElementRef;
  data: MatrixI[] = [
    {
      nivel: 'Fin',
      clave: 'F1',
      resumenNarrativo:
        'Contribuir a la garantía del derecho a una educación de excelencia con equidad a través del impulso a la mejora continua de la educación',
      nombreDelIndicador:
        'Cambio en el porcentaje de personas entre 20 y 24 años  de edad que cuentan con al menos la Educación Media Superior completa',
      mediosDeVerificacion:
        'Indicadores nacionales para la mejora continua de la educación en México 2026. Publicación anual generada y resguardada por la Unidad de Apoyo y Seguimiento a la Mejora Continua e Innovación Educativa de Mejoredu',
      supuestos:
        'En el país existen condiciones políticas, institucionales y técnicas que permiten la igualdad social en el acceso a la educación en todos los niveles educativos',
    },
    {
      nivel: 'Propósito',
      clave: 'P1',
      resumenNarrativo:
        'Las autoridades educativas (federal y locales) promueven de manera eficaz la mejora continua de la educación',
      nombreDelIndicador:
        'Porcentaje de autoridades educativas (federal y locales) que promueven de manera eficaz la mejora continua de la educación.',
      mediosDeVerificacion:
        'Porcentaje de autoridades educativas (federal y locales) que promueven de manera eficaz la mejora continua de la educación.',
      supuestos:
        'En el país existen condiciones políticas, institucionales y técnicas que permiten la igualdad social en el acceso a la educación en todos los niveles educativos',
    },
    {
      nivel: 'Componente',
      clave: 'C1',
      resumenNarrativo:
        'Oferta de Estudios, investigaciones especializadas y evaluaciones para la mejora de la educación fortalecida',
      nombreDelIndicador:
        'Porcentaje de la oferta de estudios, investigaciones especializadas y evaluaciones para la mejora de la educación fortalecida',
      mediosDeVerificacion:
        'Porcentaje de autoridades educativas (federal y locales) que promueven de manera eficaz la mejora continua de la educación.',
      supuestos:
        'En el país existen condiciones políticas, institucionales y técnicas que permiten la igualdad social en el acceso a la educación en todos los niveles educativos',
    },
    {
      nivel: 'Actividades',
      clave: 'A1.1',
      resumenNarrativo:
        'Elaboración de instrumentos de los estudios, investigaciones especializadas, y evaluaciones para la mejora educativa',
      nombreDelIndicador: '',
      mediosDeVerificacion: '',
      supuestos: '',
    },
  ];

  constructor(
    public dialog: MatDialog,
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    private pPConsultasService: PPConsultasService,
    private alertService: AlertService,
    private router: Router,
    private p016MirService: P016MirService,
    private ppConsultasService: PPConsultasService,
    private generateXLSXService: GenerateXLSXService,
    public modalService: ModalService
  ) {
    this.editable = this._stateViewService.editable;
    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');
    this.editable = this.ls.get('canEdit');
    this.editable = this._stateViewService.editable;
    this.validation = this._stateViewService.validation;
    this.consulting = this._stateViewService.consulting;
    this.selectedAjustesPP = this.ls.get('selectedAjustesPP');
    this.selectedValidarPP = this.ls.get('selectedValidarPP');
    if (this.canEdit && this.selectedValidarPP) {
      this.canEdit = false;
    }
    this.createQuestions();
    this.getPrograma();
    this.getAll();
  }

  getTextAreaHeight(e: HTMLTextAreaElement) {
    e.style.height = e.scrollHeight - 0 + 'px';
  }

  autoGrowTextZone(e: HTMLTextAreaElement) {
    e.style.height = '0px';
    e.style.height = e.scrollHeight - 0 + 'px';
  }

  createQuestions() {
    this.questions = [
      new TextareaQuestion({
        idElement: 165,
        nane: 'Nivel',
        label: 'Nivel',
        validators: [Validators.required, Validators.maxLength(3000)],
      }),
      new TextareaQuestion({
        idElement: 166,
        nane: 'Clave',
        label: 'Clave',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 167,
        nane: 'Resumen Narrativo',
        label: 'Resumen Narrativo',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 168,
        nane: 'Nombre del Indicador',
        label: 'Nombre del Indicador',
        validators: [Validators.required, Validators.maxLength(300)],
      }),
      new TextareaQuestion({
        idElement: 169,
        nane: 'Medios de Verificación',
        label: 'Medios de Verificación',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 170,
        nane: 'Supuestos',
        label: 'Supuestos',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 171,
        nane: 'Ficha FID',
        label: 'Ficha FID',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this.editable) {
      this.form.disable();
    }
  }

  getAll() {
    this.loading = true;
    this.getMirPorAnhio();
    this.loading = false;
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
            'El programa está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
          );
        }
      })
      .catch((error) => {
        this.canEdit = false;
        this.alertService.showAlert(
          `No se ha Registrado un Programa para el Año ${this.yearNav}, vaya a Datos Generales y Guardelo para Poder Continuar.`
        );
      });
  }

  getMirPorAnhio() {
    this.p016MirService
      .getMirPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const matriz = value.respuesta.matriz;
            this.idSaveValidar = value.respuesta.idMir;
            this.table = matriz.sort((a, b) => {
              const order = ['Fin', 'Propósito', 'Componente', 'Actividad'];
              return order.indexOf(a.nivel) - order.indexOf(b.nivel);
            });
            setTimeout(() => {
              const $textareas = document.querySelectorAll('textarea');
              $textareas.forEach((item) => {
                item.style.minHeight = item.scrollHeight + 0 + 'px';
              });
            }, 100);
            const validation = (item) => item.idFichaIndicador === null;
            this.fichasComplete = !matriz.some(validation);
          }
        },
      });
  }

  registerMirPorAnhio() {
    const data: IRegisterMIR = {
      idAnhio: Number(this.yearNav),
      matriz: this.table,
    };
    this.p016MirService
      .registerMirPorAnhio(data)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.editing = false;
          this.modalService.openGenericModal({
            idModal: 'modal-disabled',
            component: 'generic',
            data: {
              text: 'Se guardó correctamente.',
              labelBtnPrimary: 'Aceptar',
            },
          });
        },
      });
  }

  openDialog(data: IItemP016MIRMatriz) {
    const dialogRef = this.dialog.open(GeneralDataIndicatorComponent, {
      data: {
        data,
        canEdit: this.canEdit && this.editing,
      },
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getMirPorAnhio();
      }
    });
  }

  async addIndicator(index: number, indicator: IItemP016MIRMatriz) {
    const data = indicator;
    const result = await lastValueFrom(
      this.dialog
        .open(AddIndicatorComponent, {
          data: {
            allItems: this.table,
            data,
            index,
            year: this.yearNav,
          },
          width: '800px',
        })
        .afterClosed()
    );
    if (result) {
      this.getAll();
    }
  }

  openDialogRegistryIndicators(name: string) {
    const data = {
      name,
    };
    this.dialog.open(RegistryIndicatorsTabComponent, {
      data,
      width: '800px',
    });
  }

  get disableFinish(): boolean {
    return (
      this.selectedFichaP016?.estatusGeneral === 'T' ||
      this.selectedFichaP016?.estatusGeneral === 'P' ||
      this.selectedFichaP016?.estatusGeneral === 'E'
    );
  }

  get disableSend(): boolean {
    return this.selectedFichaP016?.estatusGeneral !== 'T';
  }

  finalize() {
    if (this.fichasComplete) {
      if (this.selectedFichaP016) {
        this.isSubmitingFinalize = true;
        this.pPConsultasService
          .finalizarRegistro(
            this.selectedFichaP016?.idProgramaPresupuestal ?? 0,
            this.dataUser.cveUsuario
          )
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmitingFinalize = false;
              if (value.mensaje.codigo === '200') {
                this.getPrograma();
              }
            },
            error: (err) => {
              this.isSubmitingFinalize = false;
            },
          });
      }
    } else {
      this.alertService.showAlert(
        'Para Finalizar el Registro Primero debe de Registrar Todas las Fichas.'
      );
    }
  }

  send() {
    if (this.selectedFichaP016) {
      this.isSubmitingSend = true;
      this.pPConsultasService
        .enviarARevison(
          this.selectedFichaP016?.idProgramaPresupuestal ?? 0,
          this.dataUser.cveUsuario
        )
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmitingSend = false;
            if (value.mensaje.codigo === '200') {
              this.alertService.showAlert('Se envió a Revisión con Éxito.');
              this.router.navigate([
                '/Planeación/Programas Presupuestarios/Actualización',
              ]);
            }
          },
          error: (err) => {
            this.isSubmitingSend = false;
          },
        });
    }
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  get disabledBtnEdit(): boolean {
    if (
      this.selectedFichaP016?.estatusGeneral === 'T' ||
      this.selectedFichaP016?.estatusGeneral === 'P' ||
      this.selectedFichaP016?.estatusGeneral === 'E'
    ) {
      return true;
    } else {
      return this.editing;
    }
  }

  ngOnDestroy() {
    this.notifier.complete();
  }

  descargar() {
    this.generateXLSXService.exportExcel(
      'Matríz de Indicadores para Resultados',
      [
        {
          name: 'doc1',
          item: this.tbl,
        },
      ]
    );
  }
}
