import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AlertService } from '@common/services/alert.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import {
  Observable,
  Subject,
  Subscription,
  lastValueFrom,
  takeUntil,
} from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { MatDialog } from '@angular/material/dialog';
import { JustificationComponent } from './justification/justification.component';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { IItemConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import {
  IAdecuacionMirPiPayload,
  IItemGetProdModByIdAdecuacionResponse,
  IProductsPayload,
} from '@common/interfaces/seguimiento/products.interface';
import {
  getCveActividad,
  getCveProducto,
  getCveProyecto,
  getGlobalStatus,
  getIdAdecuancionSolicitud,
  getNumeroProducto,
} from '@common/utils/Utils';
import { TIPO_APARTADO } from '../enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { PModMoveService } from '@common/services/seguimiento/modificacion/pModMove.service';
import { IItemConsultaProyectoPorIdResponse } from '@common/interfaces/seguimiento/proyectos.interface';
import { IItemConsultaActividadPorIdResponse } from '@common/interfaces/seguimiento/activities.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  @Input() modify: boolean = false;
  @Input() canSelectOne: boolean = false;
  @Input() listProjectsSeguimiento: any[] = [];
  @Input() catCategoriaR!: ICatalogResponse;
  @Input() catTipoProductoR!: ICatalogResponse;
  @Input() catNombreIndicadorMIRR!: ICatalogResponse;
  @Input() catIndicadorPIR!: ICatalogResponse;
  @Input() catObjetivosPrioritarioR!: ICatalogResponse;
  @Input() catContinuidadOtrosProductosAnhosAnterioresR!: ICatalogResponse;
  @Input() catAnhoPublicarR!: ICatalogResponse;
  @Input() catNivelEducativoR!: ICatalogResponse;
  @Input() position: 'left' | 'right' | null = null;
  @Output() onExeGetProjectsSeguimiento: EventEmitter<any> =
    new EventEmitter<void>();
  data: any[] = [];
  columns = [
    { columnDef: 'claveProyecto', header: 'Clave del<br />Proyecto' },
    { columnDef: 'claveActividad', header: 'Clave de la<br />Actividad' },
    { columnDef: 'claveProducto', header: 'Clave del<br />Producto' },
    { columnDef: 'estatus', header: 'Estatus', width: '150px' },
  ];
  columnsModificationTable = [
    { columnDef: 'claveProyecto', header: 'Clave del<br />Proyecto' },
    { columnDef: 'claveActividad', header: 'Clave de la<br />Actividad' },
    { columnDef: 'claveProducto', header: 'Clave del<br />Producto' },
    { columnDef: 'fullStatus', header: 'Estatus Modificación', width: '150px' },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
  };
  mounths = [
    {
      name: 'Primer Trimestre',
      items: [
        { idMes: 1, name: 'Enero', value: 0 },
        { idMes: 2, name: 'Febrero', value: 0 },
        { idMes: 3, name: 'Marzo', value: 0 },
      ],
    },
    {
      name: 'Segundo Trimestre',
      items: [
        { idMes: 4, name: 'Abril', value: 0 },
        { idMes: 5, name: 'Mayo', value: 0 },
        { idMes: 6, name: 'Junio', value: 0 },
      ],
    },
    {
      name: 'Tercer Trimestre',
      items: [
        { idMes: 7, name: 'Julio', value: 0 },
        { idMes: 8, name: 'Agosto', value: 0 },
        { idMes: 9, name: 'Septiembre', value: 0 },
      ],
    },
    {
      name: 'Cuarto Trimestre',
      items: [
        { idMes: 10, name: 'Octubre', value: 0 },
        { idMes: 11, name: 'Noviembre', value: 0 },
        { idMes: 12, name: 'Diciembre', value: 0 },
      ],
    },
  ];

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  private _body = document.querySelector('body');

  validation = false;
  dataUser: IDatosUsuario;
  yearNav: string;
  catObjetivosPrioritario: IItemCatalogoResponse[] = [];
  catIndicadorPI: IItemCatalogoResponse[] = [];
  dataSelected: any = undefined;
  selectedProducto: any = null;
  dataProjects: any[] = [];
  projectSelected: any = null;
  dataActivities: any[] = [];
  activitySelected: any = null;
  disabledSubmiting: boolean = false;
  isSubmiting: boolean = false;
  selectedSolicitud: IItemConsultaSolicitudResponse;
  whatModuleStart: string | undefined;
  secuencialProducto: number = 0;
  productSelected: any = null;
  pModMoveSubscription: Subscription | undefined;
  productoModByAdecuacion!: IItemGetProdModByIdAdecuacionResponse;
  justificacionMir!: IAdecuacionMirPiPayload | null;
  justificacionPi!: IAdecuacionMirPiPayload | null;
  canEdit: boolean = true;
  dataModificacionTable: any[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _tblWidthService: TblWidthService,
    private _alertService: AlertService,
    private _dialog: MatDialog,
    private projectsService: ProjectsService,
    private activitiesServiceS: ActivitiesFollowService,
    private productsService: ProductsService,
    private activitiesFollowService: ActivitiesFollowService,
    private pModMoveService: PModMoveService
  ) {
    this.canEdit = this.ls.get('canEdit');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
    this.canEdit = this.selectedSolicitud.estatusId !== 2237;
    this._body?.classList.add('hideW');
    this.whatModuleStart = this.ls.get('whatModuleStart');
    if (!this.canEdit) {
      this.actions.delete = false;
      this.actions.edit = false;
    }
  }

  ngOnInit(): void {
    if (this.position) {
      this.whatModuleStart = undefined;
    }
    this.buildForm(); //COMMENT: Dejar el build aqui para cargar la modificacion
    this.validateWhatParamsInit();

    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.data = [];
          this.form.get('nombreActividad')?.reset();
          this.form.get('nombreActividad')?.enable({ emitEvent: false });
          this.form.get('numeroProducto')?.setValue('00');
          this.form.get('claveProducto')?.setValue('0000-000-00-0-00');
          this.form.get('indicadorPI')?.setValue('');
          this.questions[9].options = [];
          if (this.position !== 'right') {
            this.getActivities(value);
          }
          const findedProject = this.dataProjects.filter(
            (item) => item.idProyecto === value
          );
          if (findedProject?.length > 0) {
            this.projectSelected = findedProject[0];
            this.getSecuenciaProductoByProject(this.projectSelected.idProyecto);
          }

          this.setClaveProducto({
            formatCveProducto:
              this.form.get('claveProducto')?.getRawValue() || '',
            cveProducto: this.form.get('numeroProducto')?.getRawValue() || '',
            idCategorizacion:
              this.form.get('categorizacionProducto')?.getRawValue() || '',
            idTipoProducto: this.form.get('tipoProducto')?.getRawValue() || '',
            setClaveProducto: true,
          });
          this.uploadIndicadorPI(value);
          if (this.position === 'left') {
            this.data = [];
            this.questions[4].options = [];
            this.form.get('nombreProducto')?.disable({ emitEvent: false });
            this.resetAllForm();

            this.pModMoveService.sendData({
              from: 'left',
              isNew: false,
              viewType: 'view',
              data: 'resetAllForm',
            });
          }
        }
      });

    this.form
      .get('nombreActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          if (!this.position) {
            if (this.canEdit) {
              this.form.enable({ emitEvent: false });
            }
            this.resetAllForm();
            this.form.get('numeroProducto')?.disable({ emitEvent: false });
            this.form.get('claveProducto')?.disable({ emitEvent: false });
          }
          const findedActivity = this.dataActivities.filter(
            (item) => item.idActividad === value
          );
          if (findedActivity?.length > 0) {
            this.activitySelected = findedActivity[0];
          }
          if (this.position === 'left') {
            this.form.get('nombreProducto')?.disable({ emitEvent: false });
          }
          if (this.position !== 'right') {
            this.getProductsByIdActivity(value);
          }
        }
      });

    if (this.position === 'left') {
      this.form
        .get('nombreProducto')
        ?.valueChanges.pipe(takeUntil(this.notifier))
        .subscribe((value) => {
          if (value) {
            const productSelected = this.data.find(
              (item) => item.idProducto === value
            );
            if (productSelected) {
              let isNewForModification = true;
              let project = this.projectSelected;
              let activity = this.activitySelected;
              let productMod = null;
              if (this.dataModificacionTable.length) {
                const finded = this.dataModificacionTable.find(
                  (item) => item.productoReferencia.idProducto === value
                );
                if (finded) {
                  isNewForModification = false;
                  project = finded.project;
                  activity = finded.activity;
                  productMod = finded.productoModificacion;
                }
              }
              this.onTableAction({
                name: 'view',
                value: productSelected,
              });
              this.pModMoveService.sendData({
                from: 'left',
                isNew: isNewForModification,
                viewType: 'edit',
                data: {
                  selectedProject: project,
                  selectedActivity: activity,
                  selectedProduct: productSelected,
                  selectedProductModification: productMod,
                },
              });
            }
          }
        });
    }

    this.form
      .get('categorizacionProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.setClaveProducto({
            formatCveProducto:
              this.form.get('claveProducto')?.getRawValue() || '',
            cveProducto: this.form.get('numeroProducto')?.getRawValue() || '',
            idCategorizacion:
              this.form.get('categorizacionProducto')?.getRawValue() || '',
            idTipoProducto: this.form.get('tipoProducto')?.getRawValue() || '',
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
            formatCveProducto:
              this.form.get('claveProducto')?.getRawValue() || '',
            cveProducto: this.form.get('numeroProducto')?.getRawValue() || '',
            idCategorizacion:
              this.form.get('categorizacionProducto')?.getRawValue() || '',
            idTipoProducto: this.form.get('tipoProducto')?.getRawValue() || '',
            setClaveProducto: true,
          });
        }
      });

    if (this.position) {
      this.pModMoveSubscription = this.pModMoveService.pModMove$.subscribe({
        next: (value) => {
          if (value) {
            if (this.position === 'right' && value.from === 'left') {
              if (value.data === 'resetAllForm') {
                this.resetAllForm();
                this.productSelected = null;
                this.form.disable({ emitEvent: false });
                this.form
                  .get('nombreProducto')
                  ?.setValue('', { emitEvent: false });
                this.questions[0].options = [];
                this.questions[1].options = [];
              } else {
                this.dataSelected = null;
                if (value.isNew) {
                  this.productSelected = value.data.selectedProduct;

                  this.dataProjects = [value.data.selectedProject];
                  this.dataActivities = [value.data.selectedActivity];
                  this.questions[0].options = this.dataProjects.map((item) => {
                    return {
                      id: item.idProyecto,
                      value: item.nombre,
                    };
                  });
                  this.questions[1].options = this.dataActivities
                    .filter((item) => item.estatus !== 'I')
                    .map((item) => {
                      return {
                        id: item.idActividad,
                        value: item.cxNombreActividad,
                      };
                    });
                  this.form
                    .get('nombreProyecto')
                    ?.setValue(value.data.selectedProject.idProyecto, {
                      emitEvent: true,
                    });
                  this.form
                    .get('nombreActividad')
                    ?.setValue(value.data.selectedActivity.idActividad, {
                      emitEvent: true,
                    });
                  this.onTableAction({
                    name: this.canEdit ? value.viewType : 'view',
                    value: value.data.selectedProduct,
                  });
                } else {
                  this.dataSelected = value.data.selectedProductModification;
                  this.productSelected = value.data.selectedProductModification;
                  this.projectSelected = value.data.selectedProject;
                  this.dataProjects = [this.projectSelected];
                  this.questions[0].options = this.dataProjects.map((item) => {
                    return {
                      id: item.idProyecto,
                      value: item.nombre,
                    };
                  });
                  this.form
                    .get('nombreProyecto')
                    ?.setValue(this.projectSelected.idProyecto, {
                      emitEvent: false,
                    });
                  this.activitySelected = value.data.selectedActivity;
                  this.dataActivities = [this.activitySelected];
                  this.questions[1].options = this.dataActivities.map(
                    (item) => {
                      return {
                        id: item.idActividad,
                        value: item.cxNombreActividad,
                      };
                    }
                  );
                  this.form
                    .get('nombreActividad')
                    ?.setValue(this.activitySelected.idActividad, {
                      emitEvent: false,
                    });
                  this.data = [this.dataSelected];
                  this.questions[4].options = this.data.map((item) => {
                    return {
                      id: item.idProducto,
                      value: item.nombre,
                    };
                  });
                  this.onTableAction({
                    name: this.canEdit ? value.viewType : 'view',
                    value: this.dataSelected,
                  });
                }

                this.justificacionMir = this.productSelected.adecuacionMir;
                this.justificacionPi = this.productSelected.adecuacionPi;
              }
            }
            if (this.position === 'left' && value.from === 'right') {
              if (value.data === 'itemSaved') {
                this.getConsultarProductosByIdAdecuacion();
              }
            }
          }
        },
      });
    }
  }

  validateWhatParamsInit() {
    if (this.position) {
      if (this.position === 'left') {
        this.getConsultarProyectos({
          excluirCortoPlazo: false,
          priorizarProyectoAsociado: false,
          idSolicitud: this.selectedSolicitud.idSolicitud ?? 0,
        });
      }
    } else {
      if (
        this.whatModuleStart === 'proyects' ||
        this.whatModuleStart === 'activities' ||
        this.whatModuleStart === 'products'
      ) {
        this.getConsultarProyectos({
          excluirCortoPlazo: true,
          priorizarProyectoAsociado: true,
          idSolicitud: this.selectedSolicitud.idSolicitud ?? 0,
        });
      } else {
        this.getConsultarProyectos({
          excluirCortoPlazo: false,
          priorizarProyectoAsociado: false,
          idSolicitud: 0,
        });
      }
    }
  }

  getConsultarProductosByIdAdecuacion() {
    this.productsService
      .getProdModiByIdAdecuacionSolicitud(
        getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.productos,
          tipoModificacion: MODIFICATION_TYPE.modificacion,
        })
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: async (value) => {
          if (value.codigo === '200' && value.respuesta.length) {
            const tmpArray: any[] = [];
            for (const item of value.respuesta) {
              let project: any = null;
              const findedProject = this.dataProjects.find(
                (itemFind) =>
                  itemFind.idProyecto === item.productoReferencia.idProyecto
              );
              if (findedProject) {
                project = findedProject;
              } else {
                project = await this.getProjectByIdPromise(
                  item.productoReferencia.idProyecto
                );
              }

              let activity: IItemConsultaActividadPorIdResponse;
              const findedActivity = this.dataActivities.find(
                (itemFind) => itemFind.idActividad
              );
              if (findedActivity) {
                activity = findedActivity;
              } else {
                activity = await this.getActivityByIdPromise(
                  item.productoReferencia.idActividad
                );
              }

              tmpArray.push({
                ...item,
                project,
                activity,
                claveProyecto: getCveProyecto({
                  cveProyecto: project.clave,
                  yearNav: project.anhio,
                  cveUnidad: project.claveUnidad,
                }),
                claveActividad: getCveActividad({
                  numeroActividad: activity.cveActividad,
                  projectSelected: project,
                }),
                claveProducto: getCveProducto({
                  catCategoria: this.catCategoriaR.catalogo,
                  catTipoProducto: this.catTipoProductoR.catalogo,
                  activitySelected: activity,
                  projectSelected: project,
                  cveProducto: +item.productoReferencia.cveProducto,
                  idCategorizacion: item.productoReferencia.idCategorizacion,
                  idTipoProducto: item.productoReferencia.idTipoProducto,
                }),
                fullStatus: getGlobalStatus(item.productoModificacion.estatus),
              });
            }
            this.dataModificacionTable = tmpArray;
          } else {
            this.dataModificacionTable = [];
          }
        },
      });
  }

  getProjectByIdPromise(
    idProyecto: number
  ): Promise<IItemConsultaProyectoPorIdResponse> {
    return new Promise<IItemConsultaProyectoPorIdResponse>(
      (resolve, reject) => {
        this.projectsService
          .getProjectById(idProyecto)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.codigo === '200' && value.respuesta) {
                resolve(value.respuesta);
              } else {
                reject([]);
              }
            },
            error: (err) => {
              reject(err);
            },
          });
      }
    );
  }

  getActivityByIdPromise(
    idActividad: number
  ): Promise<IItemConsultaActividadPorIdResponse> {
    return new Promise<IItemConsultaActividadPorIdResponse>(
      (resolve, reject) => {
        this.activitiesServiceS
          .getActivityById(idActividad)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.codigo === '200' && value.respuesta) {
                resolve(value.respuesta);
              } else {
                reject(null);
              }
            },
            error: (err) => {
              reject(null);
            },
          });
      }
    );
  }

  async buildForm(): Promise<void> {
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
        nane: 'claveProducto',
        label: 'Clave del Producto',
        value: '0000-000-000-00-00',
        disabled: true,
        validators: [Validators.required],
      })
    );

    if (!this.canSelectOne) {
      this.questions.push(
        new TextareaQuestion({
          nane: 'nombreProducto',
          label: 'Nombre del Producto',
          rows: 2,
          validators: [Validators.required, Validators.maxLength(250)],
        })
      );
    } else {
      this.questions.push(
        new DropdownQuestion({
          nane: 'nombreProducto',
          label: 'Nombre del Producto',
          filter: true,
          options: [],
          validators: [Validators.required],
        })
      );
    }

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
        options: mapCatalogData({
          data: this.catCategoriaR,
        }),
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'tipoProducto',
        label: 'Tipo del Producto',
        filter: true,
        options: mapCatalogData({
          data: this.catTipoProductoR,
        }),
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'indicadorMIR',
        label: 'Indicador MIR',
        filter: true,
        options: mapCatalogData({
          data: this.catNombreIndicadorMIRR,
          withOptionNoAplica: true,
          withOptionSelect: true,
        }),
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
        options: mapCatalogData({
          data: this.catNivelEducativoR,
          withOptionNoAplica: true,
          withOptionSelect: true,
        }),
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
        options: mapCatalogData({
          data: this.catContinuidadOtrosProductosAnhosAnterioresR,
          withOptionNoAplica: true,
        }),
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
        validators: [Validators.maxLength(300)],
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
        } else {
          this.form.get('anhoPublicar')?.disable();
          this.form.get('anhoPublicar')?.setValue('');
        }
      });
    this.form.get('requierePOTIC')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.form.get('descripcionProyectoPOTIC')?.enable();
      } else {
        this.form.get('descripcionProyectoPOTIC')?.disable();
        this.form.get('descripcionProyectoPOTIC')?.setValue('');
      }
    });
    if (!this.canEdit) {
      this.form.disable();
      this.form.get('nombreProyecto')?.enable();
    }
    if (this.modify && this.position) {
      this.form.disable();
      if (this.position === 'left') {
        this.form.get('nombreProyecto')?.enable({ emitEvent: false });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['catIndicadorPIR']?.currentValue) {
      this.catIndicadorPI = this.catIndicadorPIR.catalogo;
    }
    if (changes['catObjetivosPrioritarioR']?.currentValue) {
      this.catObjetivosPrioritario = this.catObjetivosPrioritarioR.catalogo;
    }
  }

  get showBtnSave(): boolean {
    if (this.position) {
      if (this.position === 'right' && this.productSelected && this.canEdit) {
        return true;
      } else {
        return false;
      }
    } else {
      return !this.modify && this.canEdit;
    }
  }

  getConsultarProyectos({
    excluirCortoPlazo,
    priorizarProyectoAsociado,
    idSolicitud,
  }: {
    excluirCortoPlazo: boolean;
    priorizarProyectoAsociado: boolean;
    idSolicitud: number;
  }) {
    this.projectsService
      .getConsultarProyectos(
        this.yearNav,
        excluirCortoPlazo,
        idSolicitud,
        priorizarProyectoAsociado
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            if (!this.position) {
              this.dataProjects = value.respuesta.filter((item) => {
                if (this.whatModuleStart === 'proyects') {
                  if (item.estatus !== 'B' && item.estatus !== 'T') {
                    return true;
                  }
                } else {
                  if (item.estatus === 'O') {
                    return true;
                  }
                }
                return false;
              });
            }
            if (this.position === 'left') {
              this.dataProjects = value.respuesta.filter(
                (item) =>
                  item.estatus === 'O' &&
                  this.dataUser.perfilLaboral.cveUnidad === item.claveUnidad
              );
              this.getConsultarProductosByIdAdecuacion();
            }
            this.questions[0].options = this.dataProjects.map((item) => {
              return {
                id: item.idProyecto,
                value: item.nombre,
              };
            });
          } else {
            if (this.whatModuleStart === 'products') {
              this.getConsultarProyectos({
                excluirCortoPlazo: false,
                priorizarProyectoAsociado: false,
                idSolicitud: 0,
              });
            }
          }
        },
        error: () => { },
      });
  }

  getActivities(idProject: number) {
    let excluirCortoPlazo: boolean = false,
      idSolicitud: number = 0; //REVIEW: Depndiendo el modulo de inicio se valida para excluir los CP
    if (
      this.whatModuleStart === 'proyects' ||
      this.whatModuleStart === 'activities'
    ) {
      excluirCortoPlazo = true;
      idSolicitud = this.selectedSolicitud.idSolicitud ?? 0;
    }
    this.activitiesFollowService
      .getActivityByProjectIdSolicitud(
        idProject,
        excluirCortoPlazo,
        idSolicitud
      )
      .pipe(takeUntil(this.notifier))
      .subscribe(async (response) => {
        const tmpData: any[] = [];
        for (const item of response.respuesta) {
          if (item.csEstatus !== 'I') {
            tmpData.push({
              id: item.idActividad,
              value: item.cxNombreActividad,
            });
          }
        }
        this.dataActivities = response.respuesta;
        this.questions[1].options = tmpData;

        const selectedActividad = this.ls.get('selectedActividad');
        if (selectedActividad) {
          this.form
            .get('nombreActividad')
            ?.setValue(selectedActividad.idActividad);
          this.ls.remove('selectedActividad');
        }
      });
  }

  getSecuenciaProductoByProject(idProject: number) {
    this.productsService
      .getSecuencialPorProyecto(idProject)
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        this.secuencialProducto = response.respuesta;
        this.form
          .get('numeroProducto')
          ?.setValue(getNumeroProducto(this.secuencialProducto));
      });
  }

  getProductsByIdActivity(idActivity: string) {
    let excluirCortoPlazo: boolean = false,
      idSolicitud: number = 0;
    if (
      this.whatModuleStart === 'proyects' ||
      this.whatModuleStart === 'activities' ||
      this.whatModuleStart === 'products'
    ) {
      excluirCortoPlazo = true;
      idSolicitud = this.selectedSolicitud.idSolicitud ?? 0;
    }
    this.productsService
      .getProductByActivityIdSolicitud(
        idActivity,
        excluirCortoPlazo,
        idSolicitud
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (value.respuesta?.length > 0) {
              this.data = value.respuesta.map((item) => {
                return {
                  ...item,
                  claveProyecto: getCveProyecto({
                    cveProyecto: this.projectSelected?.clave,
                    yearNav: this.projectSelected.anhio,
                    cveUnidad: this.projectSelected.claveUnidad,
                  }),
                  claveActividad: getCveActividad({
                    numeroActividad: this.activitySelected?.cveActividad,
                    projectSelected: this.projectSelected,
                  }),
                  claveProducto: this.setClaveProducto({
                    cveProducto: +item.cveProducto,
                    idCategorizacion: item.idCategorizacion,
                    idTipoProducto: item.idTipoProducto,
                    setClaveProducto: false,
                  }),
                  estatus: this.getStatus(item.estatus),
                };
              });
              if (this.position === 'left') {
                this.questions[4].options = this.data.map((item) => {
                  return {
                    id: item.idProducto,
                    value: item.nombre,
                  };
                });
                this.form.get('nombreProducto')?.enable({ emitEvent: false });
              }
            } else {
              this.data = [];
            }
            if (!this.position) {
              this.setClaveProducto({
                formatCveProducto:
                  this.form.get('claveProducto')?.getRawValue() || '',
                cveProducto:
                  this.form.get('numeroProducto')?.getRawValue() || '',
                idCategorizacion:
                  this.form.get('categorizacionProducto')?.getRawValue() || '',
                idTipoProducto:
                  this.form.get('tipoProducto')?.getRawValue() || '',
                setClaveProducto: true,
              });

              const selectedProducto = this.ls.get('selectedProducto');
              if (selectedProducto) {
                this.onTableAction(selectedProducto);
                this.ls.remove('selectedProducto');
              }
            }
          }
        },
        error: (err) => { },
      });
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  submit() {
    const {
      numeroProducto,
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
      let idAdecuacionSolicitud =
        this.position === 'right'
          ? getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.productos,
            tipoModificacion: MODIFICATION_TYPE.modificacion,
          })
          : getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.productos,
            tipoModificacion: MODIFICATION_TYPE.alta,
          });
      if (!this.dataSelected?.idProducto) {
        const dataCreate: IProductsPayload = {
          nombre: nombreProducto,
          cveProducto: numeroProducto,
          descripcion: descripcion,
          idCategorizacion: categorizacionProducto,
          idTipo: tipoProducto,
          idIndicadorMIR: indicadorMIR,
          idIndicadorPI: indicadorPI,
          idNivelEducativo: nivelEducativo,
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
          idAdecuacionSolicitud,
          idProductoReferencia:
            this.position === 'right' ? this.productSelected.idProducto : null,
          adecuacionMir: this.justificacionMir,
          adecuacionPi: this.justificacionPi,
        };
        this.productsService
          .createProduct(dataCreate)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.codigo === '200') {
                this._alertService.showAlert('Se Guardó Correctamente');
                if (!this.position) {
                  this.resetAllForm();
                  this.getSecuenciaProductoByProject(
                    this.projectSelected?.idProyecto!
                  );
                  // this.getSecuenciaProductoByActividad(
                  //   this.form.get('nombreActividad')?.value
                  // );
                  this.getProductsByIdActivity(
                    this.activitySelected.idActividad
                  );
                  this.dataSelected = undefined;
                  if (this.whatModuleStart === 'products') {
                    this.validateWhatParamsInit();
                  }
                }
                if (this.position === 'right') {
                  lastValueFrom(
                    this.productsService.getProductById(
                      value.respuesta.idProducto
                    )
                  ).then((response) => {
                    this.pModMoveService.sendData({
                      from: 'right',
                      isNew: false,
                      viewType: 'view',
                      data: 'itemSaved',
                    });
                    this.dataSelected = response.respuesta;
                    this.onTableAction({
                      name: 'edit',
                      value: response.respuesta,
                    });
                  });
                }
              }
            },
            error: (err) => {
              this.isSubmiting = false;
            },
          });
      } else {
        const dataUpdate: any = {
          nombre: nombreProducto,
          cveProducto: numeroProducto,
          descripcion: descripcion,
          idCategorizacion: categorizacionProducto,
          idTipo: tipoProducto,
          idIndicadorMIR: indicadorMIR,
          idIndicadorPI: indicadorPI,
          idNivelEducativo: nivelEducativo,
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
          idAdecuacionSolicitud,
          idProductoReferencia:
            this.position === 'right' ? this.productSelected.idProducto : null,
          adecuacionMir: this.justificacionMir,
          adecuacionPi: this.justificacionPi,
        };
        this.productsService
          .updateProduct(String(this.dataSelected.idProducto), dataUpdate)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                this._alertService.showAlert('Se Modificó Correctamente');
                if (!this.position) {
                  this.resetAllForm();
                  this.getProductsByIdActivity(
                    this.activitySelected.idActividad
                  );
                  this.getSecuenciaProductoByProject(
                    this.projectSelected?.idProyecto!
                  );
                  // this.getSecuenciaProductoByActividad(
                  //   this.form.get('nombreActividad')?.value
                  // );
                  this.dataSelected = undefined;
                }
                if (this.position === 'right') {
                  this.pModMoveService.sendData({
                    from: 'right',
                    isNew: false,
                    viewType: 'view',
                    data: 'itemSaved',
                  });
                }
              }
            },
            error: (err) => {
              this.isSubmiting = false;
            },
          });
      }
    }
  }

  async onTableAction(event: TableButtonAction) {
    this.selectedProducto = event;
    const dataAction: any = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view: {
        if (!this.position) {
          this.dataSelected = dataAction;
        }
        this.resetAllForm();
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          if (this.position === 'right') {
            this.form.get('nombreProyecto')?.disable({ emitEvent: false });
            this.form.get('nombreActividad')?.disable({ emitEvent: false });
          } else {
            this.form.get('nombreProyecto')?.enable({ emitEvent: false });
            this.form.get('nombreActividad')?.enable({ emitEvent: false });
          }
          if (this.position === 'left') {
            this.form.get('nombreProducto')?.enable({ emitEvent: false });
          }
          this.disabledSubmiting = true;
        }, 100);
        break;
      }
      case TableConsts.actionButton.edit: {
        this.resetAllForm();
        if (!this.position) {
          this.dataSelected = dataAction;
        }
        this.form.enable({ emitEvent: false });
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.disabledSubmiting = false;
          if (this.position === 'right') {
            this.form.get('nombreProyecto')?.disable({ emitEvent: false });
            this.form.get('nombreActividad')?.disable({ emitEvent: false });
          }
          this.form.get('claveProducto')?.disable({ emitEvent: false });
          this.form.get('numeroProducto')?.disable({ emitEvent: false });
        }, 100);
        break;
      }
      case TableConsts.actionButton.delete: {
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Producto?',
          });
          if (confirm) {
            this.productsService
              .deleteProduct(String(dataAction.idProducto))
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this.resetAllForm();
                    this.dataSelected = undefined;
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getProductsByIdActivity(
                      String(dataAction.idActividad)
                    );
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
      }
    }
  }

  async onTableModificacionesAction(event: TableButtonAction) {
    const dataAction: any = event.value.productoReferencia;
    switch (event.name) {
      case TableConsts.actionButton.view: {
        this.projectSelected = event.value.project;
        this.activitySelected = event.value.activity;
        this.resetAllForm();
        setTimeout(() => {
          this.form
            .get('nombreProyecto')
            ?.setValue(event.value.project.idProyecto, {
              emitEvent: true,
            });
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          this.form
            .get('nombreActividad')
            ?.setValue(event.value.activity.idActividad, {
              emitEvent: true,
            });
          this.form
            .get('nombreProducto')
            ?.setValue(event.value.productoReferencia.idProducto, {
              emitEvent: true,
            });

          this.form.get('nombreProyecto')?.enable({ emitEvent: false });
          this.form.get('nombreActividad')?.enable({ emitEvent: false });
          this.form.get('nombreProducto')?.enable({ emitEvent: false });
          this.pModMoveService.sendData({
            from: 'left',
            isNew: false,
            viewType: 'view',
            data: {
              selectedProject: this.projectSelected,
              selectedActivity: this.activitySelected,
              selectedProduct: event.value.productoReferencia,
              selectedProductModification: event.value.productoModificacion,
            },
          });
        }, 100);
        break;
      }
      case TableConsts.actionButton.edit: {
        this.projectSelected = event.value.project;
        this.activitySelected = event.value.activity;
        this.resetAllForm();
        this.form.enable({ emitEvent: false });
        setTimeout(() => {
          this.form
            .get('nombreProyecto')
            ?.setValue(event.value.project.idProyecto, {
              emitEvent: true,
            });
          this.uploadDataToForm(dataAction);
          this.form
            .get('nombreActividad')
            ?.setValue(event.value.activity.idActividad, {
              emitEvent: true,
            });
          this.form
            .get('nombreProducto')
            ?.setValue(event.value.productoReferencia.idProducto, {
              emitEvent: true,
            });
          this.form.get('claveProducto')?.disable({ emitEvent: false });
          this.form.get('numeroProducto')?.disable({ emitEvent: false });
          this.pModMoveService.sendData({
            from: 'left',
            isNew: false,
            viewType: 'edit',
            data: {
              selectedProject: this.projectSelected,
              selectedActivity: this.activitySelected,
              selectedProduct: event.value.productoReferencia,
              selectedProductModification: event.value.productoModificacion,
            },
          });
        }, 100);
        break;
      }
      case TableConsts.actionButton.delete: {
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Modificación del Producto?',
          });
          if (confirm) {
            this.productsService
              .deleteAdecuacion({
                idReferencia: dataAction.idProducto,
                idAdecuacionSolicitud: getIdAdecuancionSolicitud({
                  tipoApartado: TIPO_APARTADO.productos,
                  tipoModificacion: MODIFICATION_TYPE.modificacion,
                }),
              })
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getConsultarProductosByIdAdecuacion();
                    this.resetAllForm();
                    this.form.get('nombreProyecto')?.setValue('', {
                      emitEvent: false,
                    });
                    this.form.get('nombreActividad')?.disable({
                      emitEvent: false,
                    });
                    this.form.get('nombreActividad')?.setValue('', {
                      emitEvent: false,
                    });
                    this.questions[1].options = [];
                    this.form.get('nombreProducto')?.disable({
                      emitEvent: false,
                    });
                    this.form.get('nombreProducto')?.setValue('', {
                      emitEvent: false,
                    });
                    this.questions[4].options = [];
                    this.pModMoveService.sendData({
                      from: 'left',
                      isNew: false,
                      viewType: 'view',
                      data: 'resetAllForm',
                    });
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
      }
    }
  }

  uploadIndicadorPI(idProyecto: number) {
    this.productsService
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

  addJustification(from: 'MIR' | 'PI') {
    let data: unknown;
    if (from === 'MIR') {
      data = this.justificacionMir;
    }
    if (from === 'PI') {
      data = this.justificacionPi;
    }
    const dialogRef = this._dialog.open(JustificationComponent, {
      data,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (from === 'MIR') {
          this.justificacionMir = result;
        }
        if (from === 'PI') {
          this.justificacionPi = result;
        }
      }
    });
  }

  setClaveProducto({
    cveProducto,
    idCategorizacion,
    idTipoProducto,
    setClaveProducto,
    formatCveProducto,
  }: {
    cveProducto: number;
    idCategorizacion: number;
    idTipoProducto: number;
    setClaveProducto: boolean;
    formatCveProducto?: string;
  }) {
    const cveProductoFull = getCveProducto({
      catCategoria: this.catCategoriaR.catalogo,
      catTipoProducto: this.catTipoProductoR.catalogo,
      activitySelected: this.activitySelected,
      projectSelected: this.projectSelected,
      formatCveProducto,
      cveProducto,
      idCategorizacion,
      idTipoProducto,
    });

    if (setClaveProducto) {
      this.form.get('claveProducto')?.setValue(cveProductoFull);
      return;
    } else {
      return cveProductoFull;
    }
  }

  uploadDataToForm(dataAction: any) {
    this.form.controls['numeroProducto'].setValue(dataAction.cveProducto);
    if (this.position !== 'left') {
      this.form.controls['nombreProducto'].setValue(dataAction.nombre);
    }
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
      formatCveProducto: this.form.get('claveProducto')?.getRawValue() || '',
      cveProducto: this.form.get('numeroProducto')?.getRawValue() || '',
      idCategorizacion:
        this.form.get('categorizacionProducto')?.getRawValue() || '',
      idTipoProducto: this.form.get('tipoProducto')?.getRawValue() || '',
      setClaveProducto: true,
    });

    for (const item of this.mounths) {
      for (const itemHijo of item.items) {
        const finded = dataAction.productoCalendario.filter(
          (itemFilter) => itemFilter.mes === itemHijo.idMes
        );
        if (finded.length) {
          itemHijo.value = finded[0].monto;
        }
      }
    }
  }

  resetAllForm() {
    // this.form.controls['numeroProducto'].reset('00');
    if (!this.position) {
      this.form.controls['nombreProducto'].reset();
    }
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

    this.form.markAsUntouched();
    this.form.get('claveProducto')?.setValue('0000-000-00-0-00');
    this.form.get('numeroProducto')?.disable();
    this.form.get('claveProducto')?.disable();
    // COMMENT: resettear calendarización
    for (const item of this.mounths) {
      for (const itemHijo of item.items) {
        itemHijo.value = 0;
      }
    }
  }

  get disableAdeMIR(): boolean {
    const { indicadorMIR } = this.form.getRawValue();
    return this.justificacionMir
      ? false
      : (this.productSelected.idIndicadorMIR ?? '0') === indicadorMIR;
  }

  get disableAdePI(): boolean {
    const { indicadorPI } = this.form.getRawValue();
    return this.justificacionPi
      ? false
      : (this.productSelected.idIndicadorPI ?? '0') === indicadorPI;
  }

  getValuesCalendarizacion() {
    const calendarizacion: any[] = [];
    for (const item of this.mounths) {
      for (const itemHijo of item.items) {
        calendarizacion.push({
          mes: calendarizacion.length + 1,
          activo: +itemHijo.value || 0,
        });
      }
    }
    return calendarizacion;
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

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.notifier.complete();
    this.pModMoveSubscription?.unsubscribe();
  }
}
