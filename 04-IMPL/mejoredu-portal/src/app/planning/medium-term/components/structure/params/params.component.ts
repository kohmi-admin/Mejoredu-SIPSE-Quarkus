import { Component } from '@angular/core';
import { CommonStructure } from '../classes/common-structure.class';
import { TableColumn } from '@common/models/tableColumn';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { FormGroup, Validators } from '@angular/forms';
import { StateViewService } from '../../../services/state-view.service';
import {
  questionsCalculationMethod,
  questionsHistoricalSeries,
  questionsIntermediateGoals,
  questionsMeta,
  questionsValue,
} from '../../wellness-goals/classes/wellness-goals.class';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ModalService } from '@common/modal/modal.service';
import { IItmeParamsResponse } from '@common/interfaces/medium-term/params.interface';
import { ParametersService } from '@common/services/medium-term/parameters.service';
import { AlertService } from '@common/services/alert.service';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import { IGestorResponse } from '@common/interfaces/medium-term/principal.interface';

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss', '../structure.component.scss'],
})
export class ParamsComponent extends CommonStructure {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  override columns: TableColumn[] = [
    {
      columnDef: 'nombreParametro',
      header: 'Nombre del Parámetro',
      alignLeft: true,
    },
    { columnDef: 'estatus', header: 'Estatus', width: '110px' },
  ];
  metaElements!: FormGroup;
  calculationMethod!: FormGroup;
  value!: FormGroup;
  historicalSeries!: FormGroup;
  intermediateGoals!: FormGroup;

  questionsMeta: QuestionBase<any>[] = [];
  questionsCalculationMethod: QuestionBase<any>[] = [];
  questionsValue: QuestionBase<any>[] = [];
  questionsHistoricalSeries: QuestionBase<any>[] = [];
  questionsIntermediateGoals: QuestionBase<any>[] = [];

  loading: boolean = true;
  dataUser: IDatosUsuario;

  disabledSubmiting: boolean = false;
  isSubmiting: boolean = false;
  dataSelected: IItmeParamsResponse | undefined;
  isCleanForm: boolean = false;
  viewType: 'registro' | 'consulta' | 'actualizacion' | 'validar' = 'registro';
  idSaveValidar: number = 0;
  selectedValidatePI: any = null;
  selectedAjustesPI: any = null;
  gestorSelected: null | IGestorResponse = null;
  yearNav: string;
  canEdit: boolean = true;

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    private paramService: ParametersService,
    private principalService: PrincipalService,

