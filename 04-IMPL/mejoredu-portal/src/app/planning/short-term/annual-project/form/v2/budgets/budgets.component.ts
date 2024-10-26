import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { Observable, Subject, forkJoin, take, takeUntil } from 'rxjs';
import { FormsStateService } from '../../services/forms-state.service.ts.service';
import { AlertService } from '@common/services/alert.service';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TblWidthService } from '@common/services/tbl-width.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { environment } from 'src/environments/environment';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { Spent } from './classes/spent.class';
import { SpentTable } from './classes/spent-table.class';
import { TableColumn } from '@common/models/tableColumn';
import { ProjectsService } from '@common/services/projects.service';
import { ActivitiesService } from '@common/services/activities.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import {
  mapOptionProducts,
  mapOptionProjects,
} from '@common/mapper/data-options.mapper';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import { ProductsService } from '@common/services/products.service';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import { BudgetsService } from '@common/services/budgets.service';
import { StateViewService } from 'src/app/planning/short-term/services/state-view.service';
import {
  Calendarizacion,
  IBudgetPayload,
  IItmeBudgetResponse,
  PartidasPresupuestale,
} from '@common/interfaces/short-term/budget.interface';
import {
  getCveActividad,
  getCveProducto,
  getCveProyecto,
  getGlobalStatus,
  getNumeroAccion,
  getNumeroNivelEducativo,
} from '@common/utils/Utils';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
})
export class BudgetsComponent extends SpentTable implements OnDestroy {
  String(arg0: number) {
    return String(arg0.toFixed(2));
  }
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  data: any[] = [];
  columns: TableColumn[] = [
    {
      columnDef: 'claveProyecto',
      header: 'Clave del<br />Proyecto',
      width: '180px',
    },
    {
      columnDef: 'claveActividad',
      header: 'Clave de la<br />Actividad',
      width: '200px',
    },
    {
      columnDef: 'claveProducto',
      header: 'Clave del<br />Producto',
      width: '180px',
    },
    { columnDef: 'nombreAccion', header: 'Nombre de Acción', alignLeft: true },
    {
      columnDef: 'isImplicaPresupuesto',
      header: 'Implica Presupuesto',
      width: '180px',
    },
    { columnDef: 'estatus', header: 'Estatus', width: '110px' },
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
  money = 0;

  dataUser: IDatosUsuario;
  yearNav: string;

  dataProjects: IItemProjectsResponse[] = [];
  dataActivities: IItemActivitiesResponse[] = [];
  dataProducts: IItemProductResponse[] = [];

  claveAccion: number = 0;
  validation = false;
  idSaveValidar: number = 0;
  selectedAjustesProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  selectedValidateProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  selectedConsultaProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  disabledAppValidate: boolean = false;

  dataSelectedProduct: IItemProductResponse | undefined = undefined;
  activitySelected: any = null;
  nivelEducativoProducto: ICatalogResponse | undefined;
  projectSelected: IItemProjectsResponse | undefined = undefined;

  catPartidasPresupuestales: IItemCatalogoResponse[] = [];
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];

  calendarizacionInit: Calendarizacion[];

