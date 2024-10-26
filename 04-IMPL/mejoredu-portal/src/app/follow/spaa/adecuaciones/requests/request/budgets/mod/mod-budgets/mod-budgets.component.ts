import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import {
  Calendarizacion,
  IBudgetPayload,
  IItmeBudgetResponse,
  PartidasPresupuestale,
} from '@common/interfaces/short-term/budget.interface';
import { AlertService } from '@common/services/alert.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import { BudgetsFollowService } from '@common/services/seguimiento/budget.service';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { SpentTable } from '../../classes/spent-table.class';
import SecureLS from 'secure-ls';
import { TableColumn } from '@common/models/tableColumn';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { forkJoin, Observable, Subject, take, takeUntil } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import {
  getCveProducto,
  getCveProyecto,
  getGlobalStatus,
  getIdAdecuancionSolicitud,
  getNumeroAccion,
  getNumeroNivelEducativo,
} from '@common/utils/Utils';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { mapOptionProducts } from '@common/mapper/data-options.mapper';
import { TIPO_APARTADO } from '../../../enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../../../enum/modification.enum';
import { Spent } from '../../classes/spent.class';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { ExpensiveResumeI } from '../../../add-expense-item/interfaces/expensive-resume.interface';
import { OptionI } from '@common/form/interfaces/option.interface';

@Component({
  selector: 'app-mod-budgets',
  templateUrl: './mod-budgets.component.html',
  styleUrls: ['./mod-budgets.component.scss'],
})
export class ModBudgetsComponent extends SpentTable implements OnChanges {
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  @Output() expensiveResumesChange = new EventEmitter<ExpensiveResumeI[]>();
  @Input() expensiveResumes: ExpensiveResumeI[] = [];

  @Input() position: 'left' | 'right' | null = null;
  @Input() receivedRecord: any;
  viewFormLeft: boolean = false;
  formLeftView: boolean = true;

  String(arg0: number) {
    return String(arg0.toFixed(2));
  }
  ls = new SecureLS({ encodingType: 'aes' });
  loading = true;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  private _body = document.querySelector('body');
  money = 0;

  mounts: OptionI[] = [
    {
      id: 1,
      value: 'Enero',
    },
    {
      id: 2,
      value: 'Febrero',
    },
    {
      id: 3,
      value: 'Marzo',
    },
    {
      id: 4,
      value: 'Abril',
    },
    {
      id: 5,
      value: 'Mayo',
    },
    {
      id: 6,
      value: 'Junio',
    },
    {
      id: 7,
      value: 'Julio',
    },
    {
      id: 8,
      value: 'Agosto',
    },
    {
      id: 9,
      value: 'Septiembre',
    },
    {
      id: 10,
      value: 'Octubre',
    },
    {
      id: 11,
      value: 'Noviembre',
    },
    {
      id: 12,
      value: 'Diciembre',
    },
  ];

  dataUser: IDatosUsuario;
  yearNav: string;
  selectedSolicitud: any;
  whatModuleStart!: string;

  dataProjects: IItemConsultarPRoyectosResponse[] = [];
  dataActivities: IItemActivitiesResponse[] = [];
  dataProducts: IItemProductResponse[] = [];
  dataBudgets: IItmeBudgetResponse[] = [];

  dataSelectedProduct: IItemProductResponse | undefined = undefined;
  nivelEducativoProducto: ICatalogResponse | undefined;

  projectSelected: IItemConsultarPRoyectosResponse | null = null;
  activitySelected: any = null;
  productSelected: any = null;
  budgetSelected: any = null;

