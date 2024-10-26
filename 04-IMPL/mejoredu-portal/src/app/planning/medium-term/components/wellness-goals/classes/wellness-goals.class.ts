import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';

export const questionsMeta: QuestionBase<any>[] = [
  new TextareaQuestion({
    idElement: 11,
    nane: 'nombre',
    label: 'Nombre',
    rows: 4,
    validators: [Validators.required, Validators.maxLength(500)],
  }),
  new DropdownQuestion({
    idElement: 12,
    nane: 'objetivoPrioritario',
    label: 'Objetivo Prioritario',
    filter: true,
    options: [
      {
        id: 1,
        value: 'Opción 1',
      },
    ],
    validators: [Validators.required],
  }),
  new TextareaQuestion({
    idElement: 13,
    nane: 'definicionDescripcion',
    label: 'Definición o Descripción',
    validators: [Validators.required, Validators.maxLength(1300)],
  }),
  new DropdownQuestion({
    idElement: 14,
    nane: 'nivelDesagreacion',
    label: 'Nivel de Desagregación',
    filter: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    idElement: 15,
    nane: 'periodicidadFrecuenciaMedicion',
    label: 'Periodicidad o Frecuencia de Medición',
    filter: true,
    options: [
      {
        id: 1,
        value: 'Quincenal',
      },
      {
        id: 2,
        value: 'Mensual',
      },
      {
        id: 3,
        value: 'Bimestral',
      },
      {
        id: 4,
        value: 'Trimestral',
      },
      {
        id: 5,
        value: 'Semestral',
      },
      {
        id: 6,
        value: 'Anual',
      },
      {
        id: 7,
        value: 'Otro',
      },
    ],
    validators: [Validators.required],
  }),
  new TextboxQuestion({
    idElement: 16,
    nane: 'especificarPeriodicidadFrecuenciaMedicion',
    label: 'Especificar Periodicidad o Frecuencia de Medición',
    disabled: true,
    validators: [Validators.required, Validators.maxLength(120)],
  }),
  new DropdownQuestion({
    idElement: 17,
    nane: 'tipo',
    label: 'Tipo',
    filter: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    idElement: 18,
    nane: 'unidadMedida',
    label: 'Unidad de Medida',
    filter: true,
    options: [
      {
        id: 1,
        value: 'Opción 1',
      },
      {
        id: 2,
        value: 'Otro',
      },
    ],
    validators: [Validators.required],
  }),
  new TextboxQuestion({
    idElement: 19,
    nane: 'especificarUnidadMedida',
    label: 'Especificar Unidad de Medida',
    disabled: true,
    validators: [Validators.required, Validators.maxLength(120)],
  }),
  new DropdownQuestion({
    idElement: 20,
    nane: 'acumuladoPeriodico',
    label: 'Acumulado o Periódico',
    filter: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    idElement: 21,
    nane: 'periodoRecoleccionDatos',
    label: 'Período de Recolección de Datos',
    filter: true,
    options: [
      {
        id: 1,
        value: 'Opción 1',
      },
      {
        id: 2,
        value: 'Otro',
      },
    ],
    validators: [Validators.required],
  }),
  new TextboxQuestion({
    idElement: 22,
    nane: 'especificarPeriodoRecoleccionDatos',
    label: 'Especificar Período de Recolección de Datos',
    disabled: true,
    validators: [Validators.required, Validators.maxLength(120)],
  }),
  new DropdownQuestion({
    idElement: 23,
    nane: 'dimension',
    label: 'Dimensión',
    filter: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    idElement: 24,
    nane: 'disponibilidadInformacion',
    label: 'Disponibilidad de la Información',
    filter: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    idElement: 25,
    nane: 'tendenciaEsperada',
    label: 'Tendencia Esperada',
    filter: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    idElement: 26,
    nane: 'unidadResponsableReportarAvance',
    label: 'Unidad Responsable de Reportar el Avance',
    filter: true,
    validators: [Validators.required],
  }),
  new TextareaQuestion({
    idElement: 27,
    nane: 'metodoCalculo',
    label: 'Método de Cálculo',
    rows: 4,
    validators: [Validators.required, Validators.maxLength(500)],
  }),
  new TextareaQuestion({
    idElement: 28,
    nane: 'observaciones',
    label: 'Observaciones',
    rows: 4,
    validators: [Validators.required, Validators.maxLength(500)],
  }),
];