  isCleanForm: boolean = false;
  dataSelected: IItmeBudgetResponse | null = null;
  isPartidaGasto: boolean = false;
  updateForm: boolean = false;
  budgetIncomplete: boolean = false;
  countBudgetIncomplete: number = 0;
  statusToFinish: string = '';
  partidasGastoTemp: number[] = [];
  viewForm: boolean = false;
  canEditProject: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private _formsState: FormsStateService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private catalogService: CatalogsService,
    private projectsService: ProjectsService,
    private activitiesService: ActivitiesService,
    private productsService: ProductsService,
    private budgetsService: BudgetsService,
    private _stateView: StateViewService
  ) {
    super();
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

    this.calendarizacionInit = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      monto: 0,
    }));
  }

  createQuestions() {
    this.questions = [];

    this.questions.push(
      new DropdownQuestion({
        idElement: 118,
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 119,
        nane: 'nombreActividad',
        label: 'Nombre de la Actividad',
        disabled: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 120,
        nane: 'nombreProducto',
        label: 'Nombre del Producto',
        disabled: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        idElement: 121,
        nane: 'claveNivelEducativo',
        label: 'Clave del Nivel Educativo',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        idElement: 122,
        nane: 'claveAccion',
        label: 'Clave de la Acción',
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        idElement: 123,
        nane: 'nombreAccion',
        label: 'Nombre de la Acción',
        rows: 2,
        validators: [Validators.required, Validators.maxLength(250)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 124,
        nane: 'idCentroCostos',
        label: 'ID Centro de Costos',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    // Presupuesto
    this.questions.push(
      new CheckboxQuestion({
        nane: 'isPresupuesto',
        label: 'Presupuesto',
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 125,
        nane: 'partidaGasto',
        label: 'Partida de Gasto',
        filter: true,
        disabled: true,
        multiple: true,
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 126,
        nane: 'fuenteFinanciamiento',
        label: 'Fuente de Financiamiento',
        filter: true,
        disabled: true,
        options: [],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });

    this.form.get('isPresupuesto')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        if (!this.dataSelected || this.updateForm) {
          if (!this.form.get('nombreAccion')?.value) {
            this._alertService.showAlert('Registra un nombre de acción');
            this.form.get('isPresupuesto')?.setValue(false);
            this.isPartidaGasto = false;
          } else {
            this.form.get('partidaGasto')?.enable();
            this.form.get('fuenteFinanciamiento')?.enable();
          }
        }
        this.isPartidaGasto = true;
      } else {
        this.form.get('partidaGasto')?.disable();
        this.form.get('fuenteFinanciamiento')?.disable();
        this.form.get('partidaGasto')?.setValue('');
        this.form.get('fuenteFinanciamiento')?.setValue('');
        this.table = [];
        this.partidasGastoTemp = [];
        this.isPartidaGasto = false;
      }
    });

    if (!this._stateView.editable) {
      this.form.disable();
      this.actions = {
        view: true,
      };
    }
    if (this.selectedValidateProyectoPAA) {
      this.validation = true;
    } else if (this.selectedAjustesProyectoPAA) {
      this.validation = false;
      this.disabledAppValidate = true;
    } else {
      this.validation = this._stateView.validation;
    }
  }

  get getQuestions() {
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

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  ngOnInit() {
    this.suscribreForm();
  }

  validateWhereComeFrom() {
    const selectedUploadMasiveProyectoPAA = this.ls.get(
      'selectedUploadMasiveProyectoPAA'
    );
    if (
      selectedUploadMasiveProyectoPAA
      // &&
      // selectedUploadMasiveProyectoPAA.value.estatus === 'Completo'
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
      }
    }
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  async getAll(): Promise<void> {
    this.getCatalogs();
    this.getProyectsSwitch();
  }

  async getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['catalogoPartidasPresupuestales']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['centrosCosto']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['fuenteFinanciamiento']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nivelEducativo']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['categoria']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoProducto']
      ),
    ])
      .pipe(take(1))
      .subscribe(
        ([
          dataCatalogoPartidasPresupuestales,
          dataCentrosCosto,
          dataFuenteFinanciamiento,
          dataNivelEducativo,
          dataCategoria,
          dataTipoProducto,
        ]) => {
          this.questions[8].options = mapCatalogData({
            data: dataCatalogoPartidasPresupuestales,
          });
          this.questions[6].options = dataCentrosCosto.catalogo.map((item) => {
            return {
              id: item.idCatalogo,
              value: item.ccExterna,
            };
          });
          this.questions[9].options = mapCatalogData({
            data: dataFuenteFinanciamiento,
          });
          this.nivelEducativoProducto = dataNivelEducativo;

          this.catPartidasPresupuestales =
            dataCatalogoPartidasPresupuestales.catalogo;
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
          this.validateWhereComeFrom();
        }
      );
  }

  async getProyectsSwitch() {
    if (this.selectedAjustesProyectoPAA || this.selectedValidateProyectoPAA) {
      if (this.selectedAjustesProyectoPAA) {
        this.dataProjects = [this.selectedAjustesProyectoPAA.value];
      } else {
        if (this.selectedValidateProyectoPAA?.value) {
          this.dataProjects = [this.selectedValidateProyectoPAA.value];
        }
      }
      this.questions[0].options = mapOptionProjects(this.dataProjects);
    } else if (this.selectedConsultaProyectoPAA) {
      this.getProjectsConsulta();
    } else {
      this.getProjectsConsulta();
    }
  }

  async getProjects() {
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

  async getActivities(idProject: number) {
    this.form.controls['nombreActividad']?.disable();
    this.form.controls['nombreProducto']?.disable();
    this.questions[1].options = [];
    this.activitiesService
      .getActivityByProjectId(idProject)
      .pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value.codigo === '200' && value.respuesta?.length > 0) {
          const validItems = value.respuesta.filter(
            (item) => item.csEstatus !== 'I'
          );
          const tmpData = validItems.map((item) => ({
            id: item.idActividad,
            value: item.cxNombreActividad,
          }));
          this.dataActivities = value.respuesta;
          this.questions[1].options = tmpData;
          this.form.controls['nombreActividad']?.enable();
        }
      });
  }

  async getProductsByIdActivity(idActivity: string) {
    this.form.controls['nombreProducto']?.disable({ emitEvent: false });
    this.questions[2].options = [];
    this.productsService
      .getProductByActivityId(idActivity)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            const tmpData: any[] = [];
            for (const item of value.respuesta) {
              if (item.estatus !== 'I') {
                tmpData.push(item);
              }
            }
            this.dataProducts = tmpData;
            this.form.controls['nombreProducto']?.enable({ emitEvent: false });
            this.questions[2].options = mapOptionProducts(this.dataProducts);
          }
        },
      });
  }

  async getBudgetsByIdProduct(idProduct: number, cleanClaveActividad = false) {
    this.budgetsService
      .getBudgetByIdProduct(idProduct)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            const tmpData: any[] = [];
            for (const item of value.respuesta) {
              if (item.estatus !== 'B') {
                let product = this.dataProducts.find(
                  (producto) => producto.idProducto === item.idProducto
                );
                tmpData.push({
                  ...item,
                  claveProyecto: getCveProyecto({
                    cveProyecto: +(this.projectSelected?.clave ?? 0),
                    cveUnidad: this.projectSelected?.claveUnidad,
                  }),
                  claveActividad: getCveActividad({
                    projectSelected: this.projectSelected,
                    numeroActividad: this.activitySelected?.cveActividad,
                  }),
                  claveProducto: getCveProducto({
                    catCategoria: this.catCategoria,
                    catTipoProducto: this.catTipoProducto,
                    projectSelected: this.projectSelected,
                    activitySelected: this.activitySelected,
                    productSelected: product,
                  }),
                  nombreAccion: item.nombreAccion,
                  isImplicaPresupuesto:
                    item.partidasPresupuestales.length > 0 ? 'Si' : 'No',
                  estatus: getGlobalStatus(item.estatus),
                });
              }
            }
            this.data = tmpData.reverse();
          } else {
            this.data = [];
          }
          if (!cleanClaveActividad) {
            this.claveAccion = 0;
            this.claveAccion = this.data.length + 1;
            this.form
              .get('claveAccion')
              ?.setValue(getNumeroAccion(this.claveAccion));
          } else {
            this.form.get('claveAccion')?.setValue('');
          }
        },
      });
  }

  submit() {
    const formBody = this.form.getRawValue();
    const {
      nombreAccion,
      nombreProducto,
      claveAccion,
      claveNivelEducativo,
      idCentroCostos,
      fuenteFinanciamiento,
      partidaGasto,
      isPresupuesto,
    } = formBody;
    const { cveUsuario } = this.dataUser;
    if (!nombreAccion) {
      this._alertService.showAlert(
        'Es Necesario Registrar el Nombre de la Acción'
      );
    } else {
      const dataBudgetCreate: IBudgetPayload = {
        idProducto: nombreProducto,
        cveUsuario: cveUsuario,
        cveAccion: claveAccion,
        nombreAccion: nombreAccion,
        cveNivelEducativo: claveNivelEducativo,
        idCentroCostos: idCentroCostos || null,
        presupuestoAnual: 0,
        idFuenteFinanciamiento: fuenteFinanciamiento || null,
        partidasPresupuestales: [],
        estatus: this.form.valid && !isPresupuesto ? 'C' : 'I',
      };

      if (isPresupuesto) {
        let partidasPresupuestales = this.generateArrayPartidasPresupuestales(
          partidaGasto ? partidaGasto : []
        );
        dataBudgetCreate.estatus =
          this.form.valid &&
            partidasPresupuestales.length > 0 &&
            fuenteFinanciamiento
            ? 'C'
            : 'I';
        if (this.budgetIncomplete && this.countBudgetIncomplete > 0) {
          dataBudgetCreate.estatus = 'I';
        }
        dataBudgetCreate.partidasPresupuestales = partidasPresupuestales;
      }
      this.budgetsService
        .createBudget(dataBudgetCreate)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.getBudgetsByIdProduct(formBody.nombreProducto, true);
            this.resetAllForm();
            this._alertService.showAlert('Se Guardó Correctamente');
            this.claveAccion = 0;
          },
        });
    }
  }

  async updateBudget() {
    const formBody = this.form.getRawValue();
    const {
      nombreAccion,
      nombreProducto,
      claveAccion,
      claveNivelEducativo,
      idCentroCostos,
      fuenteFinanciamiento,
      partidaGasto,
      isPresupuesto,
    } = formBody;
    const { cveUsuario } = this.dataUser;
    if (!nombreAccion) {
      this._alertService.showAlert(
        'Es necesario registrar el nombre de la acción'
      );
    } else {
      let confirmUpdate: boolean = true;
      const dataBudgetUpdate: IBudgetPayload = {
        idProducto: nombreProducto,
        cveUsuario: cveUsuario,
        cveAccion: claveAccion,
        nombreAccion: nombreAccion,
        cveNivelEducativo: claveNivelEducativo,
        idCentroCostos: idCentroCostos || null,
        presupuestoAnual: 0,
        idFuenteFinanciamiento: fuenteFinanciamiento || null,
        partidasPresupuestales: [],
        estatus: this.form.valid && !isPresupuesto ? 'C' : 'I',
      };
      if (isPresupuesto) {
        let partidasPresupuestales = this.generateArrayPartidasPresupuestales(
          partidaGasto ?? []
        );
        dataBudgetUpdate.estatus =
          this.form.valid &&
            partidasPresupuestales.length > 0 &&
            fuenteFinanciamiento
            ? 'C'
            : 'I';
        if (this.budgetIncomplete && this.countBudgetIncomplete > 0) {
          const confirm = await this._alertService.showConfirmation({
            message: `¿Está Seguro de Actualizar el Presupuesto? Existen ${this.countBudgetIncomplete} presupuestos incompletos o con observaciones en calendarización`,
          });
          if (!confirm) {
            confirmUpdate = false;
          } else {
            dataBudgetUpdate.estatus = 'I';
          }
        }
        dataBudgetUpdate.partidasPresupuestales = partidasPresupuestales;
      }
      if (confirmUpdate) {
        this.budgetsService
          .updateBudget(this.dataSelected?.idPresupuesto, dataBudgetUpdate)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.getBudgetsByIdProduct(formBody.nombreProducto, true);
              this.resetAllForm();
              this._alertService.showAlert('Se Modificó Correctamente');
              this.claveAccion = 0;
            },
          });
      }
    }
  }

  getValuesCalendarizacion(dataAction: IItmeBudgetResponse) {
    this.table = [];
    let product = this.dataProducts.find(
      (product) => product.idProducto === dataAction.idProducto
    );

    dataAction.partidasPresupuestales?.map((partida) => {
      let partidaGasto = this.catPartidasPresupuestales.find(
        (partidaGasto) =>
          partidaGasto.idCatalogo === partida.idCatalogoPartidaGasto
      );
      this.table.push(
        new Spent(
          `${product?.nombre}`,
          `${dataAction.nombreAccion}`,
          `${partidaGasto?.ccExterna} ${partidaGasto?.cdOpcion}`,
          partida.anual,
          partida.calendarizacion.find((cal) => cal.mes === 1)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 2)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 3)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 4)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 5)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 6)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 7)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 8)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 9)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 10)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 11)?.monto ?? 0,
          partida.calendarizacion.find((cal) => cal.mes === 12)?.monto ?? 0
        )
      );
    });
  }

  async delete(partial: string) {
    const confirm = await this._alertService.showConfirmation({
      message: `¿Está Seguro de Eliminar la Partida de Gasto ${partial}?`,
    });
    if (confirm) {
      this.table = this.table.filter((item) => item.partial !== partial);
      let { partidaGasto } = this.form.getRawValue();
      let removePartidaGasto = partidaGasto.filter((item) => {
        let partidaGastoPresupuestal = this.catPartidasPresupuestales.find(
          (item) => item.ccExterna === partial.split(' ')[0]
        );
        return item !== partidaGastoPresupuestal?.idCatalogo;
      });
      this.partidasGastoTemp = removePartidaGasto;
      this.form.get('partidaGasto')?.setValue(removePartidaGasto);
    }
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItmeBudgetResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._formsState.setReadonly(true);
        this._formsState.setProduct(event.value);
        this.resetAllForm();
        this.isCleanForm = true;
        this.updateForm = false;
        this.viewForm = true;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          if (
            this.selectedValidateProyectoPAA ||
            this.selectedAjustesProyectoPAA
          ) {
            this.idSaveValidar = dataAction.idPresupuesto;
            if (this.selectedValidateProyectoPAA) {
              this.statusToFinish = String(
                (this.selectedValidateProyectoPAA?.value.ixCicloValidacion ??
                  0) + 1
              );
            }
          }
        }, 100);
        this.form.disable();
        break;
      case TableConsts.actionButton.edit:
        this._formsState.setReadonly(true);
        this._formsState.setProduct(event.value);
        this.resetAllForm();
        this.isCleanForm = true;
        this.updateForm = true;
        this.viewForm = false;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.viewForm = false;
          this.uploadDataToForm(dataAction);
          if (this.selectedAjustesProyectoPAA) {
            this.idSaveValidar = dataAction.idPresupuesto;
          }
          if (this.selectedValidateProyectoPAA) {
            this.statusToFinish = String(
              (this.selectedValidateProyectoPAA?.value.ixCicloValidacion ?? 0) +
              1
            );
          }
        }, 100);
        this.form.enable();
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Presupuesto?',
          });
          if (confirm) {
            this.budgetsService
              .deleteBudget(dataAction.idPresupuesto)
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.resetAllForm();
                    this.data = [
                      ...this.data.filter(
                        (item) =>
                          item.idPresupuesto !== dataAction.idPresupuesto
                      ),
                    ];
                    this.resetAllForm();
                  }
                },
              });
          }
        }
        break;
    }
  }

  newBudget() {
    this.form.enable();
    this.resetAllForm();
    this.form.get('nombreActividad')?.disable();
    this.form.get('nombreProducto')?.disable();
    this.form.get('claveNivelEducativo')?.disable();
    this.form.get('claveAccion')?.disable();
  }

  resetAllForm() {
    this.form.reset({ emitEvent: false });
    this.viewForm = false;
    this.isCleanForm = false;
    this.updateForm = false;
    this.isPartidaGasto = false;
    this.dataSelected = null;
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.notifier.complete();
  }

  private uploadDataToForm(dataAction: IItmeBudgetResponse) {
    const product = this.dataProducts.find(
      (producto) => producto.idProducto === dataAction.idProducto
    );
    const activity = this.dataActivities.find(
      (activity) => activity.idActividad === product?.idActividad
    );
    const project = this.dataProjects.find(
      (project) => project.idProyecto === activity?.idProyecto
    );
    this.isPartidaGasto = false;

    this.form
      .get('nombreProyecto')
      ?.setValue(project?.idProyecto, { emitEvent: false });
    this.form
      .get('nombreActividad')
      ?.setValue(activity?.idActividad, { emitEvent: false });

    this.form
      .get('nombreProducto')
      ?.setValue(product?.idProducto, { emitEvent: false });

    this.getClaveNivelEducativo(product?.idProducto ?? 0);

    this.form
      .get('claveAccion')
      ?.setValue(getNumeroAccion(dataAction?.cveAccion));
    this.form.get('nombreAccion')?.setValue(dataAction?.nombreAccion);
    this.form.get('idCentroCostos')?.setValue(dataAction?.idCentroCostos);

    if (dataAction?.partidasPresupuestales?.length > 0) {
      this.isPartidaGasto = true;

      this.form.get('isPresupuesto')?.setValue(true);
      this.form
        .get('partidaGasto')
        ?.setValue(
          this.generateArrayPartidasGasto(dataAction?.partidasPresupuestales),
          { emitEvent: false }
        );
      this.form
        .get('fuenteFinanciamiento')
        ?.setValue(dataAction?.idFuenteFinanciamiento);

      this.getValuesCalendarizacion(dataAction);
    }

    this.form.get('claveNivelEducativo')?.disable();
    this.form.get('claveAccion')?.disable();
  }

  private getClaveNivelEducativo(idProduct: number) {
    let productoEncontrado = this.dataProducts.find(
      (producto) => producto.idProducto === idProduct
    );
    let catalogNivelEducativo = this.nivelEducativoProducto?.catalogo.find(
      (catalogo) => catalogo.idCatalogo === productoEncontrado?.idNivelEducativo
    );

    this.form
      .get('claveNivelEducativo')
      ?.setValue(
        catalogNivelEducativo?.ccExterna
          ? getNumeroNivelEducativo(+catalogNivelEducativo?.ccExterna)
          : 'NA'
      );
  }

  private generateArrayPartidasPresupuestales(partidasGasto: number[]) {
    let partidasPresupuestales: PartidasPresupuestale[] = [];

    this.countBudgetIncomplete = 0;
    this.budgetIncomplete = false;

    this.table?.map((partidaGasto) => {
      let ccExterna = partidaGasto.partial.split(' ')[0];
      let partidaGastoPresupuestal = this.catPartidasPresupuestales.find(
        (item) => item.ccExterna === ccExterna
      );
      partidasGasto = partidasGasto.filter(
        (item) => item !== partidaGastoPresupuestal?.idCatalogo
      );
      partidasPresupuestales.push({
        idCatalogoPartidaGasto: partidaGastoPresupuestal?.idCatalogo ?? 0,
        cxNombrePartida: partidaGastoPresupuestal?.cdDescripcionDos,
        calendarizacion: [
          {
            mes: 1,
            monto: partidaGasto.january,
          },
          {
            mes: 2,
            monto: partidaGasto.february,
          },
          {
            mes: 3,
            monto: partidaGasto.march,
          },
          {
            mes: 4,
            monto: partidaGasto.april,
          },
          {
            mes: 5,
            monto: partidaGasto.may,
          },
          {
            mes: 6,
            monto: partidaGasto.june,
          },
          {
            mes: 7,
            monto: partidaGasto.july,
          },
          {
            mes: 8,
            monto: partidaGasto.august,
          },
          {
            mes: 9,
            monto: partidaGasto.september,
          },
          {
            mes: 10,
            monto: partidaGasto.october,
          },
          {
            mes: 11,
            monto: partidaGasto.november,
          },
          {
            mes: 12,
            monto: partidaGasto.december,
          },
        ],
        anual: partidaGasto.anualBudget || 0,
      });
      if (
        partidaGasto.anualBudget != partidaGasto.getTotal() ||
        partidaGasto.anualBudget == 0
      ) {
        this.countBudgetIncomplete++;
      }
    });

    if (partidasGasto?.length) {
      partidasGasto?.map((partidaGasto) => {
        partidasPresupuestales.push({
          idCatalogoPartidaGasto: partidaGasto,
          cxNombrePartida: this.catPartidasPresupuestales.find(
            (partidaGastoFind) => partidaGastoFind.idCatalogo === partidaGasto
          )?.cdDescripcionDos,
          calendarizacion: [...this.calendarizacionInit],
          anual: 0,
        });
      });
    }

    if (this.countBudgetIncomplete > 0 || partidasGasto?.length > 0) {
      this.budgetIncomplete = true;
    }
    return partidasPresupuestales;
  }

  private generateArrayPartidasGasto(
    partidasPresupuestales: PartidasPresupuestale[]
  ) {
    let partidasGasto: number[] = [];

    for (let partidaPresupuestal of partidasPresupuestales) {
      partidasGasto.push(partidaPresupuestal.idCatalogoPartidaGasto);
    }

    this.partidasGastoTemp = partidasGasto;
    return partidasGasto;
  }

  private suscribreForm() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            this.data = [];
            this.getActivities(value);
            const findedProject = this.dataProjects.filter(
              (item) => item.idProyecto === value
            );
            if (findedProject?.length > 0) {
              this.projectSelected = findedProject[0];
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
            this.form.get('nombreProducto')?.setValue('');
            this.form.get('claveNivelEducativo')?.setValue('');
            this.form.get('claveAccion')?.setValue('');

            this.form.get('nombreProducto')?.disable();
          }
        }
      });

    this.form
      .get('nombreActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        this.form.get('nombreProducto')?.setValue('', { emitEvent: false });

        this.form.get('claveNivelEducativo')?.setValue('');
        this.form.get('claveAccion')?.setValue('');
        if (value) {
          this.form.get('nombreProducto')?.setValue('');
          if (!this.viewForm || !this.updateForm) {
            this.data = [];
          }
          const findedActivity = this.dataActivities.filter(
            (item) => item.idActividad === value
          );
          if (findedActivity?.length > 0) {
            this.activitySelected = findedActivity[0];
          }
          if (!this.dataSelectedProduct) this.getProductsByIdActivity(value);
        }
      });

    this.form
      .get('nombreProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.getClaveNivelEducativo(value);
          this.getBudgetsByIdProduct(value);
        }
      });

    this.form
      .get('partidaGasto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value: number[]) => {
        if (value) {
          this.viewForm = false;
        }
        if (this.isPartidaGasto) {
          this.generateFilaTablePartidasPresupuestales(value);
        }
      });
  }

  async generateFilaTablePartidasPresupuestales(partidasGasto: number[]) {
    let newPartidasGasto: number[] = partidasGasto;
    if (this.table.length > 0) {
      this.table?.map((partidaGasto) => {
        let partidaGastoPresupuestal = this.catPartidasPresupuestales.find(
          (item) => item.ccExterna === partidaGasto?.partial.split(' ')[0]
        );
        partidasGasto = partidasGasto?.filter(
          (item) => item !== partidaGastoPresupuestal?.idCatalogo
        );
      });
    }

    if (newPartidasGasto?.length > this.partidasGastoTemp?.length) {
      partidasGasto?.map((itemPartida) => {
        let partidaGasto = this.catPartidasPresupuestales.find(
          (partidaGasto) => partidaGasto.idCatalogo === itemPartida
        );
        const product = this.dataProducts.find(
          (producto) =>
            producto.idProducto ===
            parseInt(this.form.get('nombreProducto')?.value)
        );
        this.table.push(
          new Spent(
            `${product?.nombre}`,
            `${this.form.get('nombreAccion')?.value}`,
            `${partidaGasto?.cdDescripcionDos}`,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          )
        );
      });
      this.partidasGastoTemp = newPartidasGasto;
    } else if (newPartidasGasto?.length < this.partidasGastoTemp?.length) {
      let partidaGastoDelete = this.partidasGastoTemp.filter(
        (items) => !newPartidasGasto.includes(items)
      )[0];
      let partidaGastoPresupuestal = this.catPartidasPresupuestales.find(
        (item) => item.idCatalogo === partidaGastoDelete
      );
      const confirm = await this._alertService.showConfirmation({
        message: `¿Está Seguro de Eliminar la Partida de Gasto ${partidaGastoPresupuestal?.cdDescripcionDos}?`,
      });
      if (confirm) {
        this.partidasGastoTemp = newPartidasGasto;
        this.table = this.table.filter(
          (item) => item.partial !== partidaGastoPresupuestal?.cdDescripcionDos
        );
      } else {
        this.form.get('partidaGasto')?.setValue(this.partidasGastoTemp);
      }
    }
  }
}
