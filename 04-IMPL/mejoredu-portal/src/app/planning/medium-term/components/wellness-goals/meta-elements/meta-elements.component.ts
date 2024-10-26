import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin, take } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { CatalogsService } from '@common/services/catalogs.service';
import { GoalsService } from '@common/services/goals.service';

@Component({
  selector: 'app-meta-elements',
  templateUrl: './meta-elements.component.html',
  styleUrls: ['./meta-elements.component.scss'],
})
export class MetaElementsComponent implements OnInit {
  ls = new SecureLS({ encodingType: 'aes' });
  @Input() editable: boolean = true;
  @Input() form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  @Output() emmitStep = new EventEmitter<number>();

  dataUser: IDatosUsuario;
  yearNav: string;

  constructor(
    private _formBuilder: QuestionControlService,
    private objetivosPrioritarios: GoalsService,
    private catalogService: CatalogsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.createQuestions();
    this.getDataElementos();
  }

  ngOnInit(): void {
    if (!this.editable) {
      this.form.disable();
    }
  }

  createQuestions() {
    this.questions = [
      new TextareaQuestion({
        nane: 'nombre',
        label: 'Nombre',
        rows: 4,
        validators: [Validators.required, Validators.maxLength(500)],
      }),
      new DropdownQuestion({
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
        nane: 'definicionDescripcion',
        label: 'Definición o Descripción',
        validators: [Validators.required, Validators.maxLength(1300)],
      }),
      new DropdownQuestion({
        nane: 'nivelDesagreacion',
        label: 'Nivel de Desagregación',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Nacional',
          },
          {
            id: 2,
            value: 'Estatal',
          },
        ],
        validators: [Validators.required],
      }),
      new DropdownQuestion({
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
        nane: 'especificarPeriodicidadFrecuenciaMedicion',
        label: 'Especificar Periodicidad o Frecuencia de Medición',
        disabled: true,
        validators: [Validators.maxLength(200)],
      }),
      new DropdownQuestion({
        nane: 'tipo',
        label: 'Tipo',
        filter: true,
        validators: [Validators.required],
      }),
      new DropdownQuestion({
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
        nane: 'especificarUnidadMedida',
        label: 'Especificar Unidad de Medida',
        disabled: true,
        validators: [Validators.maxLength(200)],
      }),
      new DropdownQuestion({
        nane: 'acumuladoPeriodico',
        label: 'Acumulado o Periódico',
        filter: true,
        validators: [Validators.required],
      }),
      new DropdownQuestion({
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
        nane: 'especificarPeriodoRecoleccionDatos',
        label: 'Especificar Período de Recolección de Datos',
        disabled: true,
        validators: [Validators.maxLength(200)],
      }),
      new DropdownQuestion({
        nane: 'dimension',
        label: 'Dimensión',
        filter: true,
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'disponibilidadInformacion',
        label: 'Disponibilidad de la Información',
        filter: true,
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'tendenciaEsperada',
        label: 'Tendencia Esperada',
        filter: true,
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'unidadResponsableReportarAvance',
        label: 'Unidad Responsable de Reportar el Avance',
        filter: true,
        validators: [Validators.required],
      }),
      new TextareaQuestion({
        nane: 'metodoCalculo',
        label: 'Método de Cálculo',
        rows: 4,
        validators: [Validators.required, Validators.maxLength(500)],
      }),
      new TextareaQuestion({
        nane: 'observaciones',
        label: 'Observaciones',
        rows: 4,
        validators: [Validators.required, Validators.maxLength(500)],
      }),
    ];

    this.form = this._formBuilder.toFormGroup(this.questions);
    /* this.form.get('Periodicidad o Frecuencia de Medición')?.valueChanges.subscribe((value: any) => {
      if (value === 7) {
        this.form.get('Especificar Periodicidad o Frecuencia de Medición')?.enable();
      } else {
        this.form.get('Especificar Periodicidad o Frecuencia de Medición')?.disable();
      }
    });
    this.form.get('Unidad de Medida')?.valueChanges.subscribe((value: any) => {
      if (value === 2) {
        this.form.get('Especificar Unidad de Medida')?.enable();
      } else {
        this.form.get('Especificar Unidad de Medida')?.disable();
      }
    });
    this.form.get('Período de Recolección de Datos')?.valueChanges.subscribe((value: any) => {
      if (value === 2) {
        this.form.get('Especificar Período de Recolección de Datos')?.enable();
      } else {
        this.form.get('Especificar Período de Recolección de Datos')?.disable();
      }
    }); */
  }

  getDataElementos() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nivelDesagregacion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['periodicidadFrecuenciaMedicion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipo']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadMedida']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['acumuladoPeriodico']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['periodoRecoleccionDatos']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['dimensionIndicadores']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['disponibilidadInformacion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tendenciaEsperada']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadResponsableReportarAvance']
      ),
      this.objetivosPrioritarios.getCatalogObjetivo(this.yearNav),
    ])
      .pipe(take(1))
      .subscribe(
        ([
          dataNivelDesagregacion,
          dataPeriodicidadFrecuenciaMedicion,
          dataTipo,
          dataUnidadMedida,
          dataAcumuladoPeriodico,
          dataPeriodoRecoleccionDatos,
          dataDimensionIndicadores,
          dataDisponibilidadInformacion,
          dataTendenciaEsperada,
          dataUnidadResponsableReportarAvance,
          dataObjetivosPrioritariosAnhio,
        ]) => {
          this.questions[1].options = mapCatalogData({
            data: dataObjetivosPrioritariosAnhio,
            withIdx: false,
          });

          this.questions[3].options = mapCatalogData({
            data: dataNivelDesagregacion,
          });
          this.questions[4].options = mapCatalogData({
            data: dataPeriodicidadFrecuenciaMedicion,
          });
          this.questions[6].options = mapCatalogData({ data: dataTipo });
          this.questions[7].options = mapCatalogData({
            data: dataUnidadMedida,
          });
          this.questions[9].options = mapCatalogData({
            data: dataAcumuladoPeriodico,
          });
          this.questions[10].options = mapCatalogData({
            data: dataPeriodoRecoleccionDatos,
          });
          this.questions[12].options = mapCatalogData({
            data: dataDimensionIndicadores,
          });
          this.questions[13].options = mapCatalogData({
            data: dataDisponibilidadInformacion,
          });
          this.questions[14].options = mapCatalogData({
            data: dataTendenciaEsperada,
          });
          this.questions[15].options = mapCatalogData({
            data: dataUnidadResponsableReportarAvance,
          });
        }
      );
  }

  changeStep(add: number) {
    this.emmitStep.emit(add);
  }

  submit(): void { }
}
