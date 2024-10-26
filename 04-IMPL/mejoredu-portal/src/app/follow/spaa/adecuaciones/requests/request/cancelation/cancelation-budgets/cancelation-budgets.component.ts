import { Component, OnDestroy } from '@angular/core';
import { BudgetCalendarI } from '../../arr/budgets-arr/interface/budget-calendar.interface';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseItemComponent } from '../../add-expense-item/add-expense-item.component';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { FormGroup, Validators } from '@angular/forms';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { forkJoin, lastValueFrom, Subject, take, takeUntil } from 'rxjs';
import { ExpenseItemI } from '../../add-expense-item/interfaces/expensive-item.interface';
import { ExpensiveResumeI } from '../../add-expense-item/interfaces/expensive-resume.interface';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { SpentTable } from '../../budgets/classes/spent-table.class';
import SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  Calendarizacion,
  IItmeBudgetResponse,
  PartidasPresupuestale,
} from '@common/interfaces/short-term/budget.interface';
import { AlertService } from '@common/services/alert.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { BudgetsFollowService } from '@common/services/seguimiento/budget.service';
import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import {
  getCveProyecto,
  getIdAdecuancionSolicitud,
  getNumeroAccion,
  getNumeroActividad,
  getNumeroNivelEducativo,
} from '@common/utils/Utils';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { mapOptionProducts } from '@common/mapper/data-options.mapper';
import { Spent } from '../../budgets/classes/spent.class';
import { TIPO_APARTADO } from '../../enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../../enum/modification.enum';
import { OptionI } from '@common/form/interfaces/option.interface';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableColumn } from '@common/models/tableColumn';
import { TableButtonAction } from '@common/models/tableButtonAction';