    public modalService: ModalService,
    private _alertService: AlertService
  ) {
    super();
    this.selectedValidatePI = this.ls.get('selectedValidatePI');
    this.selectedAjustesPI = this.ls.get('selectedAjustesPI');
    this.canEdit = this.ls.get('canEdit');
    this.viewType = this.ls.get('recordViewType');
    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');
    this.questions = [
      new TextboxQuestion({
        nane: 'Número',
        label: 'Número',
        disabled: true,
        validators: [Validators.required],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.questionsMeta = questionsMeta;
    this.metaElements = this._formBuilder.toFormGroup(this.questionsMeta);
    this.questionsCalculationMethod = questionsCalculationMethod;
    this.calculationMethod = this._formBuilder.toFormGroup(
      this.questionsCalculationMethod
    );
    this.questionsValue = questionsValue;
    this.value = this._formBuilder.toFormGroup(this.questionsValue);
    this.questionsHistoricalSeries = questionsHistoricalSeries;
    this.historicalSeries = this._formBuilder.toFormGroup(
      this.questionsHistoricalSeries
    );
    this.questionsIntermediateGoals = questionsIntermediateGoals;
    this.intermediateGoals = this._formBuilder.toFormGroup(
      this.questionsIntermediateGoals
    );
    if (!this._stateViewService.editable) {
      this.form.disable();
      this.actions = undefined;
      this.editable = false;
    }
    if (!this.canEdit) {
      this.form.disable();
      this.editable = false;
      this.actions = {
        view: true,
      };
    }
    this.validation = this._stateViewService.validation;

    this.getAll();
    this.getGestorPorAnhio();
  }

  questionsToValidate(): QuestionBase<any>[] {
    const newQuestionsMeta = JSON.parse(JSON.stringify(this.questionsMeta));
    newQuestionsMeta[0].idElement = 43;
    newQuestionsMeta[1].idElement = 44;
    newQuestionsMeta[2].idElement = 45;
    newQuestionsMeta[3].idElement = 46;
    newQuestionsMeta[4].idElement = 47;
    newQuestionsMeta[5].idElement = 48;
    newQuestionsMeta[6].idElement = 49;
    newQuestionsMeta[7].idElement = 50;
    newQuestionsMeta[8].idElement = 51;
    newQuestionsMeta[9].idElement = 52;
    newQuestionsMeta[10].idElement = 53;
    newQuestionsMeta[11].idElement = 54;
    newQuestionsMeta[12].idElement = 55;
    newQuestionsMeta[13].idElement = 56;
    newQuestionsMeta[14].idElement = 57;
    newQuestionsMeta[15].idElement = 58;
    newQuestionsMeta[16].idElement = 59;
    newQuestionsMeta[17].idElement = 60;

    const newQuestionsCalculationMethod = JSON.parse(
      JSON.stringify(this.questionsCalculationMethod)
    );
    newQuestionsCalculationMethod[0].idElement = 61;
    newQuestionsCalculationMethod[1].idElement = 62;
    newQuestionsCalculationMethod[2].idElement = 63;
    newQuestionsCalculationMethod[3].idElement = 64;
    newQuestionsCalculationMethod[4].idElement = 65;
    newQuestionsCalculationMethod[5].idElement = 66;
    newQuestionsCalculationMethod[6].idElement = 67;

    const newQuestionsValue = JSON.parse(JSON.stringify(this.questionsValue));
    newQuestionsValue[0].idElement = 68;
    newQuestionsValue[1].idElement = 69;
    newQuestionsValue[2].idElement = 70;
    newQuestionsValue[3].idElement = 71;
    newQuestionsValue[4].idElement = 72;

    const questions: QuestionBase<any>[] = [
      ...newQuestionsMeta,
      ...newQuestionsCalculationMethod,
      ...newQuestionsValue,
      ...[
        new TextboxQuestion({
          idElement: 73,
          nane: 'Serie Histórica',
          label: 'Serie Histórica',
          disabled: true,
          validators: [Validators.required],
        }),
        new TextboxQuestion({
          idElement: 74,
          nane: 'Metas Intermedias',
          label: 'Metas Intermedias',
          disabled: true,
          validators: [Validators.required],
        }),
      ],
    ];
    return questions;
  }

  ngOnInit() {
    this.subscribesForm();
  }

  getActionsTable() {
    const actionsTmp = {
      ...this.actions,
    };
    if (
      this.viewType === 'consulta' ||
      this.viewType === 'validar' ||
      !this.canEdit
    ) {
      actionsTmp.view = true;
      actionsTmp.edit = false;
      actionsTmp.delete = false;
    }
    return actionsTmp;
  }

  subscribesForm() {
    this.metaElements
      .get('periodicidadFrecuenciaMedicion')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value === 711) {
          //FIX: Colocar el codigo de forma constante
          this.metaElements
            .get('especificarPeriodicidadFrecuenciaMedicion')
            ?.enable();
        } else {
          this.metaElements
            .get('especificarPeriodicidadFrecuenciaMedicion')
            ?.setValue('');
          this.metaElements
            .get('especificarPeriodicidadFrecuenciaMedicion')
            ?.disable();
        }
      });
    this.metaElements
      .get('unidadMedida')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value === 723) {
          //FIX: Colocar el codigo de forma constante
          this.metaElements.get('especificarUnidadMedida')?.enable();
        } else {
          this.metaElements.get('especificarUnidadMedida')?.setValue('');
          this.metaElements.get('especificarUnidadMedida')?.disable();
        }
      });
    this.metaElements
      .get('periodoRecoleccionDatos')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value === 726) {
          //FIX: Colocar el codigo de forma constante
          this.metaElements.get('especificarPeriodoRecoleccionDatos')?.enable();
        } else {
          this.metaElements
            .get('especificarPeriodoRecoleccionDatos')
            ?.setValue('');
          this.metaElements
            .get('especificarPeriodoRecoleccionDatos')
            ?.disable();
        }
      });
  }

  getGestorPorAnhio() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (value.respuesta.estatus === 'O') {
              this.canEdit = false;
              this._alertService.showAlert('La Estructura está Aprobada.');
            } else if (
              this.canEdit &&
              value.respuesta.estatus !== 'C' &&
              value.respuesta.estatus !== 'I' &&
              !this.selectedValidatePI &&
              !this.selectedAjustesPI
            ) {
              this.canEdit = false;
              if (value.respuesta.estatus !== 'T') {
                this._alertService.showAlert(
                  'La Estructura está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
                );
              }
            }
            this.gestorSelected = value.respuesta;
            this.getParamsAllByStructure();
          }
        },
        error: (error) => { },
      });
  }

  async getAll(): Promise<void> {
    this.loading = true;
    //this.metaElements.get('objetivoPrioritario')
    this.loading = false;
  }

  getParamsAllByStructure() {
    this.paramService
      .getParamsByIdStructure(this.gestorSelected?.idPrograma ?? 0)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.data = value.respuesta
              .filter((goals) => goals.estatus !== 'B')
              .map((goal) => {
                return {
                  ...goal,
                  nombreParametro: goal.elemento[0]?.nombre,
                  estatus: this.getStatus(goal.estatus),
                };
              });
          } else {
            this.data = [];
          }
        },
      });
  }

  validateWhereComeFrom(idSave: number) {
    this.idSaveValidar = idSave;
  }

  submit() {
    const metaElements = this.metaElements.getRawValue();
    const calculationMethod = this.calculationMethod.getRawValue();
    const value = this.value.getRawValue();
    const historicalSeries = this.historicalSeries.getRawValue();
    const intermediateGoals = this.intermediateGoals.getRawValue();

    let validForm = false;
    if (
      this.metaElements.valid &&
      this.calculationMethod.valid &&
      this.value.valid &&
      this.historicalSeries.valid &&
      this.intermediateGoals.valid
    ) {
      validForm = true;
    }

    this.isSubmiting = true;
    if (!this.dataSelected) {
      const dataCreateGoals = {
        idMetas: 0,
        ixTipo: 2,
        idEstructura: this.gestorSelected?.idPrograma ?? 0,
        cveUsuario: this.dataUser.cveUsuario,
        estatus: validForm ? 'C' : 'I',
        elemento: [
          {
            idObjetivo: metaElements.objetivoPrioritario,
            nombre: metaElements.nombre,
            descripcion: metaElements.definicionDescripcion,
            nivelDesagregacion: metaElements.nivelDesagreacion,
            periodicidad: metaElements.periodicidadFrecuenciaMedicion,
            especificarPeriodicidad:
              metaElements.especificarPeriodicidadFrecuenciaMedicion,
            tipo: metaElements.tipo,
            acumulado: metaElements.acumuladoPeriodico,
            periodoRecoleccion: metaElements.periodoRecoleccionDatos,
            unidadMedida: metaElements.unidadMedida, //COMMENT: cambio, antes catalogoUnidadMedida
            especificarUnidadMedida: metaElements.especificarUnidadMedida,
            especificarPeriodo: metaElements.especificarPeriodoRecoleccionDatos,
            dimensiones: metaElements.dimension,
            disponibilidad: metaElements.disponibilidadInformacion,
            tendencia: metaElements.tendenciaEsperada,
            UnidadResponsable: metaElements.unidadResponsableReportarAvance,
            metodoCalculo: metaElements.metodoCalculo,
            observaciones: metaElements.observaciones,
            unidadResponsable: metaElements.unidadResponsableReportarAvance,
          },
        ],
        aplicacionMetodo: [
          {
            nombreVariable: calculationMethod.varName1,
            valorVariableUno: calculationMethod.valVar1,
            fuenteInformacion: calculationMethod.fuenteInformacionVariable1,
            nombreVariableDos: calculationMethod.varName2,
            valorVariableDos: calculationMethod.valVar2,
            fuenteInformacionDos: calculationMethod.fuenteInformacionVariable2,
            sustitucion: calculationMethod.sustutucionMetodoCalculoIndicador,
          },
        ],
        valorLineaBase: [
          {
            valor: value.valor,
            anhio: value.anhio,
            notas: value.notasSobreLineaBase,
            meta: value.meta,
            //COMMENT: FALTA LAS NOTAS DE LA META
          },
        ],
        serieHistorica: [
          {
            tipo: '1',
            anhio: historicalSeries.date1 || 0,
            descripcion: historicalSeries.percent1,
          },
          {
            tipo: '1',
            anhio: historicalSeries.date2 || 0,
            descripcion: historicalSeries.percent2,
          },
          {
            tipo: '1',
            anhio: historicalSeries.date3 || 0,
            descripcion: historicalSeries.percent3,
          },
          {
            tipo: '1',
            anhio: historicalSeries.date4 || 0,
            descripcion: historicalSeries.percent4,
          },
          {
            tipo: '1',
            anhio: historicalSeries.date5 || 0,
            descripcion: historicalSeries.percent5,
          },
          {
            tipo: '1',
            anhio: historicalSeries.date6 || 0,
            descripcion: historicalSeries.percent6,
          },
          {
            tipo: '1',
            anhio: historicalSeries.date7 || 0,
            descripcion: historicalSeries.percent7,
          },
        ],
        metasIntermedias: [
          {
            tipo: '2',
            anhio: intermediateGoals.date1 || 0,
            descripcion: intermediateGoals.percent1,
          },
          {
            tipo: '2',
            anhio: intermediateGoals.date2 || 0,
            descripcion: intermediateGoals.percent2,
          },
          {
            tipo: '2',
            anhio: intermediateGoals.date3 || 0,
            descripcion: intermediateGoals.percent3,
          },
          {
            tipo: '2',
            anhio: intermediateGoals.date4 || 0,
            descripcion: intermediateGoals.percent4,
          },
          {
            tipo: '2',
            anhio: intermediateGoals.date5 || 0,
            descripcion: intermediateGoals.percent5,
          },
          {
            tipo: '2',
            anhio: intermediateGoals.date6 || 0,
            descripcion: intermediateGoals.percent6,
          },
          {
            tipo: '2',
            anhio: intermediateGoals.date7 || 0,
            descripcion: intermediateGoals.percent7,
          },
        ],
      };
      this.paramService
        .createParams(dataCreateGoals)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.getParamsAllByStructure();
              this.resetAllForm();
              this.dataSelected = undefined;
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
    } else {
      const dataUpdateGoals = {
        idMetas: this.dataSelected.idMetas,
        ixTipo: 2,
        idEstructura: this.dataSelected.idEstructura,
        cveUsuario: this.dataUser.cveUsuario,
        estatus: validForm ? 'C' : 'I',
        elemento: [
          {
            idElemento: this.dataSelected.elemento[0]?.idElemento,
            idObjetivo: metaElements.objetivoPrioritario,
            nombre: metaElements.nombre,
            descripcion: metaElements.definicionDescripcion,
            nivelDesagregacion: metaElements.nivelDesagreacion,
            periodicidad: metaElements.periodicidadFrecuenciaMedicion,
            especificarPeriodicidad:
              metaElements.especificarPeriodicidadFrecuenciaMedicion,
            tipo: metaElements.tipo,
            acumulado: metaElements.acumuladoPeriodico,
            periodoRecoleccion: metaElements.periodoRecoleccionDatos,
            unidadMedida: metaElements.unidadMedida, //COMMENT: cambio, antes catalogoUnidadMedida
            especificarUnidadMedida: metaElements.especificarUnidadMedida,
            especificarPeriodo: metaElements.especificarPeriodoRecoleccionDatos,
            dimensiones: metaElements.dimension,
            disponibilidad: metaElements.disponibilidadInformacion,
            tendencia: metaElements.tendenciaEsperada,
            UnidadResponsable: metaElements.unidadResponsableReportarAvance,
            metodoCalculo: metaElements.metodoCalculo,
            observaciones: metaElements.observaciones,
            unidadResponsable: metaElements.unidadResponsableReportarAvance,
          },
        ],
        aplicacionMetodo: [
          {
            idAplicacion: this.dataSelected.aplicacionMetodo[0]?.idAplicacion,
            nombreVariable: calculationMethod.varName1,
            valorVariableUno: calculationMethod.valVar1,
            fuenteInformacion: calculationMethod.fuenteInformacionVariable1,
            nombreVariableDos: calculationMethod.varName2,
            valorVariableDos: calculationMethod.valVar2,
            fuenteInformacionDos: calculationMethod.fuenteInformacionVariable2,
            sustitucion: calculationMethod.sustutucionMetodoCalculoIndicador,
          },
        ],
        valorLineaBase: [
          {
            idLinea: this.dataSelected.valorLineaBase[0]?.idLinea,
            valor: value.valor,
            anhio: value.anhio,
            notas: value.notasSobreLineaBase,
            meta: value.meta,
            idMeta:
              this.dataSelected.valorLineaBase[0]?.idMeta ||
              this.dataSelected.idMetas,
          },
        ],
        serieHistorica: [
          {
            idMeta:
              this.dataSelected.serieHistorica[0]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.serieHistorica[0]?.idSerie || null,
            tipo: '1',
            anhio: historicalSeries.date1 || 0,
            descripcion: historicalSeries.percent1,
          },
          {
            idMeta:
              this.dataSelected.serieHistorica[1]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.serieHistorica[1]?.idSerie || null,
            tipo: '1',
            anhio: historicalSeries.date2 || 0,
            descripcion: historicalSeries.percent2,
          },
          {
            idMeta:
              this.dataSelected.serieHistorica[2]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.serieHistorica[2]?.idSerie || null,
            tipo: '1',
            anhio: historicalSeries.date3 || 0,
            descripcion: historicalSeries.percent3,
          },
          {
            idMeta:
              this.dataSelected.serieHistorica[3]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.serieHistorica[3]?.idSerie || null,
            tipo: '1',
            anhio: historicalSeries.date4 || 0,
            descripcion: historicalSeries.percent4,
          },
          {
            idMeta:
              this.dataSelected.serieHistorica[4]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.serieHistorica[4]?.idSerie || null,
            tipo: '1',
            anhio: historicalSeries.date5 || 0,
            descripcion: historicalSeries.percent5,
          },
          {
            idMeta:
              this.dataSelected.serieHistorica[5]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.serieHistorica[5]?.idSerie || null,
            tipo: '1',
            anhio: historicalSeries.date6 || 0,
            descripcion: historicalSeries.percent6,
          },
          {
            idMeta:
              this.dataSelected.serieHistorica[6]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.serieHistorica[6]?.idSerie || null,
            tipo: '1',
            anhio: historicalSeries.date7 || 0,
            descripcion: historicalSeries.percent7,
          },
        ],
        metasIntermedias: [
          {
            idMeta:
              this.dataSelected.metasIntermedias[0]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.metasIntermedias[0]?.idSerie || null,
            tipo: '2',
            anhio: intermediateGoals.date1 || 0,
            descripcion: intermediateGoals.percent1,
          },
          {
            idMeta:
              this.dataSelected.metasIntermedias[1]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.metasIntermedias[1]?.idSerie || null,
            tipo: '2',
            anhio: intermediateGoals.date2 || 0,
            descripcion: intermediateGoals.percent2,
          },
          {
            idMeta:
              this.dataSelected.metasIntermedias[2]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.metasIntermedias[2]?.idSerie || null,
            tipo: '2',
            anhio: intermediateGoals.date3 || 0,
            descripcion: intermediateGoals.percent3,
          },
          {
            idMeta:
              this.dataSelected.metasIntermedias[3]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.metasIntermedias[3]?.idSerie || null,
            tipo: '2',
            anhio: intermediateGoals.date4 || 0,
            descripcion: intermediateGoals.percent4,
          },
          {
            idMeta:
              this.dataSelected.metasIntermedias[4]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.metasIntermedias[4]?.idSerie || null,
            tipo: '2',
            anhio: intermediateGoals.date5 || 0,
            descripcion: intermediateGoals.percent5,
          },
          {
            idMeta:
              this.dataSelected.metasIntermedias[5]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.metasIntermedias[5]?.idSerie || null,
            tipo: '2',
            anhio: intermediateGoals.date6 || 0,
            descripcion: intermediateGoals.percent6,
          },
          {
            idMeta:
              this.dataSelected.metasIntermedias[6]?.idMeta ||
              this.dataSelected.idMetas,
            idSerie: this.dataSelected.metasIntermedias[6]?.idSerie || null,
            tipo: '2',
            anhio: intermediateGoals.date7 || 0,
            descripcion: intermediateGoals.percent7,
          },
        ],
      };
      this.paramService
        .updateParam(0, dataUpdateGoals)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.getParamsAllByStructure();
              this.newParam();
              this.dataSelected = undefined;
              this.modalService.openGenericModal({
                idModal: 'modal-disabled',
                component: 'generic',
                data: {
                  text: 'Se modificó correctamente.',
                  labelBtnPrimary: 'Aceptar',
                },
              });
            } else {
              this.modalService.openGenericModal({
                idModal: 'modal-disabled',
                component: 'generic',
                data: {
                  text: 'Error al modificar, intente más tarde.',
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
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItmeParamsResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.formsDisabled();
          this.disabledSubmiting = true;
          if (
            this.viewType === 'validar' ||
            this.viewType === 'actualizacion'
          ) {
            this.validateWhereComeFrom(dataAction.idMetas);
          }
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this.dataSelected = dataAction;
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.disabledSubmiting = false;
          if (
            this.viewType === 'validar' ||
            this.viewType === 'actualizacion'
          ) {
            this.validateWhereComeFrom(dataAction.idMetas);
          }
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Parametro?',
          });
          if (confirm) {
            this.paramService
              .deleteParam(dataAction.idMetas, this.dataUser.cveUsuario)
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this.modalService.openGenericModal({
                      idModal: 'modal-disabled',
                      component: 'generic',
                      data: {
                        text: 'Se eliminó correctamente.',
                        labelBtnPrimary: 'Aceptar',
                      },
                    });
                    this.getParamsAllByStructure();
                    this.newParam();
                  }
                },
                error: (err) => {
                  this.isSubmiting = false;
                },
              });
          }
        }
        break;
    }
  }

  uploadDataToForm(dataAction: IItmeParamsResponse) {
    this.metaElements.controls['nombre'].setValue(
      dataAction.elemento[0]?.nombre
    );
    this.metaElements.controls['objetivoPrioritario'].setValue(
      dataAction.elemento[0]?.idObjetivo
    );
    this.metaElements.controls['definicionDescripcion'].setValue(
      dataAction.elemento[0]?.descripcion
    );
    this.metaElements.controls['nivelDesagreacion'].setValue(
      dataAction.elemento[0]?.nivelDesagregacion
    );
    this.metaElements.controls['periodicidadFrecuenciaMedicion'].setValue(
      dataAction.elemento[0]?.periodicidad
    );
    this.metaElements.controls[
      'especificarPeriodicidadFrecuenciaMedicion'
    ].setValue(dataAction.elemento[0]?.especificarPeriodicidad);
    this.metaElements.controls['tipo'].setValue(dataAction.elemento[0]?.tipo);
    this.metaElements.controls['unidadMedida'].setValue(
      dataAction.elemento[0]?.unidadMedida
    );
    this.metaElements.controls['especificarUnidadMedida'].setValue(
      dataAction.elemento[0]?.especificarUnidadMedida
    );
    this.metaElements.controls['acumuladoPeriodico'].setValue(
      dataAction.elemento[0]?.acumulado
    );
    this.metaElements.controls['periodoRecoleccionDatos'].setValue(
      dataAction.elemento[0]?.periodoRecoleccion
    );
    this.metaElements.controls['especificarPeriodoRecoleccionDatos'].setValue(
      dataAction.elemento[0]?.especificarPeriodo
    );
    this.metaElements.controls['dimension'].setValue(
      dataAction.elemento[0]?.dimensiones
    );
    this.metaElements.controls['disponibilidadInformacion'].setValue(
      dataAction.elemento[0]?.disponibilidad
    );
    this.metaElements.controls['tendenciaEsperada'].setValue(
      dataAction.elemento[0]?.tendencia
    );
    this.metaElements.controls['unidadResponsableReportarAvance'].setValue(
      dataAction.elemento[0]?.unidadResponsable
    );
    this.metaElements.controls['metodoCalculo'].setValue(
      dataAction.elemento[0]?.metodoCalculo
    );
    this.metaElements.controls['observaciones'].setValue(
      dataAction.elemento[0]?.observaciones
    );

    this.calculationMethod.controls['varName1'].setValue(
      dataAction.aplicacionMetodo[0]?.nombreVariable
    );
    this.calculationMethod.controls['valVar1'].setValue(
      dataAction.aplicacionMetodo[0]?.valorVariableUno
    );
    this.calculationMethod.controls['fuenteInformacionVariable1'].setValue(
      dataAction.aplicacionMetodo[0]?.fuenteInformacion
    );
    this.calculationMethod.controls['varName2'].setValue(
      dataAction.aplicacionMetodo[0]?.nombreVariableDos
    );
    this.calculationMethod.controls['valVar2'].setValue(
      dataAction.aplicacionMetodo[0]?.valorVariableDos
    );
    this.calculationMethod.controls['fuenteInformacionVariable2'].setValue(
      dataAction.aplicacionMetodo[0]?.fuenteInformacionDos
    );
    this.calculationMethod.controls[
      'sustutucionMetodoCalculoIndicador'
    ].setValue(dataAction.aplicacionMetodo[0]?.sustitucion);

    this.value.controls['valor'].setValue(dataAction.valorLineaBase[0]?.valor);
    this.value.controls['anhio'].setValue(dataAction.valorLineaBase[0]?.anhio);
    this.value.controls['notasSobreLineaBase'].setValue(
      dataAction.valorLineaBase[0]?.notas
    );
    this.value.controls['meta'].setValue(dataAction.valorLineaBase[0]?.meta);
    this.value.controls['notasSobreMeta'].setValue(
      dataAction.valorLineaBase[0]?.notas
    ); //FIX:

    this.historicalSeries.controls['date1'].setValue(
      dataAction.serieHistorica[0]?.anhio
    );
    this.historicalSeries.controls['date2'].setValue(
      dataAction.serieHistorica[1]?.anhio
    );
    this.historicalSeries.controls['date3'].setValue(
      dataAction.serieHistorica[2]?.anhio
    );
    this.historicalSeries.controls['date4'].setValue(
      dataAction.serieHistorica[3]?.anhio
    );
    this.historicalSeries.controls['date5'].setValue(
      dataAction.serieHistorica[4]?.anhio
    );
    this.historicalSeries.controls['date6'].setValue(
      dataAction.serieHistorica[5]?.anhio
    );
    this.historicalSeries.controls['date7'].setValue(
      dataAction.serieHistorica[6]?.anhio
    );
    this.historicalSeries.controls['percent1'].setValue(
      dataAction.serieHistorica[0]?.descripcion
    );
    this.historicalSeries.controls['percent2'].setValue(
      dataAction.serieHistorica[1]?.descripcion
    );
    this.historicalSeries.controls['percent3'].setValue(
      dataAction.serieHistorica[2]?.descripcion
    );
    this.historicalSeries.controls['percent4'].setValue(
      dataAction.serieHistorica[3]?.descripcion
    );
    this.historicalSeries.controls['percent5'].setValue(
      dataAction.serieHistorica[4]?.descripcion
    );
    this.historicalSeries.controls['percent6'].setValue(
      dataAction.serieHistorica[5]?.descripcion
    );
    this.historicalSeries.controls['percent7'].setValue(
      dataAction.serieHistorica[6]?.descripcion
    );

    this.intermediateGoals.controls['date1'].setValue(
      dataAction.metasIntermedias[0]?.anhio
    );
    this.intermediateGoals.controls['date2'].setValue(
      dataAction.metasIntermedias[1]?.anhio
    );
    this.intermediateGoals.controls['date3'].setValue(
      dataAction.metasIntermedias[2]?.anhio
    );
    this.intermediateGoals.controls['date4'].setValue(
      dataAction.metasIntermedias[3]?.anhio
    );
    this.intermediateGoals.controls['date5'].setValue(
      dataAction.metasIntermedias[4]?.anhio
    );
    this.intermediateGoals.controls['date6'].setValue(
      dataAction.metasIntermedias[5]?.anhio
    );
    this.intermediateGoals.controls['date7'].setValue(
      dataAction.metasIntermedias[6]?.anhio
    );
    this.intermediateGoals.controls['percent1'].setValue(
      dataAction.metasIntermedias[0]?.descripcion
    );
    this.intermediateGoals.controls['percent2'].setValue(
      dataAction.metasIntermedias[1]?.descripcion
    );
    this.intermediateGoals.controls['percent3'].setValue(
      dataAction.metasIntermedias[2]?.descripcion
    );
    this.intermediateGoals.controls['percent4'].setValue(
      dataAction.metasIntermedias[3]?.descripcion
    );
    this.intermediateGoals.controls['percent5'].setValue(
      dataAction.metasIntermedias[4]?.descripcion
    );
    this.intermediateGoals.controls['percent6'].setValue(
      dataAction.metasIntermedias[5]?.descripcion
    );
    this.intermediateGoals.controls['percent7'].setValue(
      dataAction.metasIntermedias[6]?.descripcion
    );
  }

  getStatus(status: string) {
    let returnStatus = '';
    switch (status) {
      case 'A':
        returnStatus = 'Activo';
        break;
      case 'I':
        returnStatus = 'Incompleto';
        break;
      case 'C':
        returnStatus = 'Completo';
        break;

      default:
        break;
    }
    return returnStatus;
  }

  newParam() {
    this.formsEnable();
    this.resetAllForm();
    this.isCleanForm = false;
    this.dataSelected = undefined;
  }

  formsDisabled() {
    this.metaElements.disable();
    this.calculationMethod.disable();
    this.value.disable();
    this.historicalSeries.disable();
    this.intermediateGoals.disable();
  }

  formsEnable() {
    this.metaElements.enable();
    this.calculationMethod.enable();
    this.value.enable();
    this.historicalSeries.enable();
    this.intermediateGoals.enable();
  }

  resetAllForm() {
    this.form.reset();
    this.metaElements.reset();
    this.calculationMethod.reset();
    this.value.reset();
    this.historicalSeries.reset();
    this.intermediateGoals.reset();
    this.disabledSubmiting = false;
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