  catPartidasPresupuestales: IItemCatalogoResponse[] = [];
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];

  calendarizacionInit: Calendarizacion[];

  dataSelected: boolean = false;
  isPartidaGasto: boolean = false;
  budgetIncomplete: boolean = false;
  countBudgetIncomplete: number = 0;
  statusToFinish: string = '';
  partidasGastoTemp: number[] = [];

  formLeftComplete: boolean = false;
  idBudgetReferencia: number = 0;
  listActions: any[] = [];

  actions: TableActionsI = {
    delete: true,
    view: true,
    edit: true,
  };
  columns: TableColumn[] = [
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
    { columnDef: 'fullStatus', header: 'Estatus Modificación', width: '150px' },
  ];

  data: any[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private catalogService: CatalogsService,
    private projectsFollowService: ProjectsService,
    private activitiesFollowService: ActivitiesFollowService,
    private productsFollowService: ProductsService,
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
    this.getCatalogs();
    this.createQuestions();
    if (this.position === 'right') {
      this.form.get('nombreProyecto')?.disable({ emitEvent: false });
      this.form
        .get('partidaGasto')
        ?.valueChanges.pipe(takeUntil(this.notifier))
        .subscribe((value: number[]) => {
          if (this.isPartidaGasto) {
            this.generateFilaTablePartidasPresupuestales(value);
          }
        });
    } else {
      this.suscribreForm();
      this.getAll();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.position === 'right') {
      if (changes['receivedRecord']?.currentValue) {
        this.processReceivedValue(changes['receivedRecord'].currentValue);
      } else if (!changes['expensiveResumes']) {
        this.formLeftComplete = false;
        this.resetToActivities();
        this.questions[2].options = [];
      }
    }
    if (this.position === 'left') {
      if (changes['receivedRecord']?.currentValue) {
        let valueCharge = changes['receivedRecord'].currentValue;
        if (valueCharge.actionEmmit === EmmitValueEnum.NEW) {
          this.getAll();
        }
      }
    }
    if (changes['expensiveResumes']) {
      this.expensiveResumes = changes['expensiveResumes'].currentValue;
    }
  }

  processReceivedValue(value: any) {
    if (value.actionEmmit === EmmitValueEnum.DELETE) {
      this.clear();
      this.form.get('claveProyecto')?.setValue('');
      this.form.disable();
      return;
    }

    this.questions[2].options = [
      {
        id: value.projectSelected.idProyecto,
        value: value.projectSelected.nombre,
      },
    ];
    this.form.get('nombreProyecto')?.setValue(value.projectSelected.idProyecto);
    this.form.get('claveProyecto')?.setValue(
      getCveProyecto({
        cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
        cveProyecto: +value.projectSelected?.clave,
      })
    );
    this.questions[3].options = [
      {
        id: value.activitySelected.idActividad,
        value: value.activitySelected.cxNombreActividad,
      },
    ];
    this.form
      .get('nombreActividad')
      ?.setValue(value.activitySelected.idActividad);
    this.questions[4].options = [
      {
        id: value.productSelected.idProducto,
        value: value.productSelected.nombre,
      },
    ];
    this.form.get('nombreProducto')?.setValue(value.productSelected.idProducto);
    this.form
      .get('claveNivelEducativo')
      ?.setValue(
        this.getClaveNivelEducativo(parseInt(value.productSelected.idProducto))
      );

    this.questions[7].options = value.listActions;
    this.form.get('nombreAccion')?.setValue(value.budgetSelected.nombreAccion);
    this.form.get('nombreAccion')?.enable({ emitEvent: false });
    this.form
      .get('claveAccion')
      ?.setValue(getNumeroAccion(value.budgetSelected.cveAccion));

    this.idBudgetReferencia = value.budgetSelected.idPresupuesto;

    this.form
      .get('idCentroCostos')
      ?.setValue(value.budgetSelected?.idCentroCostos);
    this.form.get('idCentroCostos')?.enable({ emitEvent: false });
    this.form.get('isPresupuesto')?.enable({ emitEvent: false });
    if (value.budgetSelected?.partidasPresupuestales?.length > 0) {
      this.isPartidaGasto = true;
      this.form.get('isPresupuesto')?.setValue(true);
      this.form
        .get('partidaGasto')
        ?.setValue(
          this.generateArrayPartidasGasto(
            value.budgetSelected?.partidasPresupuestales
          )
        );
      this.form
        .get('fuenteFinanciamiento')
        ?.setValue(value.budgetSelected?.idFuenteFinanciamiento);
      this.getValuesCalendarizacion(value.budgetSelected);
    } else {
      this.form.get('isPresupuesto')?.setValue(false);
    }

    this.budgetsFollowService
      .getPartidasGastoAjuste(
        value.budgetSelected.idPresupuesto,
        getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.presupuesto,
          tipoModificacion: MODIFICATION_TYPE.modificacion,
        })
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          let partidaGastoAjuste: ExpensiveResumeI[] = [];
          value.respuesta?.map((item) => {
            partidaGastoAjuste.push({
              partidaId: item.idCatalogoPartidaGasto,
              partida: this.catPartidasPresupuestales.filter(
                (x) => x.idCatalogo === item.idCatalogoPartidaGasto
              )[0].cdDescripcionDos,
              claveReduccion: item.tipo === 2 ? item.cvePresupuestal : '',
              importeReduccion: item.tipo === 2 ? item.monto : undefined,
              mesReduccion:
                item.tipo === 2
                  ? this.mounts.filter((x) => x.id === item.mes)[0].value
                  : '',
              mesIdReduccion: item.tipo === 2 ? item.mes : 0,
              claveAmpleacion: item.tipo === 1 ? item.cvePresupuestal : '',
              importeAmpleacion: item.tipo === 1 ? item.monto : undefined,
              mesAmpleacion:
                item.tipo === 1
                  ? this.mounts.filter((x) => x.id === item.mes)[0].value
                  : '',
              mesIdAmpleacion: item.tipo === 1 ? item.mes : 0,
              importeNeto: item.monto,
            });
          });
          this.expensiveResumes = partidaGastoAjuste;
          this.expensiveResumesChange.emit(this.expensiveResumes);
        },
      });
    if (value.actionEmmit === EmmitValueEnum.VIEW) {
      this.form.disable({ emitEvent: false });
      this.viewFormLeft = true;
      this.formLeftView = true;
    }
    if (
      value.actionEmmit === EmmitValueEnum.UPDATE ||
      value.actionEmmit === EmmitValueEnum.NEW
    ) {
      this.viewFormLeft = false;
      this.formLeftView = false;
    }
    this.formLeftComplete = true;
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

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreAccion',
        label: 'Nombre de la Acción',
        filter: true,
        disabled: true,
      })
    );

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
        if (this.position === 'right') {
          if (!this.dataSelected) {
            this.form.get('partidaGasto')?.enable();
            this.form.get('fuenteFinanciamiento')?.enable();
          }
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
            this.onEmitValueEmpty();
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
            if (!this.dataSelectedProduct) {
              this.getProductsByIdActivity(value);
            }
            this.onEmitValueEmpty();
          }
        }
      });

    this.form
      .get('nombreProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            const findedProduct = this.dataProducts.filter(
              (item) => item.idProducto === value
            );
            if (findedProduct?.length > 0) {
              this.productSelected = findedProduct[0];
            }
            this.form
              .get('claveNivelEducativo')
              ?.setValue(this.getClaveNivelEducativo(parseInt(value)));
            this.form.get('nombreAccion')?.enable({ emitEvent: false });
            this.getBudgetsByIdProduct(value);
            this.onEmitValueEmpty();
          }
        }
      });

    this.form
      .get('nombreAccion')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            this.resetToBudgetsSuscribe();
            const findedBudget = this.dataBudgets.filter(
              (item) => item.nombreAccion === value
            );
            if (findedBudget?.length > 0) {
              this.budgetSelected = findedBudget[0];
            }
            this.form
              .get('claveAccion')
              ?.setValue(getNumeroAccion(findedBudget[0]?.cveAccion));
            this.form
              .get('idCentroCostos')
              ?.setValue(findedBudget[0]?.idCentroCostos);
            if (findedBudget[0]?.partidasPresupuestales?.length > 0) {
              this.isPartidaGasto = true;
              this.form.get('isPresupuesto')?.setValue(true);
              this.form
                .get('partidaGasto')
                ?.setValue(
                  this.generateArrayPartidasGasto(
                    findedBudget[0]?.partidasPresupuestales
                  )
                );
              this.form
                .get('fuenteFinanciamiento')
                ?.setValue(findedBudget[0]?.idFuenteFinanciamiento);
              this.getValuesCalendarizacion(findedBudget[0]);
              this.viewFormLeft = true;
            }
            this.onEmitValue({ acction: EmmitValueEnum.NEW });
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

  async getAll(): Promise<void> {
    this.loading = true;
    await this.getProjects();
    this.getPresupuestoModiByIdAdecuacionSolicitud();
    this.loading = false;
  }

  getPresupuestoModiByIdAdecuacionSolicitud() {
    this.budgetsFollowService
      .getBudgetModiByIdAdecuacionSolicitud(
        getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.presupuesto,
          tipoModificacion: MODIFICATION_TYPE.modificacion,
        })
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: async (value) => {
          if (value.respuesta.length > 0) {
            let tmpData: any[] = [];

            for (const item of value.respuesta) {
              let presupuestoReferencia = item.presupuestoReferencia;

              const productSelected = await this.getProductByIdPromise(
                presupuestoReferencia.idProducto
              );
              if (productSelected) {
                const activitySelected: any = await this.getActivityByIdPromise(
                  productSelected.idActividad
                );

                const projectSelected: any =
                  this.dataProjects.filter(
                    (x) => x.idProyecto === productSelected.idProyecto
                  )?.[0] ?? {};

                tmpData.push({
                  ...item,
                  claveProducto: getCveProducto({
                    catCategoria: this.catCategoria,
                    catTipoProducto: this.catTipoProducto,
                    projectSelected,
                    activitySelected,
                    productSelected: productSelected,
                  }),
                  nombreAccion: presupuestoReferencia.nombreAccion,
                  isImplicaPresupuesto:
                    presupuestoReferencia.partidasPresupuestales.length > 0
                      ? 'Si'
                      : 'No',
                  proyecto: projectSelected,
                  actividad: activitySelected,
                  producto: productSelected,
                  fullStatus: getGlobalStatus(
                    item.presupuestoReferencia.estatus
                  ),
                });
              }
            }
            this.data = tmpData.reverse();
          } else {
            this.data = [];
          }
        },
      });
  }

  updaloadForms(dataAction: any, acctionEmmit: EmmitValueEnum) {
    this.dataSelected = true;
    let presupuestoReferencia = dataAction.presupuestoReferencia;
    let presupuestoModificacion = dataAction.presupuestoModificacion;
    this.productsFollowService
      .getProductById(presupuestoReferencia.idProducto)
      .subscribe({
        next: async (producto) => {
          let productoFind = producto.respuesta;
          this.form.get('nombreProyecto')?.setValue(productoFind.idProyecto);
          const findedProject = this.dataProjects.filter(
            (item) => item.idProyecto === productoFind.idProyecto
          );
          if (findedProject?.length > 0) {
            this.projectSelected = findedProject[0];
          }
          this.form
            .get('claveProyecto')
            ?.setValue(this.projectSelected?.claveUnidad);
          await this.getActivities(productoFind.idProyecto);
          this.form.get('nombreActividad')?.setValue(productoFind.idActividad);
          const findedActivity = this.dataActivities.filter(
            (item) => item.idActividad === productoFind.idActividad
          );
          if (findedActivity?.length > 0) {
            this.activitySelected = findedActivity[0];
          }
          await this.getProductsByIdActivity(productoFind.idActividad);
          this.form.get('nombreProducto')?.setValue(productoFind.idProducto);
          const findedProduct = this.dataProducts.filter(
            (item) => item.idProducto === productoFind.idProducto
          );
          if (findedProduct?.length > 0) {
            this.productSelected = findedProduct[0];
          }
          this.form
            .get('claveNivelEducativo')
            ?.setValue(
              this.getClaveNivelEducativo(parseInt(productoFind.idProducto))
            );
          await this.getBudgetsByIdProduct(productoFind.idProducto);
          this.form
            .get('nombreAccion')
            ?.setValue(presupuestoReferencia.nombreAccion);
          const findedBudget = this.dataBudgets.filter(
            (item) => item.nombreAccion === presupuestoReferencia.nombreAccion
          );
          if (findedBudget?.length > 0) {
            this.budgetSelected = findedBudget[0];
          }

          this.form
            .get('claveAccion')
            ?.setValue(getNumeroAccion(findedBudget[0].cveAccion));

          this.form
            .get('idCentroCostos')
            ?.setValue(findedBudget[0]?.idCentroCostos);
          if (findedBudget[0]?.partidasPresupuestales?.length > 0) {
            this.isPartidaGasto = true;
            this.form.get('isPresupuesto')?.setValue(true);
            this.form
              .get('partidaGasto')
              ?.setValue(
                this.generateArrayPartidasGasto(
                  findedBudget[0]?.partidasPresupuestales
                )
              );
            this.form
              .get('fuenteFinanciamiento')
              ?.setValue(findedBudget[0]?.idFuenteFinanciamiento);
            this.getValuesCalendarizacion(findedBudget[0]);
            this.viewFormLeft = true;
          }
          this.budgetSelected.nombreAccion =
            presupuestoModificacion.nombreAccion;
          this.budgetSelected.idCentroCostos =
            presupuestoModificacion.idCentroCostos;
          this.budgetSelected.partidasPresupuestales =
            presupuestoModificacion.partidasPresupuestales;
          this.budgetSelected.idFuenteFinanciamiento =
            presupuestoModificacion.idFuenteFinanciamiento;
          this.onEmitValue({ acction: acctionEmmit });
          this.dataSelected = false;
        },
      });
  }

  getProjects() {
    return new Promise<void>((resolve, reject) => {
      this.projectsFollowService
        .getConsultarProyectos(this.yearNav, false, 0, false)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta?.length > 0) {
              if (this.position === 'left') {
                this.dataProjects = value.respuesta.filter(
                  (item) =>
                    item.estatus === 'O' &&
                    this.dataUser.perfilLaboral.cveUnidad === item.claveUnidad
                );
              }
              this.questions[2].options = this.dataProjects.map((item) => {
                return {
                  id: item.idProyecto,
                  value: item.nombre,
                };
              });
              resolve();
            }
          },
          error: (error) => {
            reject(new Error(error));
          },
        });
    });
  }

  async getActivities(idProject: number) {
    return new Promise<void>((resolve, reject) => {
      this.resetToActivities();
      this.questions[1].options = [];
      let excluirCortoPlazo: boolean = false,
        idSolicitud: number = 0;
      this.activitiesFollowService
        .getActivityByProjectIdSolicitud(
          idProject,
          excluirCortoPlazo,
          idSolicitud
        )
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
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
              this.form.controls['nombreActividad']?.enable({
                emitEvent: false,
              });
              resolve();
            }
          },
          error: (error) => {
            reject(new Error(error));
          },
        });
    });
  }

  async getProductsByIdActivity(idActivity: string) {
    return new Promise<void>((resolve, reject) => {
      this.resetToProducts();
      this.questions[4].options = [];
      let excluirCortoPlazo: boolean = false,
        idSolicitud: number = 0;
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
              this.form.controls['nombreProducto']?.enable({
                emitEvent: false,
              });
              this.questions[4].options = mapOptionProducts(this.dataProducts);
              resolve();
            }
          },
          error: (error) => {
            reject(new Error(error));
          },
        });
    });
  }

  async getBudgetsByIdProduct(idProduct: number) {
    return new Promise<void>((resolve, reject) => {
      this.resetToBudgets();
      this.budgetsFollowService
        .getBudgetByIdProduct(idProduct, false, 0)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta?.length > 0) {
              const validItems = value.respuesta.filter(
                (item) => item.estatus !== 'B'
              );

              if (!this.projectSelected || validItems.length === 0) {
                return;
              }

              this.listActions = [];

              for (const item of validItems) {
                this.listActions.push({
                  id: item?.nombreAccion,
                  value: item?.nombreAccion,
                });
              }
              this.form.get('nombreAccion')?.enable({ emitEvent: false });
              this.questions[7].options = this.listActions;
              this.dataBudgets = value.respuesta;
            }
            resolve();
          },
          error: (error) => {
            reject(new Error(error));
          },
        });
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
          tipoModificacion: MODIFICATION_TYPE.modificacion,
        }),
        idPresupuestoReferencia: this.idBudgetReferencia,
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
            this._alertService.showAlert('Se Guardó Correctamente');
            let ajustes: any[] = [];

            this.expensiveResumes?.map((item) => {
              ajustes.push({
                idCatalogoPartidaGasto: item.partidaId,
                mes: item.mesIdAmpleacion
                  ? item.mesIdAmpleacion
                  : item.mesIdReduccion,
                monto: item.mesIdAmpleacion
                  ? item.importeAmpleacion
                  : item.importeReduccion,
                tipo: item.mesIdAmpleacion ? 1 : 2,
                cvePresupuestal: item.mesIdAmpleacion
                  ? item.claveAmpleacion
                  : item.claveReduccion,
                csEstatus: 'C',
                idPresupuesto: this.idBudgetReferencia,
              });
            });

            this.budgetsFollowService
              .ampliacionReduccionBudget({
                idAdecuacionSolictud: getIdAdecuancionSolicitud({
                  tipoApartado: TIPO_APARTADO.presupuesto,
                  tipoModificacion: MODIFICATION_TYPE.modificacion,
                }),
                idPresupuesto: this.idBudgetReferencia,
                ajustes: ajustes,
              })
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  this.onEmitValue({ acction: EmmitValueEnum.NEW });
                },
              });
          },
        });
    }
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: any = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.form.disable({ emitEvent: false });
        this.updaloadForms(dataAction, EmmitValueEnum.VIEW);
        break;
      case TableConsts.actionButton.edit:
        this.form.disable({ emitEvent: false });
        this.updaloadForms(dataAction, EmmitValueEnum.UPDATE);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Modificación Seleccionada?',
          });
          if (confirm) {
            this.budgetsFollowService
              .deleteAdecuacion({
                idReferencia: dataAction.idPresupuestoReferencia,
                idAdecuacionSolicitud: getIdAdecuancionSolicitud({
                  tipoApartado: TIPO_APARTADO.presupuesto,
                  tipoModificacion: MODIFICATION_TYPE.modificacion,
                }),
              })
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getAll();
                    this.clear();
                    this.onEmitValue({ acction: EmmitValueEnum.DELETE });
                    this.form
                      .get('nombreProyecto')
                      ?.enable({ emitEvent: false });
                    this.expensiveResumes = [];
                    this.expensiveResumesChange.emit(this.expensiveResumes);
                    this.onEmitValueEmpty();
                  }
                },
              });
          }
        }
        break;
    }
  }

  clear() {
    this.form.get('nombreProyecto')?.setValue('');
    this.form.get('claveProyecto')?.setValue('');
    this.resetToActivities();

    this.expensiveResumes = [];
    this.dataSelected = false;
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

  onEmitValue(emmitValue: EmmitValue) {
    const valueToEmit = {
      projectSelected: this.projectSelected,
      activitySelected: this.activitySelected,
      productSelected: this.productSelected,
      budgetSelected: this.budgetSelected,
      listActions: this.listActions,
      actionEmmit: emmitValue.acction,
    };
    this.setRecord.emit(valueToEmit);
  }

  onEmitValueEmpty() {
    this.setRecord.emit(null);
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

  getProductByIdPromise(idProducto: number) {
    return new Promise<any>((resolve, reject) => {
      this.productsFollowService.getProductById(idProducto).subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta) {
            resolve(value.respuesta);
          } else {
            reject(new Error());
          }
        },
        error: (err) => {
          reject(new Error(err));
        },
      });
    });
  }

  getActivityByIdPromise(idActivity: number) {
    return new Promise((resolve, reject) => {
      this.activitiesFollowService
        .getActivityById(idActivity)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta) {
              resolve(value.respuesta);
            } else {
              reject(new Error());
            }
          },
          error: (error) => {
            reject(new Error(error));
          },
        });
    });
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

  private resetToActivities() {
    this.form.get('nombreActividad')?.setValue('');
    this.form.get('nombreActividad')?.disable({ emitEvent: false });
    this.resetToProducts();
  }

  private resetToProducts() {
    this.form.get('nombreProducto')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.form.get('nombreProducto')?.disable({ emitEvent: false });
    this.resetToBudgets();
  }

  private resetToBudgets() {
    this.form.get('nombreAccion')?.setValue('');

    this.form.get('claveAccion')?.disable({ emitEvent: false });
    this.form.get('nombreAccion')?.disable({ emitEvent: false });

    this.resetToBudgetsSuscribe();
  }

  private resetToBudgetsSuscribe() {
    this.form.get('claveAccion')?.setValue('');
    this.form.get('idCentroCostos')?.setValue('');
    this.form.get('isPresupuesto')?.setValue(false);
    this.form.get('partidaGasto')?.setValue('');
    this.form.get('fuenteFinanciamiento')?.setValue('');

    this.form.get('claveAccion')?.disable({ emitEvent: false });
    this.form.get('idCentroCostos')?.disable({ emitEvent: false });
    this.form.get('isPresupuesto')?.disable({ emitEvent: false });
    this.form.get('partidaGasto')?.disable({ emitEvent: false });
    this.form.get('fuenteFinanciamiento')?.disable({ emitEvent: false });

    this.viewFormLeft = false;
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }
}

interface EmmitValue {
  acction?: EmmitValueEnum;
}

enum EmmitValueEnum {
  NEW = 1,
  VIEW = 2,
  UPDATE = 3,
  DELETE = 4,
}