@Component({
  selector: 'app-cancelation-budgets',
  templateUrl: './cancelation-budgets.component.html',
  styleUrls: ['./cancelation-budgets.component.scss'],
})
export class CancelationBudgetsComponent
  extends SpentTable
  implements OnDestroy {
  String(arg0: number) {
    return String(arg0.toFixed(2));
  }
  ls = new SecureLS({ encodingType: 'aes' });
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
  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  private _body = document.querySelector('body');

  dataUser: IDatosUsuario;
  yearNav: string;
  selectedSolicitud: any;

  isPartidaGasto: boolean = false;
  partidasGastoTemp: number[] = [];
  calendarizacionInit: Calendarizacion[];
  viewFormCancel: boolean = false;
  budgetIncomplete: boolean = false;
  countBudgetIncomplete: number = 0;
  viewPartidasAmpRed: boolean = false;
  isButtonDisabled: boolean = true;

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

  dataSelected: boolean = false;

  catPartidasPresupuestales: IItemCatalogoResponse[] = [];
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];

  expensiveResumes: ExpensiveResumeI[] = [];

  viewTableCancelation: boolean = false;
  actions: TableActionsI = {
    delete: true,
    view: true,
  };
  customBtn: string = '';
  columns: TableColumn[] = [];
  data: any;

  constructor(
    private _formBuilder: QuestionControlService,
    private _dialog: MatDialog,
    private _alertService: AlertService,
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

    this._body?.classList.add('hideW');

    this.calendarizacionInit = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      monto: 0,
    }));
  }

  ngOnInit() {
    this.getCatalogs();
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
            if (!this.dataSelectedProduct) {
              this.getProductsByIdActivity(value);
            }
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
              this.viewFormCancel = true;
            }
            //this.getDataAjustesPresupuesto(findedBudget[0].idPresupuesto);
            this.isButtonDisabled = false;
            this.viewPartidasAmpRed = true;
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
    await this.getProjects();
    this.budgetsFollowService
      .getBudgetCancelacion(
        getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.presupuesto,
          tipoModificacion: MODIFICATION_TYPE.cancelacion,
        })
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: async (value) => {
          if (value.respuesta.length > 0) {
            this.chargeInitTable();
            let tmpData: any[] = [];
            let promises = value.respuesta.map(async (item) => {
              let claveProyecto = '',
                claveActividad = '',
                claveProducto: any;
              let presupuestoReferencia = item.presupuestoReferencia;

              return new Promise<void>((resolve) => {
                this.productsFollowService
                  .getProductById(presupuestoReferencia.idProducto)
                  .subscribe({
                    next: async (producto) => {
                      let productoFind = producto.respuesta;
                      claveProyecto = getCveProyecto({
                        cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
                        cveProyecto: +this.dataProjects.filter(
                          (x) => x.idProyecto === productoFind.idProyecto
                        )[0].clave,
                      });
                      await this.getActivities(productoFind.idProyecto, true);

                      claveActividad = getNumeroActividad(
                        this.dataActivities.filter(
                          (x) => x.idActividad === productoFind.idActividad
                        )[0].cveActividad
                      );

                      claveProducto = this.setClaveProducto({
                        projectSelected: this.dataProjects.filter(
                          (x) => x.idProyecto === productoFind.idProyecto
                        )[0],
                        activitySelected: this.dataActivities.filter(
                          (x) => x.idActividad === productoFind.idActividad
                        )[0],
                        claveProductoForm: '0000-000-00-0-00',
                        numeroProductoForm: productoFind?.cveProducto || '',
                        categorizacionProductoForm:
                          productoFind?.idCategorizacion || 0,
                        tipoProductoForm: productoFind?.idTipoProducto || 0,
                        setClaveProducto: false,
                      });

                      tmpData.push({
                        claveProyecto,
                        claveActividad,
                        claveProducto,
                        nombreAccion: presupuestoReferencia.nombre,
                        isImplicaPresupuesto:
                          presupuestoReferencia.partidasPresupuestales.length >
                            0
                            ? 'Si'
                            : 'No',
                        ...presupuestoReferencia,
                      });
                      resolve();
                    },
                    error: () => resolve(), // resolve on error to prevent hanging
                  });
              });
            });

            await Promise.all(promises);
            this.data = tmpData;
          }
        },
      });
  }

  async getDataAjustesPresupuesto(idPresupuesto: number) {
    this.budgetsFollowService
      .getPartidasGastoAjuste(
        idPresupuesto,
        getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.presupuesto,
          tipoModificacion: MODIFICATION_TYPE.cancelacion,
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
        },
      });
  }

  async selectedBudgetCancelation(presupuestoReferencia: any) {
    this.productsFollowService
      .getProductById(presupuestoReferencia.idProducto)
      .subscribe({
        next: async (producto) => {
          let productoFind = producto.respuesta;
          this.dataSelected = true;
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

          let listActions: any = [];

          listActions.push({
            id: presupuestoReferencia?.nombreAccion,
            value: presupuestoReferencia?.nombreAccion,
          });

          this.questions[7].options = listActions;

          //await this.getBudgetsByIdProduct(productoFind.idProducto);
          this.form
            .get('nombreAccion')
            ?.setValue(presupuestoReferencia.nombreAccion);
          //const findedBudget = this.dataBudgets.filter(
          //  (item) => item.nombreAccion === presupuestoReferencia.nombreAccion
          //);
          //if (findedBudget?.length > 0) {
          //  this.budgetSelected = findedBudget[0];
          //}
          this.form
            .get('claveAccion')
            ?.setValue(getNumeroAccion(presupuestoReferencia.cveAccion));
          this.form
            .get('idCentroCostos')
            ?.setValue(presupuestoReferencia?.idCentroCostos);
          if (presupuestoReferencia?.partidasPresupuestales?.length > 0) {
            this.isPartidaGasto = true;
            this.form.get('isPresupuesto')?.setValue(true);
            this.form
              .get('partidaGasto')
              ?.setValue(
                this.generateArrayPartidasGasto(
                  presupuestoReferencia?.partidasPresupuestales
                )
              );
            this.form
              .get('fuenteFinanciamiento')
              ?.setValue(presupuestoReferencia?.idFuenteFinanciamiento);
            this.getValuesCalendarizacion(presupuestoReferencia);
          }
          this.getDataAjustesPresupuesto(presupuestoReferencia.idPresupuesto);
          this.isButtonDisabled = true;
          this.viewPartidasAmpRed = true;
          this.cancelationSuccess();
        },
      });
    this.dataSelected = false;
  }

  getProjects() {
    return new Promise<void>((resolve, reject) => {
      this.projectsFollowService
        .getConsultarProyectos(this.yearNav, false, 0, false)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta?.length > 0) {
              this.dataProjects = value.respuesta.filter(
                (item) =>
                  item.estatus === 'O' &&
                  this.dataUser.perfilLaboral.cveUnidad === item.claveUnidad
              );
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
            reject(error);
          },
        });
    });
  }

  async getActivities(idProject: number, disable?: boolean) {
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
              if (!disable)
                this.form.get('nombreActividad')?.enable({ emitEvent: false });

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
              resolve();
            }
          },
          error: (error) => {
            reject(error);
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
            reject(error);
          },
        });
    });
  }

  async getBudgetsByIdProduct(idProduct: number) {
    return new Promise<void>((resolve, reject) => {
      this.resetToBudgets();
      this.budgetsFollowService
        .getBudgetByIdProduct(
          idProduct,
          false,
          getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.presupuesto,
            tipoModificacion: MODIFICATION_TYPE.cancelacion,
          })
        )
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

              let listActions: any = [];

              for (const item of validItems) {
                listActions.push({
                  id: item?.nombreAccion,
                  value: item?.nombreAccion,
                });
              }
              this.form.get('nombreAccion')?.enable({ emitEvent: false });
              this.questions[7].options = listActions;
              this.dataBudgets = value.respuesta;
            }
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  submit(): void {
    const { nombreAccion } = this.form.getRawValue();
    let presupuestoReferencia = this.dataBudgets.filter(
      (item) => item.nombreAccion === nombreAccion
    )[0];

    this.budgetsFollowService
      .cancelBudget({
        idAdecuacionSolicitud: getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.presupuesto,
          tipoModificacion: MODIFICATION_TYPE.cancelacion,
        }),
        idPresupuestoReferencia: presupuestoReferencia.idPresupuesto,
      })
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: async (value) => {
          this._alertService.showAlert('Se Cancelo Correctamente');

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
              idPresupuesto: presupuestoReferencia.idPresupuesto,
            });
          });

          this.budgetsFollowService
            .ampliacionReduccionBudget({
              idAdecuacionSolictud: getIdAdecuancionSolicitud({
                tipoApartado: TIPO_APARTADO.presupuesto,
                tipoModificacion: MODIFICATION_TYPE.cancelacion,
              }),
              idPresupuesto: presupuestoReferencia.idPresupuesto,
              ajustes: ajustes,
            })
            .pipe(takeUntil(this.notifier))
            .subscribe({
              next: (value) => { },
            });
          this.getAll();
          this.clear();
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: any = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.selectedBudgetCancelation(dataAction);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Descartar la Cancelación Seleccionada?',
          });
          if (confirm) {
            this.budgetsFollowService
              .deleteAdecuacion({
                idReferencia: dataAction.idPresupuesto,
                idAdecuacionSolicitud: getIdAdecuancionSolicitud({
                  tipoApartado: TIPO_APARTADO.presupuesto,
                  tipoModificacion: MODIFICATION_TYPE.cancelacion,
                }),
              })
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert(
                      'Se Descarto la Cancelación Correctamente'
                    );
                    this.data = this.data.filter(
                      (item) => item.idPresupuesto !== dataAction.idPresupuesto
                    );
                    this.clear();
                  }
                },
              });
          }
        }
        break;
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
          partida.calendarizacion.find((cal) => cal.mes === 1)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 2)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 3)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 4)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 5)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 6)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 7)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 8)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 9)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 10)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 11)?.monto || 0,
          partida.calendarizacion.find((cal) => cal.mes === 12)?.monto || 0
        )
      );
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
        idCatalogoPartidaGasto: partidaGastoPresupuestal?.idCatalogo || 0,
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

  private chargeInitTable() {
    this.data = [];
    this.viewTableCancelation = true;
    this.columns = [
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
      {
        columnDef: 'nombreAccion',
        header: 'Nombre de Acción',
        alignLeft: true,
      },
      {
        columnDef: 'isImplicaPresupuesto',
        header: 'Implica Presupuesto',
        width: '180px',
      },
    ];
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

    this.viewFormCancel = false;
    this.viewPartidasAmpRed = false;
    this.isButtonDisabled = true;
  }

  async addExpenseItem(): Promise<void> {
    const result: ExpenseItemI[] = await lastValueFrom(
      this._dialog
        .open(AddExpenseItemComponent, {
          width: '1600px',
        })
        .afterClosed()
    );
    if (!result) {
      return;
    }
    result.forEach((item: ExpenseItemI) => {
      if (item.ampleacion) {
        this.expensiveResumes.push({
          partida: item.nombrePartidaGasto,
          claveAmpleacion: item.clavePresupuestal,
          importeAmpleacion: item.importe,
          mesAmpleacion: item.mes,
          claveReduccion: '',
          importeReduccion: undefined,
          mesReduccion: '',
          importeNeto: item.importe,
          partidaId: item.idPartidaGasto,
          mesIdReduccion: 0,
          mesIdAmpleacion: item.mesId,
        });
      } else {
        this.expensiveResumes.push({
          partida: item.nombrePartidaGasto,
          claveAmpleacion: '',
          importeAmpleacion: undefined,
          mesAmpleacion: '',
          claveReduccion: item.clavePresupuestal,
          importeReduccion: (item.importe || 0) * -1,
          mesReduccion: item.mes,
          importeNeto: (item.importe || 0) * -1,
          partidaId: item.idPartidaGasto,
          mesIdReduccion: item.mesId,
          mesIdAmpleacion: 0,
        });
      }
    });
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
      const claveProyecto = projectSelected.clave;
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
      return;
    } else {
      return arrClaveProducto.join('-');
    }
  }

  clear() {
    this.form.get('nombreProyecto')?.enable({ emitEvent: false });
    this.form.get('nombreProyecto')?.setValue('');
    this.form.get('claveProyecto')?.setValue('');
    this.resetToActivities();

    this.expensiveResumes = [];
    this.isButtonDisabled = false;
    this.dataSelected = false;
  }

  private cancelationSuccess() {
    this.form.disable({ emitEvent: false });
    this.isButtonDisabled = true;
  }

  getSumImporteAmpleacion(): number {
    return this.expensiveResumes.reduce(
      (a, b) => a + (b.importeAmpleacion || 0),
      0
    );
  }

  getSumImporteReduccion(): number {
    return this.expensiveResumes.reduce(
      (a, b) => a + (b.importeReduccion || 0),
      0
    );
  }
  getSumImporteNeto(): number {
    return this.getSumImporteAmpleacion() + this.getSumImporteReduccion();
  }

  async deleteAmpliaReduccion(dataDelete: any) {
    const confirm = await this._alertService.showConfirmation({
      message: `¿Está Seguro de Eliminar la Partida de Gasto ${dataDelete.partida}?`,
    });
    if (confirm) {
      if (dataDelete.claveAmpleacion) {
        this.expensiveResumes = this.expensiveResumes.filter(
          (item) => item?.claveAmpleacion !== dataDelete?.claveAmpleacion
        );
      } else {
        this.expensiveResumes = this.expensiveResumes.filter(
          (item) => item?.claveReduccion !== dataDelete?.claveReduccion
        );
      }
    }
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }
}
