import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { Observable, Subject, forkJoin, take, takeUntil } from 'rxjs';
import { AlertService } from '@common/services/alert.service';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TblWidthService } from '@common/services/tbl-width.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { Spent } from './classes/spent.class';
import { SpentTable } from './classes/spent-table.class';
import { TableColumn } from '@common/models/tableColumn';
import { BudgetCalendarI } from '../arr/budgets-arr/interface/budget-calendar.interface';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import {
  Calendarizacion,
  IBudgetPayload,
  IItmeBudgetResponse,
  PartidasPresupuestale,
} from '@common/interfaces/short-term/budget.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { BudgetsFollowService } from '@common/services/seguimiento/budget.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { mapOptionProducts } from '@common/mapper/data-options.mapper';
import {
  getCveProyecto,
  getGlobalStatus,
  getIdAdecuancionSolicitud,
  getNumeroAccion,
  getNumeroActividad,
  getNumeroNivelEducativo,
} from '@common/utils/Utils';
import { TIPO_APARTADO } from '../enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { ActionsFollowService } from '@common/services/seguimiento/actions.service';
import { IItmeAccionFollowResponse } from '@common/interfaces/seguimiento/actions.interface';

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
  loading = true;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  private _body = document.querySelector('body');
  money = 0;
  budgetCalendar: BudgetCalendarI[] = [
    {
      status: 'Aprobado',
      total: 0,
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    },
  ];

  dataUser: IDatosUsuario;
  yearNav: string;
  selectedSolicitud: any;
  whatModuleStart!: string;

  dataProjects: IItemConsultarPRoyectosResponse[] = [];
  dataActivities: IItemActivitiesResponse[] = [];
  dataProducts: IItemProductResponse[] = [];
  dataActions: IItmeAccionFollowResponse[] = [];

  claveAccion: number = 0;

  dataSelectedProduct: IItemProductResponse | undefined = undefined;
  activitySelected: any = null;
  nivelEducativoProducto: ICatalogResponse | undefined;
  projectSelected: IItemConsultarPRoyectosResponse | null = null;

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

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private catalogService: CatalogsService,
    private projectsFollowService: ProjectsService,
    private activitiesFollowService: ActivitiesFollowService,
    private productsFollowService: ProductsService,
    private actionsFollowService: ActionsFollowService,
    private budgetsFollowService: BudgetsFollowService
  ) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
    this.whatModuleStart = this.ls.get('whatModuleStart');
    this._body?.classList.add('hideW');

    this.calendarizacionInit = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      monto: 0,
    }));
  }

  ngOnInit() {
    this.createQuestions();
    this.suscribreForm();
    this.getAll();
  }

  createQuestions() {
    this.questions = [];

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'claveUnidad',
        label: 'Unidad',
        value: `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'claveProyecto',
        label: 'Clave del Proyecto',
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreActividad',
        label: 'Nombre de la Actividad',
        disabled: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreProducto',
        label: 'Nombre del Producto',
        disabled: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        nane: 'claveNivelEducativo',
        label: 'Clave del Nivel Educativo',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'claveAccion',
        label: 'Clave de la Acción',
        validators: [Validators.required],
      })
    );

    if (this.whatModuleStart === 'budgets') {
      this.questions.push(
        new TextboxQuestion({
          nane: 'nombreAccion',
          label: 'Nombre de la Acción',
          disabled: true,
          validators: [Validators.required, Validators.maxLength(250)],
        })
      );
    } else {
      this.questions.push(
        new DropdownQuestion({
          nane: 'nombreAccion',
          label: 'Nombre de la Acción',
          filter: true,
          disabled: true,
        })
      );
    }

    this.questions.push(
      new DropdownQuestion({
        nane: 'idCentroCostos',
        label: 'ID Centro de Costos',
        disabled: true,
        filter: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new CheckboxQuestion({
        nane: 'isPresupuesto',
        label: 'Presupuesto',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'partidaGasto',
        label: 'Partida de Gasto',
        filter: true,
        disabled: true,
        multiple: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'fuenteFinanciamiento',
        label: 'Fuente de Financiamiento',
        filter: true,
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    this.form.get('isPresupuesto')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.isPartidaGasto = true;
        if (!this.dataSelected || this.updateForm) {
          this.form.get('partidaGasto')?.enable();
          this.form.get('fuenteFinanciamiento')?.enable();
        }
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
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  private suscribreForm() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            const findedProject = this.dataProjects.filter(
              (item) => item.idProyecto === value
            );
            if (findedProject?.length > 0) {
              this.projectSelected = findedProject[0];
            }
            if (!this.projectSelected) {
              return;
            }
            this.form.get('claveProyecto')?.setValue(
              getCveProyecto({
                cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
                cveProyecto: +this.projectSelected?.clave,
              })
            );
            this.getActivities(value);
          }
        }
      });

    this.form
      .get('nombreActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            const findedActivity = this.dataActivities.filter(
              (item) => item.idActividad === value
            );
            if (findedActivity?.length > 0) {
              this.activitySelected = findedActivity[0];
            }
            if (!this.dataSelectedProduct) this.getProductsByIdActivity(value);
          }
        }
      });

    this.form
      .get('nombreProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            this.form
              .get('claveNivelEducativo')
              ?.setValue(this.getClaveNivelEducativo(parseInt(value)));
            this.enableActions();
            if (this.whatModuleStart !== 'budgets') {
              this.getActionByIdProduct(value);
            } else {
              this.getSecuenciaAccionByProducto(value);
            }
            this.getBudgetsByIdProduct(value);
          }
        }
      });

    this.form
      .get('nombreAccion')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            if (this.whatModuleStart !== 'budgets') {
              let actionFilter = this.dataActions.filter(
                (item) => item.nombre === value
              )[0];
              this.form
                .get('claveAccion')
                ?.setValue(getNumeroAccion(actionFilter.claveAccion));
              this.enableActions();
            }
          }
        }
      });

    this.form
      .get('partidaGasto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value: number[]) => {
        if (this.isPartidaGasto) {
          this.generateFilaTablePartidasPresupuestales(value);
        }
      });
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.getCatalogs();
    if (
      this.whatModuleStart === 'proyects' ||
      this.whatModuleStart === 'activities' ||
      this.whatModuleStart === 'products' ||
      this.whatModuleStart === 'actions' ||
      this.whatModuleStart === 'budgets'
    ) {
      this.getProjects({
        excluirCortoPlazo: true,
        priorizarProyectoAsociado: true,
        idSolicitud: this.selectedSolicitud.idSolicitud ?? 0,
      });
    } else {
      this.getProjects({
        excluirCortoPlazo: false,
        priorizarProyectoAsociado: false,
        idSolicitud: 0,
      });
    }
    this.loading = false;
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
          this.questions[10].options = mapCatalogData({
            data: dataCatalogoPartidasPresupuestales,
          });
          this.questions[8].options = mapCatalogData({
            data: dataCentrosCosto,
            viewId: true,
          });
          this.questions[11].options = mapCatalogData({
            data: dataFuenteFinanciamiento,
          });
          this.nivelEducativoProducto = dataNivelEducativo;

          this.catPartidasPresupuestales =
            dataCatalogoPartidasPresupuestales.catalogo;
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
        }
      );
  }

  getProjects({
    excluirCortoPlazo,
    priorizarProyectoAsociado,
    idSolicitud,
  }: {
    excluirCortoPlazo: boolean;
    priorizarProyectoAsociado: boolean;
    idSolicitud: number;
  }) {
    this.projectsFollowService
      .getConsultarProyectos(
        this.yearNav,
        excluirCortoPlazo,
        idSolicitud,
        priorizarProyectoAsociado
      )
      .pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value.codigo === '200' && value.respuesta?.length > 0) {
          this.dataProjects = value.respuesta.filter((item) => {
            if (this.whatModuleStart === 'proyects') {
              if (item.estatus !== 'B' && item.estatus !== 'T') {
                return true;
              }
            } else if (item.estatus === 'O') {
              return true;
            }

            return false;
          });
          this.questions[2].options = this.dataProjects.map((item) => {
            return {
              id: item.idProyecto,
              value: item.nombre,
            };
          });
        } else if (this.whatModuleStart === 'budgets') {
          this.getProjects({
            excluirCortoPlazo: false,
            priorizarProyectoAsociado: false,
            idSolicitud: 0,
          });
        }
      });
  }

  async getActivities(idProject: number) {
    this.resetToActivities();
    let excluirCortoPlazo: boolean = false,
      idSolicitud: number = 0;
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
      .subscribe((value) => {
        if (value.codigo === '200' && value.respuesta?.length > 0) {
          const tmpData: any[] = [];
          for (const item of value.respuesta) {
            if (item.csEstatus !== 'I' && item.csEstatus !== 'B') {
              tmpData.push({
                id: item.idActividad,
                value: item.cxNombreActividad,
              });
            }
          }
          this.dataActivities = value.respuesta;
          this.questions[3].options = tmpData;
          this.form.get('nombreActividad')?.enable({ emitEvent: false });
        }
      });
  }

  async getProductsByIdActivity(idActivity: string) {
    this.resetToProducts();
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
    this.productsFollowService
      .getProductByActivityIdSolicitud(
        idActivity,
        excluirCortoPlazo,
        idSolicitud
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            const tmpData: any[] = [];
            for (const item of value.respuesta) {
              if (item.estatus !== 'I' && item.estatus !== 'B') {
                tmpData.push(item);
              }
            }
            this.dataProducts = tmpData;
            this.form.get('nombreProducto')?.enable({ emitEvent: false });
            this.questions[4].options = mapOptionProducts(this.dataProducts);
          }
        },
      });
  }

  async getActionByIdProduct(idProduct: number) {
    this.resetToActions();
    let excluirCortoPlazo: boolean = false,
      idSolicitud: number = 0;
    if (this.whatModuleStart !== 'budgets') {
      excluirCortoPlazo = true;
      idSolicitud = this.selectedSolicitud.idSolicitud ?? 0;
    }
    this.actionsFollowService
      .getActions(idProduct, excluirCortoPlazo, idSolicitud)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            let actionsTemp: any[] = [];
            for (const item of value.respuesta) {
              actionsTemp.push({
                id: item.nombre,
                value: item.nombre,
              });
            }
            this.dataActions = value.respuesta;
            this.form.get('nombreAccion')?.enable({ emitEvent: false });
            this.questions[7].options = actionsTemp;
          }
        },
      });
  }

  getSecuenciaAccionByProducto(idProduct: number) {
    this.actionsFollowService
      .getSecuencialPorProducto(idProduct)
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        this.claveAccion = response.respuesta;
        this.form.get('nombreAccion')?.enable({ emitEvent: false });
        this.form
          .get('claveAccion')
          ?.setValue(getNumeroAccion(this.claveAccion));
      });
  }

  async getBudgetsByIdProduct(idProduct: number, cleanClaveActividad = false) {
    let excluirCortoPlazo: boolean = true,
      idSolicitud: number = this.selectedSolicitud.idSolicitud ?? 0;

    this.budgetsFollowService
      .getBudgetByIdProduct(idProduct, excluirCortoPlazo, idSolicitud)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            const tmpData: any[] = [];

            const validItems = value.respuesta.filter(
              (item) => item.estatus !== 'B'
            );

            if (!this.projectSelected || validItems.length === 0) {
              return;
            }

            for (const item of validItems) {
              let product = this.dataProducts.find(
                (producto) => producto.idProducto === item.idProducto
              );

              tmpData.push({
                ...item,
                claveProyecto: getCveProyecto({
                  cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
                  cveProyecto: +this.projectSelected?.clave,
                }),
                claveActividad: this.getClaveActividad(
                  this.activitySelected?.cveActividad
                ),
                claveProducto: this.setClaveProducto({
                  projectSelected: this.projectSelected,
                  activitySelected: this.activitySelected,
                  claveProductoForm: '0000-000-00-0-00',
                  numeroProductoForm: product?.cveProducto ?? '',
                  categorizacionProductoForm: product?.idCategorizacion ?? 0,
                  tipoProductoForm: product?.idTipoProducto ?? 0,
                  setClaveProducto: false,
                }),
                nombreAccion: item.nombreAccion,
                isImplicaPresupuesto:
                  item.partidasPresupuestales.length > 0 ? 'Si' : 'No',
                estatus: getGlobalStatus(item.estatus),
              });
            }
            this.data = tmpData;
          } else {
            this.data = [{ claveProyecto: 'No hay presupuestos aun.' }];
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
        idAdecuacionSolicitud: getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.presupuesto,
          tipoModificacion: MODIFICATION_TYPE.alta,
        }),
        idPresupuestoReferencia: null,
      };

      if (isPresupuesto) {
        let partidasPresupuestales = this.generateArrayPartidasPresupuestales(
          partidaGasto ?? []
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
      this.budgetsFollowService
        .createBudget(dataBudgetCreate)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.getBudgetsByIdProduct(formBody.nombreProducto, true);
            this.newBudget();
            this._alertService.showAlert('Se Guardó Correctamente');
            this.claveAccion = 0;
            this.getAll();
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
        this.budgetsFollowService
          .updateBudget(this.dataSelected?.idPresupuesto, dataBudgetUpdate)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.getBudgetsByIdProduct(formBody.nombreProducto, true);
              this.newBudget();
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
        this.resetAllForm();
        this.isCleanForm = true;
        this.updateForm = false;
        this.viewForm = true;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
        }, 100);
        this.form.disable();
        break;
      case TableConsts.actionButton.edit:
        this.form.enable();
        this.resetAllForm();
        this.viewForm = false;
        this.isCleanForm = true;
        this.updateForm = true;
        this.dataSelected = dataAction;
        this.form.get('claveUnidad')?.disable();
        this.form.get('claveProyecto')?.disable();
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Presupuesto?',
          });
          if (confirm) {
            this.budgetsFollowService
              .deleteBudget(dataAction.idPresupuesto)
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.newBudget();
                    this.data = [
                      ...this.data.filter(
                        (item) =>
                          item.idPresupuesto !== dataAction.idPresupuesto
                      ),
                    ];
                  }
                },
              });
          }
        }
        break;
    }
  }

  resetAllForm() {
    this.viewForm = false;
    this.isCleanForm = false;
    this.updateForm = false;
    this.dataSelected = null;
    this.form.get('nombreProyecto')?.setValue('');
  }

  newBudget() {
    this.form.enable({ emitEvent: false });
    this.resetAllForm();
    this.resetToActivities();
    this.form
      .get('claveUnidad')
      ?.setValue(
        `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`
      );

    this.form.get('claveUnidad')?.disable();
    this.form.get('claveProyecto')?.disable();
    this.form.get('claveNivelEducativo')?.disable();
    this.form.get('claveAccion')?.disable();
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

    this.form.get('nombreProyecto')?.setValue(project?.idProyecto);
    this.form.get('nombreActividad')?.setValue(activity?.idActividad);
    this.form.get('nombreProducto')?.setValue(product?.idProducto);

    this.form
      .get('claveNivelEducativo')
      ?.setValue(dataAction.cveNivelEducativo);

    this.form
      .get('claveAccion')
      ?.setValue(getNumeroAccion(dataAction?.cveAccion));
    if (this.whatModuleStart != 'budgets') {
      this.questions[7].options = [
        {
          id: dataAction?.nombreAccion,
          value: dataAction?.nombreAccion,
        },
      ];
    }
    this.form.get('nombreAccion')?.setValue(dataAction?.nombreAccion);
    this.form.get('idCentroCostos')?.setValue(dataAction?.idCentroCostos);

    if (dataAction?.partidasPresupuestales?.length > 0) {
      this.isPartidaGasto = true;
      this.form.get('isPresupuesto')?.setValue(true);
      this.form
        .get('partidaGasto')
        ?.setValue(
          this.generateArrayPartidasGasto(dataAction?.partidasPresupuestales)
        );
      this.form
        .get('fuenteFinanciamiento')
        ?.setValue(dataAction?.idFuenteFinanciamiento);

      this.getValuesCalendarizacion(dataAction);
    }

    this.form.get('claveNivelEducativo')?.disable();
    this.form.get('claveAccion')?.disable();
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

  async generateFilaTablePartidasPresupuestales(partidasGasto: number[]) {
    let newPartidasGasto: number[] = partidasGasto;
    if (this.table.length > 0) {
      this.table?.map((partidaGasto?) => {
        let partidaGastoPresupuestal = this.catPartidasPresupuestales.find(
          (item) => item.ccExterna === partidaGasto?.partial.split(' ')[0]
        );
        partidasGasto = partidasGasto?.filter(
          (item) => item !== partidaGastoPresupuestal?.idCatalogo
        );
      });
    }

    if (newPartidasGasto.length > this.partidasGastoTemp.length) {
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
    } else if (newPartidasGasto.length < this.partidasGastoTemp.length) {
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

  private getClaveActividad(idActividad: number) {
    if (!this.projectSelected) {
      return;
    }
    return `${getCveProyecto({
      cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
      cveProyecto: +this.projectSelected?.clave,
    })}-${getNumeroActividad(idActividad)}`;
  }

  private getClaveNivelEducativo(idProducto: number): string {
    let productoEncontrado = this.dataProducts.find(
      (producto) => producto.idProducto === idProducto
    );
    let catalogNivelEducativo = this.nivelEducativoProducto?.catalogo.find(
      (catalogo) => catalogo.idCatalogo === productoEncontrado?.idNivelEducativo
    );

    return catalogNivelEducativo?.ccExterna
      ? getNumeroNivelEducativo(+catalogNivelEducativo?.ccExterna)
      : 'NA';
  }

  private setClaveProducto({
    projectSelected,
    activitySelected,
    claveProductoForm,
    numeroProductoForm,
    categorizacionProductoForm,
    tipoProductoForm,
    setClaveProducto,
  }: {
    projectSelected: IItemConsultarPRoyectosResponse | null;
    activitySelected: any;
    claveProductoForm: string;
    numeroProductoForm: string;
    categorizacionProductoForm: number;
    tipoProductoForm: number;
    setClaveProducto: boolean;
  }) {
    const arrClaveProducto = claveProductoForm.split('-');

    // COMMENT: Clave del proyecto
    if (projectSelected) {
      arrClaveProducto[0] = String(
        getCveProyecto({
          cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
          cveProyecto: +projectSelected?.clave,
        })
      );
    }

    // COMMENT: Clave de la actividad
    if (activitySelected) {
      const claveActividad = activitySelected.cveActividad;
      arrClaveProducto[1] = String(getNumeroActividad(claveActividad));
    }

    // COMMENT: Clave del producto
    if (numeroProductoForm !== '' && !numeroProductoForm?.includes('-')) {
      arrClaveProducto[2] = String(numeroProductoForm);
    }

    // COMMENT: Categorización del producto
    if (categorizacionProductoForm) {
      const findedCategorizacion = this.catCategoria.filter(
        (item) => item.idCatalogo === categorizacionProductoForm
      );
      if (findedCategorizacion?.length > 0) {
        arrClaveProducto[3] = String(findedCategorizacion[0].ccExterna);
      }
    }

    // COMMENT: Tipo del producto
    if (tipoProductoForm) {
      const findedTipoProducto = this.catTipoProducto.filter(
        (item) => item.idCatalogo === tipoProductoForm
      );
      if (findedTipoProducto?.length > 0) {
        arrClaveProducto[4] = String(findedTipoProducto[0].ccExterna);
      }
    }

    if (setClaveProducto) {
      this.form.get('claveProducto')?.setValue(arrClaveProducto.join('-'));
    } else {
      return arrClaveProducto.join('-');
    }
  }

  private resetToActivities() {
    this.form.get('nombreActividad')?.disable({ emitEvent: false });

    this.form.get('nombreActividad')?.setValue('');
    this.resetToProducts();
  }

  private resetToProducts() {
    this.form.get('nombreProducto')?.disable({ emitEvent: false });

    this.form.get('nombreProducto')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.resetToActions();
  }

  private resetToActions() {
    this.form.get('claveAccion')?.disable({ emitEvent: false });
    this.form.get('nombreAccion')?.disable({ emitEvent: false });
    this.form.get('idCentroCostos')?.disable({ emitEvent: false });
    this.form.get('isPresupuesto')?.disable({ emitEvent: false });
    this.form.get('partidaGasto')?.disable({ emitEvent: false });
    this.form.get('fuenteFinanciamiento')?.disable({ emitEvent: false });

    this.form.get('claveAccion')?.setValue('');
    this.form.get('nombreAccion')?.setValue('');
    this.form.get('idCentroCostos')?.setValue('');
    this.form.get('isPresupuesto')?.setValue(false);
    this.form.get('partidaGasto')?.setValue('');
    this.form.get('fuenteFinanciamiento')?.setValue('');

    this.data = [];
  }

  private enableActions() {
    this.form.get('nombreAccion')?.enable({ emitEvent: false });
    this.form.get('idCentroCostos')?.enable({ emitEvent: false });
    this.form.get('isPresupuesto')?.enable({ emitEvent: false });
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }
}
