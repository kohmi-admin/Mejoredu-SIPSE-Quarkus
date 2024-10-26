import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { ConsultingFilesComponent } from './consulting-files/consulting-files.component';
import { StateViewService } from '../../../services/state-view.service';
import { Subject, takeUntil, forkJoin, take } from 'rxjs';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { AlfrescoService } from '@common/services/alfresco.service';
import { M001FichasService } from '@common/services/budget/m001/fichas.service';
import * as SecureLS from 'secure-ls';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ModalService } from '@common/modal/modal.service';
import {
  I001FichaPayload,
  IItem001FichaResponse,
} from '@common/interfaces/budget/m001-and-o001/fichas.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { environment } from 'src/environments/environment';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { AlertService } from '@common/services/alert.service';
import { Router } from '@angular/router';
import { ReportBuilderComponent } from '@common/report-builder/report-builder.component';

@Component({
  selector: 'app-general-data-v',
  templateUrl: './general-data.component.html',
  styleUrls: ['./general-data.component.scss'],
})
export class GeneralDataComponent {
  @Input() canNavigate = true;
  ls = new SecureLS({ encodingType: 'aes' });
  dataAlf: ISeguridadAlfResponse;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  editable = true;
  validation = false;
  notifier = new Subject();
  yearNav: string = '';
  filesArchivos: any[] = [];
  arrayFiles: any[] = [];
  isSubmiting: boolean = false;
  dataUser: IDatosUsuario;
  suscribir: boolean = false;
  isSubmitingFinalize: boolean = false;
  isSubmitingSend: boolean = false;
  nombrePrograma = 'M001 - Actividades de apoyo administrativo';
  selectedFichaM001!: IItem001FichaResponse;
  idSaveValidar: number = 0;
  canEdit: boolean = true;
  selectedAjustesPP!: any;
  selectedValidarPP!: any;
  columns = [
    { columnDef: 'program', header: 'Nombre del Documento' },
    { columnDef: 'registerDate', header: 'Fecha de Carga' },
  ];
  actions: TableActionsI = {
    delete: false,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
        icon: 'download',
        color: 'primary',
      },
    ],
  };

  constructor(
    private _formBuilder: QuestionControlService,
    public dialog: MatDialog,
    private _stateViewService: StateViewService,
    private catalogService: CatalogsService,
    private m001FichasService: M001FichasService,
    private globalFuntions: GlobalFunctionsService,
    private alfrescoService: AlfrescoService,
    private modalService: ModalService,
    private pPConsultasService: PPConsultasService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');
    this.canEdit = this.ls.get('canEdit');
    this.dataAlf = this.ls.get('dataAlf');
    this.selectedAjustesPP = this.ls.get('selectedAjustesPP');
    this.selectedValidarPP = this.ls.get('selectedValidarPP');
    if (this.canEdit && this.selectedValidarPP) {
      this.canEdit = false;
    }
    this.createQuestions();
    this.getCatalogs();
    this.getFichasPorAnhio();
  }

  ngOnInit(): void {
    this.form.disable();
    this.subscribesForm();
  }

  getFichasPorAnhio() {
    this.m001FichasService
      .getDataGeneralPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.selectedFichaM001 = value.respuesta;
          // this.selectedFichaM001.estatusGeneral = 'T'
          this.idSaveValidar = this.selectedFichaM001.idProgramaPresupuestal;
          this.uploadDataForm(value.respuesta);
          if (value?.respuesta?.archivos?.length > 0) {
            // COMMENT: filesArchivos: listado de archivos para pasarsela a la tabla
            this.filesArchivos = value.respuesta.archivos.map((item) => {
              return {
                ...item,
                program: item.cxNombre,
                registerDate: item.dfFechaCarga,
              };
            });
          }
        },
        error: (err) => { },
      });
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['objetivosDesarrolloSustentable']
      ),
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
      .pipe(take(1))
      .subscribe(
        ([
          dataODS,
          dataDimensionIndicadores,
          dataTipoIndicadores,
          dataUnidadMedida,
          dataTipoMedicion,
          dataPeriodicidadFrecuenciaMedicion,
          dataComportamientoIndicador,
          dataComportamientoMedicion,
          dataTipoValorMeta,
          dataDesagregacionGeografica,
        ]) => {
          this.questions[3].options = mapCatalogData({
            data: dataODS,
          });
          this.questions[5].options = mapCatalogData({
            data: dataDimensionIndicadores,
          });
          this.questions[6].options = mapCatalogData({
            data: dataTipoIndicadores,
          });
          this.questions[9].options = mapCatalogData({
            data: dataUnidadMedida,
          });
          this.questions[12].options = mapCatalogData({
            data: dataTipoMedicion,
          });
          this.questions[14].options = mapCatalogData({
            data: dataPeriodicidadFrecuenciaMedicion,
          });
          this.questions[32].options = mapCatalogData({
            data: dataComportamientoIndicador,
          });
          this.questions[33].options = mapCatalogData({
            data: dataComportamientoMedicion,
          });
          this.questions[34].options = mapCatalogData({
            data: dataTipoValorMeta,
          });
          this.questions[35].options = mapCatalogData({
            data: dataDesagregacionGeografica,
          });
        }
      );
  }

  createQuestions() {
    this.questions = [
      new TextboxQuestion({
        idElement: 173,
        nane: 'ramosSector',
        label: 'Ramos y/o Sector',
        disabled: true,
        value: '47 Entidades no Sectorizadas',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        idElement: 174,
        nane: 'unidadResponsable',
        label: 'Unidad Responsable',
        disabled: true,
        value: 'Unidad de Administración y Finanzas',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        idElement: 175,
        nane: 'nombreProgramaPresupuestario',
        disabled: true,
        label: 'Nombre del Programa Presupuestario',
        value: this.nombrePrograma,
        validators: [Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        idElement: 176,
        nane: 'vinculacionODS',
        label: 'Vinculación con los ODS',
        options: [
          {
            id: 1,
            value: 'Fin de la Pobreza',
          },
          {
            id: 2,
            value: 'Hambre Cero',
          },
          {
            id: 3,
            value: 'Salud y Bienestar',
          },
          {
            id: 4,
            value: 'Educación y Calidad',
          },
          {
            id: 5,
            value: 'Igualdad de Género',
          },
          {
            id: 6,
            value: 'Agua Limpia y Saneamiento',
          },
          {
            id: 7,
            value: 'Energia Asequible y no Contaminante',
          },
          {
            id: 8,
            value: 'Trabajo Decente y Crecimiento Económico',
          },
          {
            id: 9,
            value: 'Industria, Innovación e Infraestructura',
          },
          {
            id: 10,
            value: 'Reducción de las Desigualdades',
          },
          {
            id: 11,
            value: 'Ciudades y Comunidades Sustentables',
          },
          {
            id: 12,
            value: 'Producción y Consumo Responsable',
          },
          {
            id: 13,
            value: 'Acción por el Clima',
          },
          {
            id: 14,
            value: 'Vida Submarina',
          },
          {
            id: 15,
            value: 'Vida de Ecosistemas Terrestres',
          },
          {
            id: 16,
            value: 'Paz, Justicia e Instituciones Sólidas',
          },
          {
            id: 17,
            value: 'Alianza para Lograr los Objetivos',
          },
        ],
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        idElement: 177,
        nane: 'nombreIndicador',
        label: 'Nombre del Indicador',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        idElement: 178,
        nane: 'dimensionMedir',
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
        idElement: 179,
        nane: 'tipoIndicadorResultados',
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
        idElement: 180,
        nane: 'definicionIndicador',
        label: 'Definición del Indicador',
      }),

      new TextboxQuestion({
        idElement: 181,
        nane: 'metodoCalculoIndicador',
        label: 'Método de Cálculo del Indicador',
      }),

      new DropdownQuestion({
        idElement: 182,
        nane: 'unidadMedida',
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
        idElement: 183,
        nane: 'describir',
        label: 'Describir',
        disabled: true,
        validators: [Validators.maxLength(20)],
      }),

      new TextboxQuestion({
        idElement: 184,
        nane: 'unidadAbsoluta',
        label: 'Unidad Absoluta',
        validators: [Validators.maxLength(50)],
      }),

      new DropdownQuestion({
        idElement: 185,
        nane: 'tipoMedicion',
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
        idElement: 186,
        nane: 'describirTM',
        label: 'Describir',
        disabled: true,
        validators: [Validators.maxLength(20)],
      }),

      new DropdownQuestion({
        idElement: 187,
        nane: 'frecuenciaMedicion',
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
        idElement: 188,
        nane: 'describirF',
        label: 'Describir',
        disabled: true,
        validators: [Validators.maxLength(20)],
      }),

      new TextboxQuestion({
        idElement: 189,
        nane: 'numerador',
        label: 'Numerador (n)',
        disabled: true,
        validators: [Validators.maxLength(9)],
      }),

      new TextboxQuestion({
        idElement: 190,
        nane: 'denominador',
        label: 'Denominador (m)',
        disabled: true,
        validators: [Validators.maxLength(9)],
      }),

      new TextboxQuestion({
        idElement: 191,
        nane: 'meta',
        label: 'Meta (%)',
        disabled: true,
        validators: [Validators.maxLength(9)],
      }),

      new TextboxQuestion({
        idElement: 192,
        nane: 'valorBase',
        label: 'Valor Base',
      }),

      new DropdownQuestion({
        idElement: 193,
        nane: 'anhio1',
        label: 'Año',
        value: new Date().getFullYear(),
        options: [
          {
            id: 2023,
            value: '2023',
          },
          {
            id: 2022,
            value: '2022',
          },
          {
            id: 2021,
            value: '2021',
          },
          {
            id: 2020,
            value: '2020',
          },
          {
            id: 2019,
            value: '2019',
          },
        ],
      }),

      new TextboxQuestion({
        idElement: 194,
        nane: 'periodoLineaBase',
        label: 'Periódo de la Línea Base',
      }),

      new TextboxQuestion({
        idElement: 195,
        nane: 'valorAnual',
        label: 'Valor Anual',
      }),

      new DropdownQuestion({
        idElement: 196,
        nane: 'anhio2',
        label: 'Año',
        value: new Date().getFullYear(),
        options: [
          {
            id: 2023,
            value: '2023',
          },
          {
            id: 2022,
            value: '2022',
          },
          {
            id: 2021,
            value: '2021',
          },
          {
            id: 2020,
            value: '2020',
          },
          {
            id: 2019,
            value: '2019',
          },
        ],
      }),

      new TextboxQuestion({
        idElement: 197,
        nane: 'periodoCumplimientoMeta',
        label: 'Período de Cumplimiento de la Meta',
      }),

      new TextboxQuestion({
        idElement: 198,
        nane: 'medioVerificacionIndicador',
        label: 'Medio de Verificación del Indicador',
        validators: [Validators.maxLength(280)],
      }),

      // Variables

      new TextboxQuestion({
        idElement: 199,
        nane: 'nombreVariable',
        label: 'Nombre de la Variable',
        validators: [Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        idElement: 200,
        nane: 'descripcionVariable',
        label: 'Descripción de la Variable',
        validators: [Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        idElement: 201,
        nane: 'fuenteInformacionVariable',
        label: 'Fuente de Información de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new TextareaQuestion({
        idElement: 202,
        nane: 'unidadMedidaVariable',
        label: 'Unidad de Medida de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new TextareaQuestion({
        idElement: 203,
        nane: 'frecuenciaMedicionVariable',
        label: 'Frecuencia de Medición de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new TextareaQuestion({
        idElement: 204,
        nane: 'metodoRecoleccionDatosVariable',
        label: 'Método de Recolección de Datos de la Variable',
        validators: [Validators.maxLength(300)],
      }),

      new DropdownQuestion({
        idElement: 205,
        nane: 'comportamientoIndicador',
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
        idElement: 206,
        nane: 'comportamientoMedicion',
        label: 'Comportamiento de Medición',
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
        ],
      }),

      new DropdownQuestion({
        idElement: 207,
        nane: 'tipoValorMeta',
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
        idElement: 208,
        nane: 'desagregacionGeografica',
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
        idElement: 209,
        nane: 'descripcionVinculacion',
        label: 'Descripción de Vinculación',
        validators: [Validators.maxLength(300)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);

    if (!this._stateViewService.editable) {
      this.form.disable();
      this.editable = false;
    }
    this.validation = this._stateViewService.validation;
  }

  async submit() {
    this.isSubmiting = true;
    // COMMENT: arrToFiles: arreglo de archivos, con la estructura solicitada del back
    // COMMENT: ya continiene los archivos existentes y los nuevos
    const arrToFiles: any[] = [];
    if (this.filesArchivos?.length > 0) {
      for (const item of this.filesArchivos) {
        if (item.cxUuid) {
          arrToFiles.push({
            uuid: item.cxUuid,
          });
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(this.dataAlf.uuidPlaneacion, item.file)
            .then((uuid) => {
              arrToFiles.push({
                uuid,
                tipoArchivo: item.file.name.includes('.pdf') ? 1 : 2,
                nombre: item.file.name,
              });
            })
            .catch((err) => { });
        }
      }
    }

    const formData = this.form.getRawValue();

    const m001Data: I001FichaPayload = {
      datosGenerales: {
        nombreIndicador: formData.nombreIndicador,
        idDimensionMedicion: formData.dimensionMedir,
        idTipoIndicador: formData.tipoIndicadorResultados,
        definicionIndicador: formData.definicionIndicador,
        metodoCalculo: formData.metodoCalculoIndicador,
        idUnidadMedida: formData.unidadMedida,
        unidadMedidaDescubrir: formData.describir,
        unidadAbsoluta: formData.unidadAbsoluta,
        idTipoMedicion: formData.tipoMedicion,
        tipoMedicionDescubrir: formData.describirTM,
        idFrecuenciaMedicion: formData.frecuenciaMedicion,
        frecuenciaMedicionDescubrir: formData.describirF,
        numerador: formData.numerador,
        denominador: formData.denominador,
        meta: formData.meta,
      },
      lineaBase: {
        valorBase: formData.valorBase,
        idAnhio: formData.anhio1,
        periodo: formData.periodoLineaBase,
      },
      metaAnual: {
        valorAnual: formData.valorAnual,
        idAnhio: formData.anhio2,
        periodoCumplimiento: formData.periodoCumplimientoMeta,
        medioVerificacion: formData.medioVerificacionIndicador,
      },
      caracteristicasVariables: {
        nombreVariable: formData.nombreVariable,
        descipcionVariable: formData.descripcionVariable,
        fuenteInformacion: formData.fuenteInformacionVariable,
        unidadMedida: formData.unidadMedidaVariable,
        frecuenciaMedicion: formData.frecuenciaMedicionVariable,
        metodoRecoleccion: formData.metodoRecoleccionDatosVariable,
        idComportamientoIndicador: formData.comportamientoIndicador,
        idComportamientoMedicion: formData.comportamientoMedicion,
        idTipoValor: formData.tipoValorMeta,
        idDesagregacion: formData.desagregacionGeografica,
        descripcionVinculacion: formData.descripcionVinculacion,
      },
      archivos: arrToFiles,
      nombrePrograma: formData.nombreProgramaPresupuestario,
      idVinculacionODS: formData.vinculacionODS,
      cveUsuario: this.dataUser.cveUsuario,
      idAnhio: parseInt(this.yearNav),
    };
    this.m001FichasService
      .createDataGeneral(m001Data)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmiting = false;
          if (value.mensaje.codigo === '200') {
            this.suscribir = false;
            this.getFichasPorAnhio();
            this.form.disable();
            this.actions.delete = false;
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

  async onTableActionArchivos(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.cxUuid) {
          this.downloadFileAlf(event.value?.cxUuid, event.value?.cxNombre);
        } else {
          this.globalFuntions.downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete: {
        const index = this.filesArchivos.findIndex(
          (item: any) => item.idCarga === event.value.idCarga
        );
        const tmpData = [...this.filesArchivos];
        tmpData.splice(index, 1);
        this.filesArchivos = tmpData;
        break;
      }
    }
  }

  handleAddFile() {
    const tmpFiles: any[] = [...this.filesArchivos];
    tmpFiles.push({
      program: this.arrayFiles[0].name,
      file: this.arrayFiles[0],
    });
    this.filesArchivos = tmpFiles;
    this.arrayFiles = [];
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  openDialog() {
    this.dialog.open(ConsultingFilesComponent, {
      data: {},
      width: '1100px',
    });
  }

  subscribesForm() {
    this.form
      .get('unidadMedida')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (this.suscribir) {
          if (value === 723) {
            //FIX: Colocar el codigo de forma constante
            this.form.get('describir')?.enable();
          } else {
            this.form.get('describir')?.setValue('');
            this.form.get('describir')?.disable();
          }
        }
      });

    this.form
      .get('tipoMedicion')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (this.suscribir) {
          if (value === 2074) {
            //FIX: Colocar el codigo de forma constante
            this.form.get('describirTM')?.enable();
          } else {
            this.form.get('describirTM')?.setValue('');
            this.form.get('describirTM')?.disable();
          }
        }
      });

    this.form
      .get('frecuenciaMedicion')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (this.suscribir) {
          if (value === 711) {
            //FIX: Colocar el codigo de forma constante
            this.form.get('describirF')?.enable();
          } else {
            this.form.get('describirF')?.setValue('');
            this.form.get('describirF')?.disable();
          }
        }
      });
  }

  uploadDataForm(data: IItem001FichaResponse) {
    this.form
      .get('nombreProgramaPresupuestario')
      ?.setValue(this.nombrePrograma);
    this.form
      .get('vinculacionODS')
      ?.setValue(data.idVinculacionODS === 1 ? 754 : data.idVinculacionODS);

    this.form
      .get('nombreIndicador')
      ?.setValue(data.datosGenerales.nombreIndicador);
    this.form
      .get('dimensionMedir')
      ?.setValue(data.datosGenerales.idDimensionMedicion);
    this.form
      .get('tipoIndicadorResultados')
      ?.setValue(data.datosGenerales.idTipoIndicador);
    this.form
      .get('definicionIndicador')
      ?.setValue(data.datosGenerales.definicionIndicador);
    this.form
      .get('metodoCalculoIndicador')
      ?.setValue(data.datosGenerales.metodoCalculo);
    this.form.get('unidadMedida')?.setValue(data.datosGenerales.idUnidadMedida);
    this.form
      .get('describir')
      ?.setValue(data.datosGenerales.unidadMedidaDescubrir);
    this.form
      .get('unidadAbsoluta')
      ?.setValue(data.datosGenerales.unidadAbsoluta);
    this.form.get('tipoMedicion')?.setValue(data.datosGenerales.idTipoMedicion);
    this.form
      .get('describirTM')
      ?.setValue(data.datosGenerales.tipoMedicionDescubrir);
    this.form
      .get('frecuenciaMedicion')
      ?.setValue(data.datosGenerales.idFrecuenciaMedicion);
    this.form
      .get('describirF')
      ?.setValue(data.datosGenerales.frecuenciaMedicionDescubrir);
    this.form.get('numerador')?.setValue(data.datosGenerales.numerador);
    this.form.get('denominador')?.setValue(data.datosGenerales.denominador);
    this.form.get('meta')?.setValue(data.datosGenerales.meta);

    // BUG: Al momento de guardarse hace que sea editable
    this.form.get('numerador')?.disable();
    this.form.get('denominador')?.disable();
    this.form.get('meta')?.disable();

    this.form.get('valorBase')?.setValue(data.lineaBase.valorBase);
    this.form.get('anhio1')?.setValue(data.lineaBase.idAnhio);
    this.form.get('periodoLineaBase')?.setValue(data.lineaBase.periodo);

    this.form.get('valorAnual')?.setValue(data.metaAnual.valorAnual);
    this.form.get('anhio2')?.setValue(data.metaAnual.idAnhio);
    this.form
      .get('periodoCumplimientoMeta')
      ?.setValue(data.metaAnual.periodoCumplimiento);
    this.form
      .get('medioVerificacionIndicador')
      ?.setValue(data.metaAnual.medioVerificacion);

    this.form
      .get('nombreVariable')
      ?.setValue(data.caracteristicasVariables.nombreVariable);
    this.form
      .get('descripcionVariable')
      ?.setValue(data.caracteristicasVariables.descipcionVariable);
    this.form
      .get('fuenteInformacionVariable')
      ?.setValue(data.caracteristicasVariables.fuenteInformacion);
    this.form
      .get('unidadMedidaVariable')
      ?.setValue(data.caracteristicasVariables.unidadMedida);
    this.form
      .get('frecuenciaMedicionVariable')
      ?.setValue(data.caracteristicasVariables.frecuenciaMedicion);
    this.form
      .get('metodoRecoleccionDatosVariable')
      ?.setValue(data.caracteristicasVariables.metodoRecoleccion);
    this.form
      .get('comportamientoIndicador')
      ?.setValue(data.caracteristicasVariables.idComportamientoIndicador);
    this.form
      .get('comportamientoMedicion')
      ?.setValue(data.caracteristicasVariables.idComportamientoMedicion);
    this.form
      .get('tipoValorMeta')
      ?.setValue(data.caracteristicasVariables.idTipoValor);
    this.form
      .get('desagregacionGeografica')
      ?.setValue(data.caracteristicasVariables.idDesagregacion);
    this.form
      .get('descripcionVinculacion')
      ?.setValue(data.caracteristicasVariables.descripcionVinculacion);
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
    this.suscribir = true;

    this.form.get('ramosSector')?.disable();
    this.form.get('unidadResponsable')?.disable();
    this.form.get('nombreProgramaPresupuestario')?.disable();

    this.form.get('unidadMedida')?.value === 723
      ? this.form.get('describir')?.enable()
      : this.form.get('describir')?.disable();
    //FIX: REVISAR CODIGO DE OTRO
    this.form.get('tipoMedicion')?.value === 2074
      ? this.form.get('describirTM')?.enable()
      : this.form.get('describirTM')?.disable();
    this.form.get('frecuenciaMedicion')?.value === 711
      ? this.form.get('describirF')?.enable()
      : this.form.get('describirF')?.disable();
    this.actions.delete = true;
  }

  get disableFinish(): boolean {
    return (
      this.selectedFichaM001?.estatusGeneral === 'T' ||
      this.selectedFichaM001?.estatusGeneral === 'P' ||
      this.selectedFichaM001?.estatusGeneral === 'E'
    );
  }

  get disableSend(): boolean {
    return this.selectedFichaM001?.estatusGeneral !== 'T';
  }

  get disableEdit(): boolean {
    return (
      this.form.enabled ||
      this.selectedFichaM001?.estatusGeneral === 'T' ||
      this.selectedFichaM001?.estatusGeneral === 'P' ||
      this.selectedFichaM001?.estatusGeneral === 'E'
    );
  }

  finalize() {
    // REVIEW: falta implementar
    if (this.selectedFichaM001) {
      this.isSubmitingFinalize = true;
      this.pPConsultasService
        .finalizarRegistro(
          this.selectedFichaM001?.idProgramaPresupuestal ?? 0,
          this.dataUser.cveUsuario
        )
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmitingFinalize = false;
            if (value.mensaje.codigo === '200') {
              this.getFichasPorAnhio();
            }
          },
          error: (err) => {
            this.isSubmitingFinalize = false;
          },
        });
    }
  }

  send() {
    if (this.selectedFichaM001) {
      this.isSubmitingSend = true;
      this.pPConsultasService
        .enviarARevison(
          this.selectedFichaM001?.idProgramaPresupuestal ?? 0,
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

  ngOnDestroy() {
    this.notifier.complete();
  }
}
