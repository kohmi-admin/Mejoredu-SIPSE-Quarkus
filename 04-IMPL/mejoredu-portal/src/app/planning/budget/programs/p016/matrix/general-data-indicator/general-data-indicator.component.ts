import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  IIndicador,
  IItemP016MIRMatriz,
} from '@common/interfaces/budget/p016/mir.interface';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { ReportBuilderComponent } from '@common/report-builder/report-builder.component';
import { P016MirService } from '@common/services/budget/p016/mir.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IProps {
  data: IItemP016MIRMatriz;
  canEdit: boolean;
}

@Component({
  selector: 'app-general-data-indicator',
  templateUrl: './general-data-indicator.component.html',
  styleUrls: ['./general-data-indicator.component.scss'],
})
export class GeneralDataIndicatorComponent {
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  notifier = new Subject();
  dataMatriz: IItemP016MIRMatriz;
  canEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<GeneralDataIndicatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProps,
    private _formBuilder: QuestionControlService,
    private catalogService: CatalogsService,
    private dialog: MatDialog,
    private p016MirService: P016MirService
  ) {
    this.dataMatriz = data.data;
    this.questions = [
      new TextboxQuestion({
        nane: 'nombreIndicador',
        label: 'Nombre del Indicador',
        disabled: true,
        value: this.dataMatriz.nombreIndicador,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        nane: 'idDimensionMedicion',
        label: 'Dimensión a Medir',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Eficiencia',
          },
          {
            id: 2,
            value: 'Eficacia',
          },
          {
            id: 3,
            value: 'Calidad',
          },
          {
            id: 4,
            value: 'Economía',
          },
        ],
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        nane: 'idTipoIndicador',
        label: 'Tipo de Indicador para Resultados',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Estratégico',
          },
          {
            id: 2,
            value: 'Gestión',
          },
        ],
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'definicionIndicador',
        label: 'Definición del Indicador',
      }),

      new TextboxQuestion({
        nane: 'metodoCalculo',
        label: 'Método de Cálculo del Indicador',
      }),

      new DropdownQuestion({
        nane: 'idUnidadMedida',
        label: 'Unidad de Medida',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Procenaje',
          },
          {
            id: 2,
            value: 'Tasa de Variación',
          },
          {
            id: 3,
            value: 'Promedio',
          },
          {
            id: 4,
            value: 'Números Índice',
          },
          {
            id: 5,
            value: 'Otro',
          },
        ],
      }),

      new TextboxQuestion({
        nane: 'unidadMedidaDescubrir',
        label: 'Describir',
        disabled: true,
        validators: [Validators.maxLength(20)],
      }),

      new TextboxQuestion({
        nane: 'unidadAbsoluta',
        label: 'Unidad Absoluta',
        validators: [Validators.maxLength(50)],
      }),

      new DropdownQuestion({
        nane: 'idTipoMedicion',
        label: 'Tipo de Medición',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Porcentual',
          },
          {
            id: 2,
            value: 'Otro',
          },
        ],
      }),

      new TextboxQuestion({
        nane: 'tipoMedicionDescubrir',
        label: 'Describir',
        disabled: true,
        validators: [Validators.maxLength(20)],
      }),

      new DropdownQuestion({
        nane: 'idFrecuenciaMedicion',
        label: 'Frecuencia de Medición',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Mensual',
          },
          {
            id: 2,
            value: 'Bimestral',
          },
          {
            id: 3,
            value: 'Trimestral',
          },
          {
            id: 4,
            value: 'Semestral',
          },
          {
            id: 5,
            value: 'Anual',
          },
          {
            id: 6,
            value: 'Otro',
          },
        ],
      }),

      new TextboxQuestion({
        nane: 'frecuenciaMedicionDescubrir',
        label: 'Describir',
        disabled: true,
        validators: [Validators.maxLength(20)],
      }),

      new TextboxQuestion({
        nane: 'numerador',
        label: 'Numerador (n)',
        disabled: true,
        validators: [Validators.maxLength(9)],
      }),

      new TextboxQuestion({
        nane: 'denominador',
        label: 'Denominador (m)',
        disabled: true,
        validators: [Validators.maxLength(9)],
      }),

      new TextboxQuestion({
        nane: 'meta',
        label: 'Meta (%)',
        disabled: true,
        validators: [Validators.maxLength(9)],
      }),

      new TextboxQuestion({
        nane: 'valorBase',
        label: 'Valor Base',
      }),

      new TextboxQuestion({
        nane: 'idAnhio',
        label: 'Año',
        value: new Date().getFullYear(),
      }),

      new TextboxQuestion({
        nane: 'periodo',
        label: 'Periódo de la Línea Base',
      }),

      new TextboxQuestion({
        nane: 'valorAnual',
        label: 'Valor Anual',
      }),

      new TextboxQuestion({
        nane: 'idAnhio2',
        label: 'Año',
        value: new Date().getFullYear(),
      }),

      new TextboxQuestion({
        nane: 'periodoCumplimiento',
        label: 'Período de Cumplimiento de la Meta',
      }),

      new TextboxQuestion({
        nane: 'medioVerificacion',
        label: 'Medio de Verificación del Indicador',
        validators: [Validators.maxLength(280)],
      }),

      // Variables

      new TextboxQuestion({
        nane: 'nombreVariable',
        label: 'Nombre de la Variable',
        validators: [Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'descripcionVariable',
        label: 'Descripción de la Variable',
        validators: [Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        nane: 'fuenteInformacion',
        label: 'Fuente de Información de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new TextareaQuestion({
        nane: 'unidadMedida',
        label: 'Unidad de medida de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new TextareaQuestion({
        nane: 'frecuenciaMedicion',
        label: 'Frecuencia de Medición de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new TextareaQuestion({
        nane: 'metodoRecoleccion',
        label: 'Método de Recolección de Datos de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new DropdownQuestion({
        nane: 'idComportamientoIndicador',
        label: 'Comportamiento del Indicador',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Ascendente',
          },
          {
            id: 2,
            value: 'Descendente',
          },
          {
            id: 3,
            value: 'Constante',
          },
        ],
      }),

      new DropdownQuestion({
        nane: 'idComportamientoMedicion',
        label: 'Comportamiento de Medición',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Metas Acumulativas',
          },
          {
            id: 2,
            value: 'Metas Periódicas',
          },
        ],
      }),

      new DropdownQuestion({
        nane: 'idTipoValor',
        label: 'Tipo de Valor de la Meta',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Absoluto',
          },
          {
            id: 2,
            value: 'Relativo',
          },
        ],
      }),

      new DropdownQuestion({
        nane: 'idDesagregacion',
        label: 'Desagregación Geográfica',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Nacional',
          },
          {
            id: 2,
            value: 'Regional',
          },
        ],
      }),

      new TextareaQuestion({
        nane: 'descripcionVinculacion',
        label: 'Descripción de variables',
        validators: [Validators.maxLength(300)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('idUnidadMedida')?.valueChanges.subscribe((data) => {
      if (data === 723) {
        this.form.get('unidadMedidaDescubrir')?.enable();
        this.form
          .get('unidadMedidaDescubrir')
          ?.setValidators([Validators.required, Validators.maxLength(20)]);
      } else {
        this.form.get('unidadMedidaDescubrir')?.disable();
        this.form
          .get('unidadMedidaDescubrir')
          ?.setValidators([Validators.maxLength(20)]);
      }
    });
    this.form.get('idFrecuenciaMedicion')?.valueChanges.subscribe((data) => {
      if (data === 711) {
        this.form.get('frecuenciaMedicionDescubrir')?.enable();
        this.form
          .get('frecuenciaMedicionDescubrir')
          ?.setValidators([Validators.required, Validators.maxLength(20)]);
      } else {
        this.form.get('frecuenciaMedicionDescubrir')?.disable();
        this.form
          .get('frecuenciaMedicionDescubrir')
          ?.setValidators([Validators.maxLength(20)]);
      }
    });
    this.form.get('idTipoMedicion')?.valueChanges.subscribe((data) => {
      if (data === 2074) {
        this.form.get('tipoMedicionDescubrir')?.enable();
        this.form.get('numerador')?.disable();
        this.form.get('denominador')?.disable();
        this.form.get('meta')?.disable();
      } else {
        this.form.get('tipoMedicionDescubrir')?.disable();
        this.form.get('numerador')?.enable();
        this.form.get('denominador')?.enable();
        this.form.get('meta')?.enable();
      }
    });
    this.canEdit = data.canEdit;
    this.form.disable({ emitEvent: false });
    this.getCatalogs();
    this.consultarFicha();
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['dimensionIndicadores']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoIndicadores']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadMedida']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoMedicion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['periodicidadFrecuenciaMedicion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['comportamientoIndicador']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['comportamientoMedicion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoValorMeta']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['desagregacionGeografica']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(
        ([
          dimensionIndicadores,
          tipoIndicadores,
          unidadMedida,
          tipoMedicion,
          periodicidadFrecuenciaMedicion,
          comportamientoIndicador,
          comportamientoMedicion,
          tipoValorMeta,
          desagregacionGeografica,
        ]) => {
          this.questions[1].options = mapCatalogData({
            data: dimensionIndicadores,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[2].options = mapCatalogData({
            data: tipoIndicadores,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[5].options = mapCatalogData({
            data: unidadMedida,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[8].options = mapCatalogData({
            data: tipoMedicion,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[10].options = mapCatalogData({
            data: periodicidadFrecuenciaMedicion,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[28].options = mapCatalogData({
            data: comportamientoIndicador,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[29].options = mapCatalogData({
            data: comportamientoMedicion,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[30].options = mapCatalogData({
            data: tipoValorMeta,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
          this.questions[31].options = mapCatalogData({
            data: desagregacionGeografica,
            withOptionNoAplica: false,
            withOptionSelect: false,
          });
        }
      );
  }

  consultarFicha() {
    this.p016MirService
      .consultarFicha(this.dataMatriz.idIndicador || 0)
      .subscribe({
        next: (value) => {
          const { respuesta } = value;
          this.form.patchValue(
            {
              nombreIndicador: this.dataMatriz.nombreIndicador,
              idDimensionMedicion: respuesta.datosGenerales.idDimensionMedicion,
              idTipoIndicador: respuesta.datosGenerales.idTipoIndicador,
              definicionIndicador: respuesta.datosGenerales.definicionIndicador,
              metodoCalculo: respuesta.datosGenerales.metodoCalculo,
              idUnidadMedida: respuesta.datosGenerales.idUnidadMedida,
              unidadMedidaDescubrir:
                respuesta.datosGenerales.unidadMedidaDescubrir,
              unidadAbsoluta: respuesta.datosGenerales.unidadAbsoluta,
              idTipoMedicion: respuesta.datosGenerales.idTipoMedicion,
              tipoMedicionDescubrir:
                respuesta.datosGenerales.tipoMedicionDescubrir,
              idFrecuenciaMedicion:
                respuesta.datosGenerales.idFrecuenciaMedicion,
              frecuenciaMedicionDescubrir:
                respuesta.datosGenerales.frecuenciaMedicionDescubrir,
              numerador: respuesta.datosGenerales.numerador,
              denominador: respuesta.datosGenerales.denominador,
              meta: respuesta.datosGenerales.meta,
              valorBase: respuesta.lineaBase.valorBase,
              idAnhio: respuesta.lineaBase.idAnhio,
              periodo: respuesta.lineaBase.periodo,
              valorAnual: respuesta.metaAnual.valorAnual,
              idAnhio2: respuesta.metaAnual.idAnhio,
              periodoCumplimiento: respuesta.metaAnual.periodoCumplimiento,
              medioVerificacion: respuesta.metaAnual.medioVerificacion,
              nombreVariable: respuesta.caracteristicasVariables.nombreVariable,
              descripcionVariable:
                respuesta.caracteristicasVariables.descripcionVariable,
              fuenteInformacion:
                respuesta.caracteristicasVariables.fuenteInformacion,
              unidadMedida: respuesta.caracteristicasVariables.unidadMedida,
              frecuenciaMedicion:
                respuesta.caracteristicasVariables.frecuenciaMedicion,
              metodoRecoleccion:
                respuesta.caracteristicasVariables.metodoRecoleccion,
              idComportamientoIndicador:
                respuesta.caracteristicasVariables.idComportamientoIndicador,
              idComportamientoMedicion:
                respuesta.caracteristicasVariables.idComportamientoMedicion,
              idTipoValor: respuesta.caracteristicasVariables.idTipoValor,
              idDesagregacion:
                respuesta.caracteristicasVariables.idDesagregacion,
              descripcionVinculacion:
                respuesta.caracteristicasVariables.descripcionVinculacion,
            },
            { emitEvent: false }
          );
        },
      });
  }

  registrarFicha() {
    const data: IIndicador = this.buildData();
    this.p016MirService
      .registrarFicha(this.dataMatriz.idIndicador || 0, data)
      .subscribe({
        next: (value) => {
          this.dialogRef.close('save');
        },
      });
  }

  buildData(): IIndicador {
    const form = this.form.getRawValue();
    const data: IIndicador = {
      datosGenerales: {
        nombreIndicador: form.nombreIndicador,
        idDimensionMedicion: form.idDimensionMedicion,
        idTipoIndicador: form.idTipoIndicador,
        definicionIndicador: form.definicionIndicador,
        metodoCalculo: form.metodoCalculo,
        idUnidadMedida: form.idUnidadMedida,
        unidadMedidaDescubrir: form.unidadMedidaDescubrir,
        unidadAbsoluta: form.unidadAbsoluta,
        idTipoMedicion: form.idTipoMedicion,
        tipoMedicionDescubrir: form.tipoMedicionDescubrir,
        idFrecuenciaMedicion: form.idFrecuenciaMedicion,
        frecuenciaMedicionDescubrir: form.frecuenciaMedicionDescubrir,
        numerador: form.numerador,
        denominador: form.denominador,
        meta: form.meta,
      },
      lineaBase: {
        valorBase: form.valorBase,
        idAnhio: form.idAnhio,
        periodo: form.periodo,
      },
      metaAnual: {
        valorAnual: form.valorAnual,
        idAnhio: form.idAnhio2,
        periodoCumplimiento: form.periodoCumplimiento,
        medioVerificacion: form.medioVerificacion,
      },
      caracteristicasVariables: {
        nombreVariable: form.nombreVariable,
        descripcionVariable: form.descripcionVariable,
        fuenteInformacion: form.fuenteInformacion,
        unidadMedida: form.unidadMedida,
        frecuenciaMedicion: form.frecuenciaMedicion,
        metodoRecoleccion: form.metodoRecoleccion,
        idComportamientoIndicador: form.idComportamientoIndicador,
        idComportamientoMedicion: form.idComportamientoMedicion,
        idTipoValor: form.idTipoValor,
        idDesagregacion: form.idDesagregacion,
        descripcionVinculacion: form.descripcionVinculacion,
      },
    };
    return data;
  }

  download() {
    const questions: QuestionBase<any>[] = this.questions.map((item) => {
      item.value = this.form.get(item.nane)?.value;
      return item;
    });
    this.dialog.open(ReportBuilderComponent, {
      data: {
        questions,
        reportName: 'Ficha de Indicadores',
      },
      width: '1000px',
    });
  }
}