export const questionsCalculationMethod: QuestionBase<any>[] = [
  new TextboxQuestion({
    idElement: 29,
    nane: 'varName1',
    label: 'Nombre Variable 1',
    validators: [Validators.required, Validators.maxLength(120)],
  }),

  new TextboxQuestion({
    idElement: 30,
    nane: 'valVar1',
    label: 'Valor Variable 1',
    validators: [Validators.required, Validators.maxLength(120)],
  }),

  new TextboxQuestion({
    idElement: 31,
    nane: 'fuenteInformacionVariable1',
    label: 'Fuente de Información Variable 1',
    validators: [Validators.required, Validators.maxLength(120)],
  }),

  new TextboxQuestion({
    idElement: 32,
    nane: 'varName2',
    label: 'Nombre Variable 2',
    validators: [Validators.required, Validators.maxLength(120)],
  }),

  new TextboxQuestion({
    idElement: 33,
    nane: 'valVar2',
    label: 'Valor Variable 2',
    validators: [Validators.required, Validators.maxLength(120)],
  }),

  new TextboxQuestion({
    idElement: 34,
    nane: 'fuenteInformacionVariable2',
    label: 'Fuente de Información Variable 2',
    validators: [Validators.required, Validators.maxLength(120)],
  }),

  new TextareaQuestion({
    idElement: 35,
    nane: 'sustutucionMetodoCalculoIndicador',
    label: 'Sustitución en Método de Cálculo del Indicador',
    validators: [Validators.required, Validators.maxLength(120)],
  })
];

export const questionsValue: QuestionBase<any>[] = [
  new TextboxQuestion({
    idElement: 36,
    nane: 'valor',
    label: 'Valor de Línea Base',
    validators: [Validators.required, Validators.maxLength(45)],
  }),
  new DropdownQuestion({
    idElement: 37,
    nane: 'anhio',
    label: 'Año',
    value: 2023,
    options: [
      {
        id: 2023,
        value: '2023'
      },
      {
        id: 2024,
        value: '2024'
      }
    ],
    validators: [Validators.required],
  }),
  new TextboxQuestion({
    idElement: 38,
    nane: 'notasSobreLineaBase',
    label: 'Notas Sobre la Línea Base',
    validators: [Validators.required, Validators.maxLength(120)],
  }),
  new TextboxQuestion({
    idElement: 39,
    nane: 'meta',
    label: 'Meta',
    validators: [Validators.required, Validators.maxLength(500)],
  }),
  new TextareaQuestion({
    idElement: 40,
    nane: 'notasSobreMeta',
    label: 'Nota Sobre la Meta',
    validators: [Validators.required],
  }),
];

export const questionsHistoricalSeries: QuestionBase<any>[] = [
  new DropdownQuestion({
    nane: 'date1',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date2',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date3',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date4',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date5',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date6',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date7',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),

  new DropdownQuestion({
    nane: 'percent1',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent2',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent3',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent4',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent5',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent6',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent7',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
];

export const questionsIntermediateGoals: QuestionBase<any>[] = [
  new DropdownQuestion({
    nane: 'date1',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date2',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date3',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date4',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date5',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date6',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'date7',
    label: 'Fecha',
    options: [
      {
        id: 2012,
        value: "2012"
      }
    ],
    validators: [Validators.required]
  }),

  new DropdownQuestion({
    nane: 'percent1',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent2',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent3',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent4',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent5',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent6',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
  new DropdownQuestion({
    nane: 'percent7',
    label: 'Porcentaje',
    type: 'number',
    validators: [Validators.required]
  }),
];
