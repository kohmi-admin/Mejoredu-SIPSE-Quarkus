import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AlertService } from '@common/services/alert.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { FormsStateService } from '../../services/forms-state.service.ts.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { CatalogsService } from '@common/services/catalogs.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { environment } from 'src/environments/environment';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { ActivitiesService } from '@common/services/activities.service';
import * as SecureLS from 'secure-ls';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { ProductsService } from '@common/services/products.service';
import {
  IItemProductResponse,
  IProductPayload,
} from '@common/interfaces/products.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ProjectsService } from '@common/services/projects.service';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { StateViewService } from 'src/app/planning/short-term/services/state-view.service';
import { mapOptionProjects } from '@common/mapper/data-options.mapper';
import {
  getCveActividad,
  getCveProducto,
  getCveProyecto,
  getGlobalStatus,
  getNumeroProducto,
} from '@common/utils/Utils';
import { ProductsService as ProductsServiceSeguimiento } from '@common/services/seguimiento/products.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { ParametersService } from '@common/services/medium-term/parameters.service';
import { P016MirService } from '@common/services/budget/p016/mir.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  formatCveProduct: string = '0000-00-00-0-00';
  data: any[] = [];
  isCleanForm: boolean = false;
  columns = [
    { columnDef: 'claveProyecto', header: 'Clave del<br />Proyecto' },
    { columnDef: 'claveActividad', header: 'Clave de la<br />Actividad' },
    { columnDef: 'claveProducto', header: 'Clave del<br />Producto' },
    { columnDef: 'estatus', header: 'Estatus', width: '150px' },
    // { columnDef: 'np', header: 'Nombre de Acción' },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
  };

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  private _body = document.querySelector('body');
  dataActivities: any[] = [];
  dataProjects: IItemProjectsResponse[] = [];
  dataUser: IDatosUsuario;

  dataPP: any[] = [];
  yearNav: string;
  calendarización = [];
  activitySelected: any = null;
  projectSelected: IItemProjectsResponse | undefined = undefined;
  catCategoria: IItemCatalogoResponse[] = [];
  catObjetivosPrioritario: IItemCatalogoResponse[] = [];
  catIndicadorPI: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];
  dataSelected: IItemProductResponse | undefined = undefined;
  disabledSubmiting: boolean = false;
  isSubmiting: boolean = false;
  validation = false;
  editable = true;
  idSaveValidar: number = 0;
  selectedAjustesProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  selectedConsultaProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  selectedValidateProyectoPAA: any = null;
  disabledAppValidate: boolean = false;
  selectedProducto: any = null;
  secuencialProducto: number = 0;
  docAnalitico: any = null;
  canEditProject: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private _formsState: FormsStateService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private catalogService: CatalogsService,
    private activitiesService: ActivitiesService,
    private productsService: ProductsService,
    private productsServiceSeguimiento: ProductsServiceSeguimiento,
    private projectsService: ProjectsService,
    private _stateView: StateViewService,
    private parametersService: ParametersService,
    private p016MirService: P016MirService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedAjustesProyectoPAA = this.ls.get('selectedAjustesProyectoPAA');
    this.selectedConsultaProyectoPAA = this.ls.get(
      'selectedConsultaProyectoPAA'
    );
    this.selectedValidateProyectoPAA = this.ls.get(
      'selectedValidateProyectoPAA'
    );
    this.createQuestions();
    this.getAll();
    this._formsState.unactiveAll();
    this._body?.classList.add('hideW');
  }

  ngOnInit() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.data = [];
          this.form.get('nombreActividad')?.reset();
          this.form.get('nombreActividad')?.enable({ emitEvent: false });
          this.form.get('numeroProducto')?.setValue('00');
          this.form.get('claveProducto')?.setValue(this.formatCveProduct);
          this.form.get('indicadorPI')?.setValue('');
          this.questions[9].options = [];
          this.getActivities(value);
          const findedProject = this.dataProjects.filter(
            (item) => item.idProyecto === value
          );
          if (findedProject?.length > 0) {
            this.projectSelected = findedProject[0];
            this.getSecuenciaProductoByProject(this.projectSelected.idProyecto);
          }
          if (this.projectSelected?.archivos?.length) {
            this.docAnalitico = this.projectSelected.archivos[0];
          }
          if (!this.selectedConsultaProyectoPAA && this.projectSelected) {
            if (
              this.projectSelected.estatus === 'T' ||
              this.projectSelected.estatus === 'P' ||
              this.projectSelected.estatus === 'E' ||
              this.projectSelected.estatus === 'V' ||
              this.projectSelected.estatus === 'O' ||
              this.projectSelected.estatusPlaneacion === 'R' ||
              this.projectSelected.estatusPresupuesto === 'R' ||
              this.projectSelected.estatusSupervisor === 'R'
            ) {
              this.canEditProject = false;
              this.actions.edit = false;
              this.actions.delete = false;
            } else {
              this.canEditProject = true;
              this.actions.edit = true;
              this.actions.delete = true;
            }

            if (
              this.projectSelected.estatus === 'C' &&
              ((this.projectSelected.estatusPlaneacion === 'R' &&
                this.projectSelected.estatusPresupuesto === 'R') ||
                (this.projectSelected.estatusPlaneacion === 'V' &&
                  this.projectSelected.estatusPresupuesto === 'R') ||
                (this.projectSelected.estatusPlaneacion === 'R' &&
                  this.projectSelected.estatusPresupuesto === 'V') ||
                (this.projectSelected.estatusPlaneacion === 'V' &&
                  this.projectSelected.estatusPresupuesto === 'V' &&
                  this.projectSelected.estatusSupervisor === 'R'))
            ) {
              this.canEditProject = true;
              this.actions.edit = true;
              this.actions.delete = true;
            }
            if (
              this.selectedAjustesProyectoPAA &&
              this.projectSelected.estatus === 'V'
            ) {
              this.canEditProject = true;
              this.actions.edit = true;
              this.actions.delete = true;
            }
          }
          this.setClaveProducto({
            projectSelected: this.projectSelected,
            activitySelected: this.activitySelected,
            claveProductoForm:
              this.form.get('claveProducto')?.getRawValue() || '',
            numeroProductoForm:
              this.form.get('numeroProducto')?.getRawValue() || '',
            categorizacionProductoForm:
              this.form.get('categorizacionProducto')?.getRawValue() || '',
            tipoProductoForm:
              this.form.get('tipoProducto')?.getRawValue() || '',
            setClaveProducto: true,
          });
          this.uploadIndicadorPI(value);
        }
      });

    this.form
      .get('nombreActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.enable({ emitEvent: false });
          this.resetAllForm();
          this.form.get('numeroProducto')?.disable({ emitEvent: false });
          this.form.get('claveProducto')?.disable({ emitEvent: false });
          const findedActivity = this.dataActivities.filter(
            (item) => item.idActividad === value
          );
          if (findedActivity?.length > 0) {
            this.activitySelected = findedActivity[0];
          }
          this.getProductsByIdActivity(value);
        }
      });

    this.form
      .get('categorizacionProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.setClaveProducto({
            projectSelected: this.projectSelected,
            activitySelected: this.activitySelected,
            claveProductoForm:
              this.form.get('claveProducto')?.getRawValue() || '',
            numeroProductoForm:
              this.form.get('numeroProducto')?.getRawValue() || '',
            categorizacionProductoForm:
              this.form.get('categorizacionProducto')?.getRawValue() || '',
            tipoProductoForm:
              this.form.get('tipoProducto')?.getRawValue() || '',
            setClaveProducto: true,
          });
        }
      });

    this.form
      .get('tipoProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.setClaveProducto({
            projectSelected: this.projectSelected,
            activitySelected: this.activitySelected,
            claveProductoForm:
              this.form.get('claveProducto')?.getRawValue() || '',
            numeroProductoForm:
              this.form.get('numeroProducto')?.getRawValue() || '',
            categorizacionProductoForm:
              this.form.get('categorizacionProducto')?.getRawValue() || '',
            tipoProductoForm:
              this.form.get('tipoProducto')?.getRawValue() || '',
            setClaveProducto: true,
          });
        }
      });
  }

  getSecuenciaProductoByProject(idProyecto: number) {
    this.productsServiceSeguimiento
      .getSecuencialPorProyecto(idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        this.secuencialProducto = response.respuesta;
        this.form
          .get('numeroProducto')
          ?.setValue(getNumeroProducto(this.secuencialProducto));
        this.setClaveProducto({
          projectSelected: this.projectSelected,
          activitySelected: this.activitySelected,
          claveProductoForm:
            this.form.get('claveProducto')?.getRawValue() || '',
          numeroProductoForm: String(this.secuencialProducto) || '',
          categorizacionProductoForm:
            this.form.get('categorizacionProducto')?.getRawValue() || '',
          tipoProductoForm: this.form.get('tipoProducto')?.getRawValue() || '',
          setClaveProducto: true,
        });
      });
  }

  getProyectsSwitch() {
    if (this.selectedAjustesProyectoPAA || this.selectedValidateProyectoPAA) {
      if (this.selectedAjustesProyectoPAA) {
        this.dataProjects = [this.selectedAjustesProyectoPAA.value];
      } else {
        this.dataProjects = [this.selectedValidateProyectoPAA.value];
      }
      this.questions[0].options = mapOptionProjects(this.dataProjects);
    } else if (this.selectedConsultaProyectoPAA) {
      this.getProjectsConsulta();
    } else {
      this.getProjectsConsulta();
    }
  }

  getProjects() {
    this.projectsService
      .getProjectByAnnio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length) {
            this.dataProjects = value.proyecto.filter(
              (item) =>
                item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad &&
                item.estatus === 'C'
            );
            this.questions[0].options = mapOptionProjects(this.dataProjects);
          }
        },
      });
  }

  getProjectsConsulta() {
    this.data = [];
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.dataProjects = value.proyecto
              .filter((item) => {
                if (item.estatus !== 'B') {
                  if (
                    (this.dataUser.idTipoUsuario === 'ENLACE' ||
                      this.dataUser.idTipoUsuario === 'PLANEACION' ||
                      this.dataUser.idTipoUsuario === 'PRESUPUESTO' ||
                      (this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                        this.dataUser.perfilLaboral.ixNivel === 1)) &&
                    item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad
                  ) {
                    return true;
                  }

                  if (
                    this.dataUser.idTipoUsuario === 'CONSULTOR' ||
                    (this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                      this.dataUser.perfilLaboral.ixNivel != 1)
                  ) {
                    return true;
                  }
                }
                return false;
              })
              .map((item) => {
                return {
                  ...item,
                  claveProyecto: getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  }),
                  estatusFull: getGlobalStatus(item.estatus),
                };
              });
            this.questions[0].options = mapOptionProjects(this.dataProjects);
            if (this.selectedConsultaProyectoPAA) {
              this.form
                .get('nombreProyecto')
                ?.setValue(this.selectedConsultaProyectoPAA?.value.idProyecto);
            }
            this.form.get('nombreProyecto')?.enable();
          }
        },
      });
  }

  getActivities(idProject: number) {
    this.activitiesService
      .getActivityByProjectId(idProject)
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        const tmpData: any[] = [];
        let existComplete = false;
        for (const item of response.respuesta) {
          if (item.csEstatus !== 'I') {
            tmpData.push({
              id: item.idActividad,
              value: item.cxNombreActividad,
            });
          }
          if (item.csEstatus === 'A') {
            existComplete = true;
          }
        }
        // this.registerDataService.sendData({ products: existComplete });
        this.dataActivities = response.respuesta;
        this.questions[1].options = tmpData;

        //this.registerDataService.sendData({ projects: existComplete });
        const selectedActividad = this.ls.get('selectedActividad');
        if (selectedActividad) {
          this.form
            .get('nombreActividad')
            ?.setValue(selectedActividad.idActividad);
          this.ls.remove('selectedActividad');
        }
      });
  }

  getProductsByIdActivity(idActivity: string) {
    this.productsService
      .getProductByActivityId(idActivity)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const tmpData: any[] = [];
            if (value.respuesta?.length > 0) {
              for (const item of value.respuesta) {
                tmpData.push({
                  ...item,
                  claveProyecto: getCveProyecto({
                    cveProyecto: +(this.projectSelected?.clave ?? 0),
                  }),
                  claveActividad: getCveActividad({
                    numeroActividad: this.activitySelected?.cveActividad,
                    projectSelected: this.projectSelected,
                  }),
                  claveProducto: this.setClaveProducto({
                    projectSelected: this.projectSelected,
                    activitySelected: this.activitySelected,
                    claveProductoForm: this.formatCveProduct,
                    numeroProductoForm: item.cveProducto,
                    categorizacionProductoForm: item.idCategorizacion,
                    tipoProductoForm: item.idTipoProducto,
                    setClaveProducto: false,
                  }),
                  estatus: this.getStatus(item.estatus),
                });
              }
            }
            this.setClaveProducto({
              projectSelected: this.projectSelected,
              activitySelected: this.activitySelected,
              claveProductoForm:
                this.form.get('claveProducto')?.getRawValue() || '',
              numeroProductoForm:
                this.form.get('numeroProducto')?.getRawValue() || '',
              categorizacionProductoForm:
                this.form.get('categorizacionProducto')?.getRawValue() || '',
              tipoProductoForm:
                this.form.get('tipoProducto')?.getRawValue() || '',
              setClaveProducto: true,
            });
            this.data = tmpData.reverse();

            const selectedProducto = this.ls.get('selectedProducto');
            if (selectedProducto) {
              this.onTableAction(selectedProducto);
              this.ls.remove('selectedProducto');
            }
          }
        },
        error: (err) => {
          //
        },
      });
  }

  validateWhereComeFrom() {
    const selectedUploadMasiveProyectoPAA = this.ls.get(
      'selectedUploadMasiveProyectoPAA'
    );
    if (
      selectedUploadMasiveProyectoPAA &&
      selectedUploadMasiveProyectoPAA.value.estatus === 'Completo'
    ) {
      if (
        !this.questions[0].optionsArray ||
        this.questions[0].optionsArray.length === 0
      ) {
        setTimeout(() => {
          this.validateWhereComeFrom();
        }, 500);
      } else {
        this.form
          .get('nombreProyecto')
          ?.setValue(selectedUploadMasiveProyectoPAA.value.idProyecto);
      }
    }

    if (this.selectedAjustesProyectoPAA) {
      if (
        !this.questions[0].optionsArray ||
        this.questions[0].optionsArray.length === 0
      ) {
        setTimeout(() => {
          this.validateWhereComeFrom();
        }, 500);
      } else {
        this.form
          .get('nombreProyecto')
          ?.setValue(this.selectedAjustesProyectoPAA.value.idProyecto);
        // this.idSaveValidar = this.selectedAjustesProyectoPAA.value.idProyecto;
      }
    }

    if (this.selectedValidateProyectoPAA) {
      if (
        !this.questions[0].optionsArray ||
        this.questions[0].optionsArray.length === 0
      ) {
        setTimeout(() => {
          this.validateWhereComeFrom();
        }, 500);
      } else {
        this.form
          .get('nombreProyecto')
          ?.setValue(this.selectedValidateProyectoPAA.value.idProyecto);
        // this.idSaveValidar = this.selectedValidateProyectoPAA.value.idProyecto;
        this.form.get('nombreActividad')?.enable();
      }
    }
  }

  uploadIndicadorPI(idProyecto: number) {
    this.parametersService
      .getParamsByIdProyecto(idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            let newCatIndicadorPI: IItemCatalogoResponse[] =
              value.respuesta.map((item) => ({
                idCatalogo: item.idElemento,
                cdOpcion: item.nombre,
                ccExterna: '',
              }));
            this.questions[9].options = mapCatalogData({
              data: {
                catalogo: newCatIndicadorPI,
                mensaje: { codigo: '', mensaje: '' },
              },
              withOptionSelect: true,
              withOptionNoAplica: true,
            });
          } else {
            this.questions[9].options = [];
          }
        },
        error: (err) => {
          this.questions[9].options = [];
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

  setClaveProducto({
    projectSelected,
    activitySelected,
    claveProductoForm,
    numeroProductoForm,
    categorizacionProductoForm,
    tipoProductoForm,
    setClaveProducto,
  }: {
    projectSelected?: IItemProjectsResponse;
    activitySelected: any;
    claveProductoForm: string;
    numeroProductoForm: string;
    categorizacionProductoForm: number;
    tipoProductoForm: number;
    setClaveProducto: boolean;
  }) {
    const cveProducto = getCveProducto({
      catCategoria: this.catCategoria,
      catTipoProducto: this.catTipoProducto,
      projectSelected: projectSelected,
      activitySelected: activitySelected,
      formatCveProducto: claveProductoForm,
      cveProducto: +numeroProductoForm,
      idTipoProducto: tipoProductoForm,
      idCategorizacion: categorizacionProductoForm,
    });

    if (setClaveProducto) {
      this.form.get('claveProducto')?.setValue(cveProducto);
    } else {
      return cveProducto;
    }
  }

  createQuestions() {
    this.questions = [];

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        options: [],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreActividad',
        label: 'Nombre de la Actividad',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        nane: 'numeroProducto',
        label: 'Número del Producto',
        value: '00',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      // Clave de Proyecto - Clave de Actividad - Número de Producto - Clave de Categoría - Tipo de Producto
      new TextboxQuestion({
        idElement: 106,
        nane: 'claveProducto',
        label: 'Clave del Producto',
        value: this.formatCveProduct,
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'nombreProducto',
        label: 'Nombre del Producto',
        rows: 2,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'descripcion',
        label: 'Descripción',
        rows: 4,
        validators: [Validators.required, Validators.maxLength(600)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'categorizacionProducto',
        label: 'Categorización del Producto',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'tipoProducto',
        label: 'Tipo del Producto',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'indicadorMIR',
        label: 'Indicador MIR',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'indicadorPI',
        label: 'Indicador PI',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'nivelEducativo',
        label: 'Nivel Educativo',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'vinculacionOtrosProductos',
        label: 'Vinculación con Otros Productos',
        rows: 4,
        validators: [Validators.required, Validators.maxLength(600)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'continuidadOtrosProductosAnhosAnteriores',
        label: 'Continuidad de Otros Productos de Años Anteriores',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new CheckboxQuestion({
        nane: 'porPublicar',
        label: 'Por Publicar',
      })
    );

    this.questions.push(
      new NumberQuestion({
        idElement: 116,
        nane: 'anhoPublicar',
        label: 'Año para Publicar',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new CheckboxQuestion({
        nane: 'requierePOTIC',
        label: 'Requiere POTIC',
      })
    );

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'descripcionProyectoPOTIC',
        label: 'Descripción de Proyecto POTIC',
        validators: [Validators.maxLength(90)],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    this.form
      .get('porPublicar')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('anhoPublicar')?.enable();
          this.form.get('anhoPublicar')?.setValue(new Date().getFullYear());
          this.form.setValidators([Validators.required]);
        } else {
          this.form.get('anhoPublicar')?.disable();
          this.form.get('anhoPublicar')?.setValue('');
        }
      });
    this.form
      .get('requierePOTIC')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('descripcionProyectoPOTIC')?.enable();
        } else {
          this.form.get('descripcionProyectoPOTIC')?.disable();
          this.form.get('descripcionProyectoPOTIC')?.setValue('');
        }
      });
    if (!this._stateView.editable) {
      this.form.disable();
      this.actions = {
        view: true,
      };
    }
    this.editable = this._stateView.editable;
    if (this.selectedAjustesProyectoPAA) {
      this.validation = true;
      this.disabledAppValidate = true;
    } else {
      this.validation = this._stateView.validation;
    }
  }

  get getQuestions() {
    if (this.selectedAjustesProyectoPAA) {
      const questionsGlobals = [
        new TextboxQuestion({
          nane: 'rubric',
          label: '',
          value: '',
          isRubric: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
        new TextboxQuestion({
          idElement: 138,
          nane: 'supervisorComments',
          label: 'Comentarios del Supervisor',
          value: 'No hay comentarios.',
          onlyLabel: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
        new TextboxQuestion({
          idElement: 78,
          nane: 'presupuestoCommnets',
          label: 'Comentarios de Presupuesto',
          value: 'No hay comentarios.',
          onlyLabel: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
        new TextboxQuestion({
          idElement: 79,
          nane: 'planeacionComments',
          label: 'Comentarios de Planeacion',
          value: 'No hay comentarios.',
          onlyLabel: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
      ];

      const questionComments = [
        new DropdownQuestion({
          idElement: 127,
          nane: 'nombreProyecto',
          label: 'Nombre del Proyecto',
          filter: true,
          options: [],
          validators: [Validators.required, Validators.maxLength(200)],
        }),
        new DropdownQuestion({
          idElement: 128,
          nane: 'nombreActividad',
          label: 'Nombre de la Actividad',
          filter: true,
          options: [],
          validators: [Validators.required, Validators.maxLength(200)],
        }),
        new TextboxQuestion({
          idElement: 129,
          nane: 'numeroProducto',
          label: 'Número del Producto',
          value: '00',
          disabled: true,
          validators: [Validators.required],
        }),
        new DropdownQuestion({
          idElement: 130,
          nane: 'categorizacionProducto',
          label: 'Categorización del Producto',
          filter: true,
          options: [],
          validators: [Validators.required],
        }),
        new DropdownQuestion({
          idElement: 131,
          nane: 'tipoProducto',
          label: 'Tipo del Producto',
          filter: true,
          options: [],
          validators: [Validators.required],
        }),
        new DropdownQuestion({
          idElement: 132,
          nane: 'indicadorMIR',
          label: 'Indicador MIR',
          filter: true,
          options: [],
          validators: [Validators.required],
        }),
        new TextboxQuestion({
          idElement: 133,
          disabled: true,
          nane: 'descripcionProyectoPOTIC',
          label: 'Descripción de Proyecto POTIC',
          validators: [Validators.maxLength(90)],
        }),
        new TextboxQuestion({
          idElement: 134,
          nane: 'agend',
          label: 'Agenda de Autoridad',
          readonly: true,
          value: 'Reunión Nacional',
          validators: [Validators.required, Validators.maxLength(200)],
        }),
        new TextboxQuestion({
          idElement: 135,
          nane: 'kayName',
          label: 'Clave y Nombre de la Acción',
          readonly: true,
          value:
            '2311-001-01-1-IR-001 Realizar una Reunión Nacional de Autoridades Educativas Estatales, bajo una organización regional',
          validators: [Validators.required, Validators.maxLength(200)],
        }),
        // new TextboxQuestion({
        //   nane: 'Calendarización del Gasto',
        //   label: 'Calendarización del Gasto',
        //   value: '',
        //   onlyLabel: true,
        //   validators: [Validators.required, Validators.maxLength(200)],
        // }),
        // new TextboxQuestion({
        //   idElement: 136,
        //   nane: 'Realizar una Reunión Nacional de autoridades educativas estatales, bajo una organización regional',
        //   label:
        //     'Realizar una Reunión Nacional de autoridades educativas estatales, bajo una organización regional',
        //   value: '',
        //   validators: [Validators.required, Validators.maxLength(200)],
        // }),
        new TextboxQuestion({
          idElement: 137,
          nane: 'Calendarización del Gasto',
          label: 'Calendarización del Gasto',
          value: '',
          validators: [Validators.required, Validators.maxLength(200)],
        }),
      ];

      return questionsGlobals.concat(questionComments);
    }
    if (this.selectedValidateProyectoPAA) {
      return [
        new DropdownQuestion({
          idElement: 80,
          nane: 'name',
          value: '',
          label: 'Comentarios',
          filter: true,
          options: [],
          validators: [Validators.required],
        }),
      ];
    }
    return [];
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  submit() {
    const {
      nombreActividad,
      numeroProducto,
      claveProducto,
      nombreProducto,
      descripcion,
      categorizacionProducto,
      tipoProducto,
      indicadorMIR,
      indicadorPI,
      nivelEducativo,
      vinculacionOtrosProductos,
      continuidadOtrosProductosAnhosAnteriores,
      porPublicar,
      anhoPublicar,
      descripcionProyectoPOTIC,
    } = this.form.getRawValue();
    if (this.form.valid) {
      this.isSubmiting = true;
      if (!this.dataSelected?.idProducto) {
        const dataCreate: IProductPayload = {
          nombre: nombreProducto,
          // cveProducto: claveProducto,
          cveProducto: numeroProducto,
          descripcion: descripcion,
          idCategorizacion: categorizacionProducto,
          idTipo: tipoProducto,
          idIndicadorMIR: indicadorMIR === '0' ? null : indicadorMIR,
          idIndicadorPI: indicadorPI === '0' ? null : indicadorPI,
          idNivelEducativo: nivelEducativo === '0' ? null : nivelEducativo,
          vinculacion: vinculacionOtrosProductos,
          idContinuidadOtros:
            continuidadOtrosProductosAnhosAnteriores === '0'
              ? null
              : continuidadOtrosProductosAnhosAnteriores,
          porPublicar: porPublicar ? 'S' : null,
          idAnhoPublicacion: anhoPublicar,
          cveNombreProyectoPOTIC: descripcionProyectoPOTIC,
          cveUsuario: this.dataUser.cveUsuario,
          idActividad: this.activitySelected.idActividad,
          calendarizacion: this.getValuesCalendarizacion(),
          estatus: this.form.valid ? 'C' : 'I',
        };
        this.productsService
          .createProduct(dataCreate)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                this._alertService.showAlert('Se Guardó Correctamente');
                this.resetAllForm();
                this.getSecuenciaProductoByProject(
                  this.projectSelected?.idProyecto!
                );
                this.getProductsByIdActivity(this.activitySelected.idActividad);
                this.dataSelected = undefined;
              }
            },
            error: (err) => {
              this.isSubmiting = false;
            },
          });
      } else {
        const dataUpdate: IProductPayload = {
          nombre: nombreProducto,
          // cveProducto: claveProducto,
          cveProducto: numeroProducto,
          descripcion: descripcion,
          idCategorizacion: categorizacionProducto,
          idTipo: tipoProducto,
          idIndicadorMIR: indicadorMIR === '0' ? null : indicadorMIR,
          idIndicadorPI: indicadorPI === '0' ? null : indicadorPI,
          idNivelEducativo: nivelEducativo === '0' ? null : nivelEducativo,
          vinculacion: vinculacionOtrosProductos,
          idContinuidadOtros:
            continuidadOtrosProductosAnhosAnteriores === '0'
              ? null
              : continuidadOtrosProductosAnhosAnteriores,
          porPublicar: porPublicar ? 'S' : null,
          idAnhoPublicacion: anhoPublicar,
          cveNombreProyectoPOTIC: descripcionProyectoPOTIC,
          cveUsuario: this.dataUser.cveUsuario,
          idActividad: this.activitySelected.idActividad,
          calendarizacion: this.getValuesCalendarizacion(),
          estatus: this.form.valid ? 'C' : 'I',
        };
        this.productsService
          .updateProduct(String(this.dataSelected.idProducto), dataUpdate)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                this._alertService.showAlert('Se Modificó Correctamente');
                this.resetAllForm();
                this.getSecuenciaProductoByProject(
                  this.projectSelected?.idProyecto!
                );
                this.getProductsByIdActivity(this.activitySelected.idActividad);
                this.dataSelected = undefined;
              }
            },
            error: (err) => {
              this.isSubmiting = false;
            },
          });
      }
    }
  }

  getAll() {
    this.getCatalogs();
    this.getProyectsSwitch();
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['categoria']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoProducto']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nombreIndicadorMIR']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['indicadorPI']
      ),

      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['objetivosPrioritario']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs[
        'continuidadOtrosProductosAnhosAnteriores'
        ]
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['anhoPublicar']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nivelEducativo']
      ),
      this.p016MirService.getCatalogMir(this.yearNav),
      this.parametersService.getCatalogPi(this.yearNav),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(
        ([
          dataCategoria,
          dataTipoProducto,
          dataNombreIndicadorMIR,
          dataIndicadorPI,
          dataObjetivosPrioritario,
          dataContinuidadOtrosProductosAnhosAnteriores,
          dataAnhoPublicar,
          dataNivelEducativo,
          dataNombreIndicadorMIRAnhio,
          dataIndicadorPIAnhio,
        ]) => {
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
          this.catIndicadorPI = dataIndicadorPIAnhio.catalogo;
          this.catObjetivosPrioritario = dataObjetivosPrioritario.catalogo;

          // COMMENT: categorizacionProducto
          this.questions[6].options = mapCatalogData({
            data: dataCategoria,
          });

          // COMMENT: tipoProducto
          this.questions[7].options = mapCatalogData({
            data: dataTipoProducto,
          });

          const getCustomNameIndicarMir = (
            item: IItemCatalogoResponse
          ): string => `${item.ccExternaDos} - ${item.cdOpcion}`;
          // COMMENT: indicadorMIR
          this.questions[8].options = mapCatalogData({
            data: dataNombreIndicadorMIRAnhio,
            getCustomValue: getCustomNameIndicarMir,
            withOptionNoAplica: true,
            withOptionSelect: true,
          });

          // COMMENT: nivelEducativo
          this.questions[10].options = mapCatalogData({
            data: dataNivelEducativo,
            withOptionNoAplica: true,
            withOptionSelect: true,
          });

          // COMMENT: continuidadOtrosProductosAnhosAnteriores
          this.questions[12].options = mapCatalogData({
            data: dataContinuidadOtrosProductosAnhosAnteriores,
            withOptionNoAplica: true,
          });

          // COMMENT: anhoPublicar
          this.questions[14].options = mapCatalogData({
            data: dataAnhoPublicar,
            withOptionNoAplica: true,
            withOptionSelect: true,
          });

          this.validateWhereComeFrom();
        }
      );
  }

  async onTableAction(event: TableButtonAction) {
    this.selectedProducto = event;
    const dataAction: IItemProductResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._formsState.setReadonly(true);
        this._formsState.setProduct(event.value);
        this.dataSelected = dataAction;
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          this.form.get('nombreProyecto')?.enable({ emitEvent: false });
          this.form.get('nombreActividad')?.enable({ emitEvent: false });
          this.disabledSubmiting = true;
          if (
            this.selectedValidateProyectoPAA ||
            this.selectedAjustesProyectoPAA
          ) {
            this.idSaveValidar = dataAction.idProducto;
          }
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this._formsState.setReadonly(false);
        this._formsState.setProduct(event.value);
        this.resetAllForm();
        this.dataSelected = dataAction;
        this.form.enable({ emitEvent: false });
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.disabledSubmiting = false;
          this.form.get('claveProducto')?.disable({ emitEvent: false });
          this.form.get('numeroProducto')?.disable({ emitEvent: false });
          if (this.selectedAjustesProyectoPAA) {
            this.idSaveValidar = dataAction.idProducto;
          }
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        const confirm = await this._alertService.showConfirmation({
          message: '¿Está Seguro de Eliminar el Proyecto?',
        });
        if (confirm) {
          // {
          //   id: dataAction.idProyecto,
          //   usuario: this.dataUser.cveUsuario,
          // }
          this.productsService
            .deleteProduct(String(dataAction.idProducto))
            .pipe(takeUntil(this.notifier))
            .subscribe({
              next: (value) => {
                if (value.mensaje.codigo === '200') {
                  this.resetAllForm();
                  this.dataSelected = undefined;
                  this._alertService.showAlert('Se Eliminó Correctamente');
                  this.getSecuenciaProductoByProject(
                    this.projectSelected?.idProyecto!
                  );
                  // this.getSecuenciaProductoByActividad(
                  //   this.form.get('nombreActividad')?.value
                  // );
                  this.getProductsByIdActivity(String(dataAction.idActividad));
                }
              },
              error: (err) => { },
            });
        }
        break;
    }
  }

  uploadDataToForm(dataAction: IItemProductResponse) {
    // this.form.controls['nombreProyecto'].setValue(dataAction.idProyecto);
    // this.form.controls['nombreActividad'].setValue(dataAction.idActividad);
    this.form.controls['numeroProducto'].setValue(dataAction.cveProducto);
    this.form.controls['nombreProducto'].setValue(dataAction.nombre);
    this.form.controls['descripcion'].setValue(dataAction.descripcion);
    this.form.controls['tipoProducto'].setValue(dataAction.idTipoProducto);
    this.form.controls['categorizacionProducto'].setValue(
      dataAction.idCategorizacion
    );
    this.form.controls['indicadorMIR'].setValue(
      dataAction.idIndicadorMIR ?? '0'
    );
    this.form.controls['indicadorPI'].setValue(dataAction.idIndicadorPI ?? '0');
    this.form.controls['nivelEducativo'].setValue(
      dataAction.idNivelEducativo ?? '0'
    );
    this.form.controls['vinculacionOtrosProductos'].setValue(
      dataAction.vinculacionProducto
    );
    this.form.controls['continuidadOtrosProductosAnhosAnteriores'].setValue(
      dataAction.idContinuidad ?? '0'
    );
    this.form.controls['porPublicar'].setValue(dataAction.porPublicar);
    this.form.controls['anhoPublicar'].setValue(dataAction.idAnhoPublicacion);
    this.form.controls['requierePOTIC'].setValue(
      dataAction.nombrePotic ? true : false
    );
    this.form.controls['descripcionProyectoPOTIC'].setValue(
      dataAction.nombrePotic
    );
    // COMMENT: generar la clave al vuelo, mandar a llamar la funcion
    this.setClaveProducto({
      projectSelected: this.projectSelected,
      activitySelected: this.activitySelected,
      claveProductoForm: this.form.get('claveProducto')?.getRawValue() || '',
      numeroProductoForm: this.form.get('numeroProducto')?.getRawValue() || '',
      categorizacionProductoForm:
        this.form.get('categorizacionProducto')?.getRawValue() || '',
      tipoProductoForm: this.form.get('tipoProducto')?.getRawValue() || '',
      setClaveProducto: true,
    });

    const tblCalendarizacion: any =
      document.getElementById('tblCalendarizacion');
    for (let i = 0, col; (col = tblCalendarizacion.rows[1].cells[i]); i++) {
      const monto = dataAction?.productoCalendario[i]?.monto ?? '';
      col.innerText = monto === 0 ? '' : monto;
    }
  }

  resetAllForm() {
    // this.form.controls['numeroProducto'].reset('00');
    this.form.controls['nombreProducto'].reset();
    this.form.controls['descripcion'].reset();
    this.form.controls['tipoProducto'].reset();
    this.form.controls['categorizacionProducto'].reset();
    this.form.controls['indicadorMIR'].reset();
    this.form.controls['indicadorPI'].reset();
    this.form.controls['nivelEducativo'].reset();
    this.form.controls['vinculacionOtrosProductos'].reset();
    this.form.controls['continuidadOtrosProductosAnhosAnteriores'].reset();
    this.form.controls['porPublicar'].reset();
    this.form.controls['anhoPublicar'].reset();
    this.form.controls['requierePOTIC'].reset();
    this.form.controls['descripcionProyectoPOTIC'].reset();

    // this.form.get('numeroProducto')?.setValue('00');
    this.form.get('claveProducto')?.setValue(this.formatCveProduct);
    this.form.get('numeroProducto')?.disable();
    this.form.get('claveProducto')?.disable();
    // COMMENT: resettear calendarización
    const tblCalendarizacion: any =
      document.getElementById('tblCalendarizacion');
    for (let i = 0, col; (col = tblCalendarizacion.rows[1].cells[i]); i++) {
      col.innerText = '';
    }
  }

  newProduct() {
    this.form.enable({ emitEvent: false });
    this.form.get('nombreProyecto')?.reset();
    this.form.get('nombreActividad')?.reset();
    this.form.controls['numeroProducto'].reset('00');
    this.resetAllForm();
    this.questions[9].options = [];
    this.activitySelected = undefined;
    this.disabledSubmiting = false;
    this.dataSelected = undefined;
    this.isCleanForm = false;
    if (this.disabledAppValidate) {
      this.form
        .get('nombreProyecto')
        ?.setValue(this.selectedAjustesProyectoPAA?.value.idProyecto);
      // this.idSaveValidar = this.selectedAjustesProyectoPAA.value.idProyecto;
    }
  }

  getValuesCalendarizacion() {
    const tblCalendarizacion: any =
      document.getElementById('tblCalendarizacion');
    const calendarizacion: any[] = [];
    for (let i = 0, col; (col = tblCalendarizacion.rows[1].cells[i]); i++) {
      // COMMENT: settear un valor
      // col.innerText = '';
      calendarizacion.push({
        mes: i + 1,
        activo: +col.innerText || 0,
      });
    }
    return calendarizacion;
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.notifier.complete();
  }
}
