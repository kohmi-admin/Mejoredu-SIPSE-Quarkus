import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IItmeParamsResponse } from '@common/interfaces/medium-term/params.interface';
import { IGestorResponse } from '@common/interfaces/medium-term/principal.interface';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { ModalService } from '@common/modal/modal.service';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { ParametersService } from '@common/services/medium-term/parameters.service';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import {
  questionsCalculationMethod,
  questionsHistoricalSeries,
  questionsIntermediateGoals,
  questionsMeta,
  questionsValue,
} from 'src/app/planning/medium-term/components/wellness-goals/classes/wellness-goals.class';

@Component({
  selector: 'app-view-params',
  templateUrl: './view-params.component.html',
  styleUrls: ['./view-params.component.scss'],
})
export class ViewParamsComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  columns: TableColumn[] = [
    {
      columnDef: 'nombreParametro',
      header: 'Nombre del Parámetro',
      alignLeft: true,
    },
    { columnDef: 'estatus', header: 'Estatus', width: '110px' },
  ];
  actions: TableActionsI | undefined = {
    view: true,
  };
  dataUser: IDatosUsuario;
  yearNav: string;
  data: any;

  gestorSelected: null | IGestorResponse = null;

  form!: FormGroup;
  questions: QuestionBase<string>[] = [];

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

  constructor(
    private _formBuilder: QuestionControlService,
    private paramService: ParametersService,
    private principalService: PrincipalService,

    public modalService: ModalService,
    private _alertService: AlertService
  ) {
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

    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');

    this.getGestorPorAnhio();
  }

  getGestorPorAnhio() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.gestorSelected = value.respuesta;
            this.getParamsAllByStructure();
          }
        },
        error: (error) => { },
      });
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

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItmeParamsResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
        }, 100);
        break;
    }
  }
}
