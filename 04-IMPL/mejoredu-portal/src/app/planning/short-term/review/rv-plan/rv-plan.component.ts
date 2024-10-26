import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { AlertService } from '@common/services/alert.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { SpentTable } from '../../annual-project/form/v2/budgets/classes/spent-table.class';
import { Spent } from '../../annual-project/form/v2/budgets/classes/spent.class';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ValidadorService } from '@common/services/validador.service';
import { ActivitiesService } from '@common/services/activities.service';
import { ProductsService } from '@common/services/products.service';
import {
  IRevisionPayload,
  IRubricaComponent,
  IRubricaPayload,
  IValidationPayload,
} from '@common/interfaces/validation.interface';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import {
  getCveAccion,
  getCveProducto,
  getCveProyecto,
  getNumeroActividad,
  getTotalRubrics,
} from '@common/utils/Utils';
import { ProjectsService } from '@common/services/projects.service';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { BudgetsService } from '@common/services/budgets.service';
import { IItmeBudgetResponse } from '@common/interfaces/short-term/budget.interface';
import { mapCatalogData } from '@common/mapper/catalog.mapper';

@Component({
  selector: 'app-rv-plan',
  templateUrl: './rv-plan.component.html',
  styleUrls: ['./rv-plan.component.scss', '../rv/cp.scss'],
})
export class RvPlanComponent extends SpentTable implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  notifier = new Subject();
  top: number = 3;
  selectedValidateProyectoPAA: IItemProjectsResponse;
  selectedActividad!: IItemActivitiesResponse;
  selectedProducto!: IItemProductResponse;
  selectedRubric: IRubricaComponent | undefined;
  listActivities: IItemActivitiesResponse[] = [];
  listProducts: IItemProductResponse[] = [];
  listBudgets: IItmeBudgetResponse[] = [];
  dataUser: IDatosUsuario;
  isSubmitingSave: boolean = false;
  isSubmitingSend: boolean = false;
  isSubmitingValidation: boolean = false;
  idSaveValidar: number = 0;
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];
  catIndicadorMIR: IItemCatalogoResponse[] = [];
  showAppValidate: boolean = false;
  redirectToRubric: boolean = false;
  existRevisionSave: boolean = false;
  enableSend: boolean = false;
  enableValidation: boolean = false;
  totalRubric: string = '';
  catPartidasPresupuestales: IItemCatalogoResponse[] = [];
  dataRevision: IRevisionPayload[] = [
    {
      idElemento: 79,
      check: 1,
      comentarios: null,
    },
  ];
  listRubrics: IRubricaPayload[] = [];
  dataRevisionAppValidate: IRevisionPayload[] = [];
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

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private router: Router,
    private validadorService: ValidadorService,
    private activitiesService: ActivitiesService,
    private productsService: ProductsService,
    private projectsService: ProjectsService,
    private catalogService: CatalogsService,
    private budgetsService: BudgetsService
  ) {
    super();
    this.selectedRubric = this.ls.get('selectedRubric');
    if (this.selectedRubric) {
      this.ls.remove('selectedRubric');
      this.listRubrics = this.selectedRubric.listRubrics ?? [];
    }
    this.dataUser = this.ls.get('dUaStEaR');
    this.selectedValidateProyectoPAA = this.ls.get(
      'selectedValidateProyectoPAA'
    ).value;
    this.buildForm();
    document.querySelector('.can-validate')?.classList.add('validate');
    document.querySelector('footer')?.classList.add('validate');
    if (this.selectedValidateProyectoPAA) {
      this.getCatalogs();
      this.uploadProyect();
      this.getActivities();
      this.validateStatus();
    } else {
      router.navigate([
        '/Planeación/Planeación a Corto Plazo/Revisión y Validación',
      ]);
    }
  }

  validateStatus() {
    this.enableSend = false;
    this.enableValidation = false;
    const estatus = this.selectedValidateProyectoPAA.estatus;
    if (estatus) {
      if (estatus === 'V') {
        this.enableValidation = true;
      }
      if (estatus === '1' || estatus === '2' || estatus === '3') {
        this.enableSend = true;
      }
      if (estatus === 'E' || estatus === 'P') {
        this.enableSend = true;
        this.enableValidation = true;
      }
    } else {
      this.enableSend = true;
      this.enableValidation = true;
    }
  }

  ngOnInit() {
    if (this.selectedValidateProyectoPAA) {
      this.form
        .get('activities')
        ?.valueChanges.pipe(takeUntil(this.notifier))
        .subscribe((value) => {
          if (value) {
            this.showAppValidate = false;
            this.form.get('products')?.setValue('', { emitEvent: false });
            this.listProducts = [];
            this.questions[2].options = [];
            const findedActividad = this.listActivities.filter(
              (item) => item.idActividad === value
            );
            if (findedActividad?.length > 0) {
              this.selectedActividad = findedActividad[0];
            }
            this.getProductsByIdActivity(
              String(this.selectedActividad.idActividad)
            );
            this.form.get('observations')?.setValue('');
            this.form.get('observationsPlan')?.setValue('');
            this.top = 3;
            this.dataRevision[0].check = 1;
            this.dataRevision[0].comentarios = null;
          }
        });

      this.form
        .get('products')
        ?.valueChanges.pipe(takeUntil(this.notifier))
        .subscribe((value) => {
          if (value) {
            this.showAppValidate = false;
            setTimeout(() => {
              this.showAppValidate = true;
            }, 100);
            const findedProducto = this.listProducts.filter(
              (item) => item.idProducto === value
            );
            if (findedProducto?.length > 0) {
              this.selectedProducto = findedProducto[0];
            }
            this.idSaveValidar = this.selectedProducto.idProducto;
            this.table = [];
            this.questions[8].options = [];
            this.form.get('observations')?.setValue('');
            this.form.get('observationsPlan')?.setValue('');
            this.dataRevision[0].check = 1;
            this.dataRevision[0].comentarios = null;
            this.form.get('agend')?.setValue('', { emmitEvent: false });
            this.form.get('kayName')?.setValue('', { emmitEvent: false });
            this.getBudgetsByIdProduct(value);
            this.uploadDatoToScreen();
            this.consultarRevision();
          }
        });

      this.form.get('kayName')?.valueChanges.subscribe((value) => {
        if (value) {
          let selectedBudget: any = null;
          const findedBudget = this.listBudgets.filter(
            (item) => item.idPresupuesto === value
          );
          if (findedBudget.length) {
            selectedBudget = findedBudget[0];
          }
          if (selectedBudget) {
            this.getValuesCalendarizacion(selectedBudget);
          }
        }
      });

      this.form
        .get('observationsPlan')
        ?.valueChanges.pipe(takeUntil(this.notifier))
        .subscribe((value) => {
          if (value !== undefined && value !== null) {
            this.dataRevision[0].check = value === '' ? 1 : 0;
            this.dataRevision[0].comentarios = value === '' ? null : value;
          }
        });
    }
  }

  buildForm(): void {
    this.questions = [
      new TextboxQuestion({
        idElement: 127,
        nane: 'project',
        label: 'Proyecto',
        readonly: true,
        value: '',
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        idElement: 128,
        nane: 'activities',
        label: 'Actividades',
        filter: true,
        options: [],
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        idElement: 129,
        nane: 'products',
        label: 'Productos',
        disabled: true,
        filter: true,
        options: [],
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        idElement: 130,
        nane: 'category',
        label: 'Categoría',
        readonly: true,
        value: '',
        validators: [Validators.maxLength(200)],
      }),

      new TextboxQuestion({
        idElement: 131,
        nane: 'type',
        label: 'Tipo',
        readonly: true,
        value: '',
        validators: [Validators.maxLength(200)],
      }),

      new TextboxQuestion({
        idElement: 132,
        nane: 'indecator',
        label: 'Indicador MIR',
        readonly: true,
        value: '',
        validators: [Validators.maxLength(200)],
      }),

      new TextboxQuestion({
        idElement: 133,
        nane: 'potic',
        label: 'POTIC',
        readonly: true,
        value: '',
        validators: [Validators.maxLength(200)],
      }),

      new DropdownQuestion({
        idElement: 134,
        nane: 'agend',
        label: 'Agenda de Autoridad',
        disabled: true,
        options: [],
      }),

      new DropdownQuestion({
        idElement: 135,
        nane: 'kayName',
        label: 'Clave y Nombre de la Acción',
        filter: true,
        options: [],
      }),

      new TextareaQuestion({
        nane: 'observations',
        label: 'Observaciones Presupuesto',
        readonly: true,
        value: '',
      }),

      new TextareaQuestion({
        nane: 'observationsPlan',
        label: 'Observaciones Planeación',
        value: '',
        validators: [Validators.required, Validators.maxLength(200)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('activities')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('products')?.enable({ emitEvent: false });
      } else {
        this.form.get('products')?.disable({ emitEvent: false });
      }
    });
    this.form.get('products')?.valueChanges.subscribe((value) => {
      if (value) {
        this.top = 6;
      }
    });
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
        environment.endpoints.catalogs['catalogoPartidasPresupuestales']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['alcance']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(
        ([
          dataCategoria,
          dataTipoProducto,
          dataNombreIndicadorMIR,
          dataCatalogoPartidasPresupuestales,
          dataAlcance,
        ]) => {
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
          this.catIndicadorMIR = dataNombreIndicadorMIR.catalogo;
          this.catPartidasPresupuestales =
            dataCatalogoPartidasPresupuestales.catalogo;
          this.questions[7].options = mapCatalogData({
            data: dataAlcance,
          });
        }
      );
  }

  uploadProyect() {
    this.form.get('project')?.setValue(
      `${getCveProyecto({
        cveProyecto: +this.selectedValidateProyectoPAA.clave,
        cveUnidad: this.selectedValidateProyectoPAA.claveUnidad,
      })} ${this.selectedValidateProyectoPAA.nombre}`
    );
  }

  getActivities() {
    this.activitiesService
      .getActivityByProjectId(this.selectedValidateProyectoPAA.idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.form.get('activities')?.enable();

            const tmpData: any[] = [];
            if (value.respuesta?.length > 0) {
              this.listActivities = value.respuesta;
              if (this.selectedRubric?.selectedActividad) {
                this.form
                  .get('activities')
                  ?.setValue(this.selectedRubric.selectedActividad);
              }
              for (const item of value.respuesta) {
                tmpData.push({
                  id: item.idActividad,
                  value: `${getCveProyecto({
                    cveProyecto: +this.selectedValidateProyectoPAA.clave,
                    cveUnidad: this.selectedValidateProyectoPAA.claveUnidad,
                  })}-${getNumeroActividad(item.cveActividad)} ${item.cxNombreActividad
                    }`,
                });
              }
              this.questions[1].options = tmpData;
            }
          }
        },
      });
  }

  getProductsByIdActivity(idActivity: string) {
    this.productsService
      .getProductByActivityId(idActivity)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.form.get('products')?.enable();
            const tmpData: any[] = [];
            if (value.respuesta?.length > 0) {
              this.listProducts = value.respuesta;
              if (this.selectedRubric?.selectedProducto) {
                this.form
                  .get('products')
                  ?.setValue(this.selectedRubric.selectedProducto);
              }
              for (const item of value.respuesta) {
                tmpData.push({
                  id: item.idProducto,
                  value: `${getCveProducto({
                    catCategoria: this.catCategoria,
                    catTipoProducto: this.catTipoProducto,
                    projectSelected: this.selectedValidateProyectoPAA,
                    activitySelected: this.selectedActividad,
                    productSelected: item,
                  })} ${item.nombre}`,
                });
              }
              this.questions[2].options = tmpData;
            }
          }
        },
        error: (err) => {
          //
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
            this.listBudgets = value.respuesta.filter(
              (budgets) => budgets.estatus === 'C'
            );
            this.questions[8].options = this.listBudgets.map((item) => {
              return {
                id: item.idPresupuesto,
                value: `${getCveAccion({
                  cveAccion: item.cveAccion,
                  catCategoria: this.catCategoria,
                  catTipoProducto: this.catTipoProducto,
                  projectSelected: this.selectedValidateProyectoPAA,
                  activitySelected: this.selectedActividad,
                  productSelected: this.selectedProducto,
                })} ${item.nombreAccion}`,
              };
            });
          } else {
            this.listBudgets = [];
          }
        },
      });
  }

  getValuesCalendarizacion(dataAction: IItmeBudgetResponse) {
    this.table = [];
    let product = this.listProducts.find(
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

  getProjectByIdProject() {
    return new Promise<IItemProjectsResponse>((resolve, reject) => {
      this.projectsService
        .getProjectById(this.selectedValidateProyectoPAA.idProyecto)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200' && value.proyecto.length) {
              resolve(value.proyecto[0]);
            } else {
              reject();
            }
          },
          error: (err) => {
            reject();
          },
        });
    });
  }

  uploadDatoToScreen() {
    if (this.selectedProducto.productoCalendario?.length > 0) {
      const productoCalendario = this.selectedProducto.productoCalendario;
      for (let item of this.mounths) {
        for (const itemMes of item.items) {
          const finded = productoCalendario.filter(
            (itemCalendario) => itemCalendario.mes === itemMes.idMes
          );
          if (finded?.length > 0) {
            itemMes.value = finded[0].monto;
          }
        }
      }
    }
    this.form.get('potic')?.setValue(this.selectedProducto.nombrePotic);
    const findedCategory = this.catCategoria.filter(
      (item) => (item.idCatalogo = this.selectedProducto.idCategorizacion)
    );
    if (findedCategory.length > 0)
      this.form.get('category')?.setValue(findedCategory[0].cdOpcion);
    const findedType = this.catTipoProducto.filter(
      (item) => (item.idCatalogo = this.selectedProducto.idTipoProducto)
    );
    if (findedType.length > 0)
      this.form.get('type')?.setValue(findedType[0].cdOpcion);
    const findedIndicator = this.catIndicadorMIR.filter(
      (item) => (item.idCatalogo = this.selectedProducto.idIndicadorMIR)
    );
    if (findedIndicator.length > 0)
      this.form.get('indecator')?.setValue(findedIndicator[0].cdOpcion);
    else this.form.get('indecator')?.setValue('No aplica');
    this.form.get('agend')?.setValue(this.selectedActividad.idAlcance);
  }

  consultarRevision() {
    this.validadorService
      .consultarRevision({
        apartado: 'VALIDACION-CORTO-PLAZO',
        fromModule: 'cp',
        idSave: String(this.selectedProducto.idProducto),
        tipoUsuario: this.dataUser.idTipoUsuario,
      })
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.existRevisionSave = true;
            if (value.respuesta?.revision?.length > 0) {
              if (this.selectedRubric) {
                this.totalRubric = this.getTotalRubric(
                  this.selectedRubric.listRubrics ?? []
                );
                this.selectedRubric = undefined;
              } else {
                this.totalRubric = this.getTotalRubric(
                  value.respuesta?.rubrica ?? []
                );
              }
              const findedComentPre = value.respuesta.revision.filter(
                (item) => item.idElemento === 78
              );
              if (findedComentPre?.length > 0) {
                const tmpRev = findedComentPre[0];
                this.form
                  .get('observations')
                  ?.setValue(tmpRev.check === 1 ? '' : tmpRev.comentarios);
              }
              const findedComentPla = value.respuesta.revision.filter(
                (item) => item.idElemento === 79
              );

              if (findedComentPla?.length > 0) {
                const tmpRev = findedComentPla[0];
                this.form
                  .get('observationsPlan')
                  ?.setValue(tmpRev.check === 1 ? '' : tmpRev.comentarios);
              }
            }
          }
        },
        error: (err) => { },
      });
  }

  getTotalRubric(listRubrics: IRubricaPayload[]): string {
    this.listRubrics = listRubrics;
    return getTotalRubrics(listRubrics);
  }

  onValueChangeAppValidation(event: IRevisionPayload[]) {
    if (
      JSON.stringify(event) !== JSON.stringify(this.dataRevisionAppValidate)
    ) {
      this.dataRevisionAppValidate = event;
    }
  }

  save(isFromOpenRubric?: boolean): void {
    this.isSubmitingSave = true;
    const dataPayload: IValidationPayload = {
      apartado: 'VALIDACION-CORTO-PLAZO',
      id: this.selectedProducto.idProducto,
      cveUsuario: this.dataUser.cveUsuario,
      revision: this.dataRevisionAppValidate.concat(this.dataRevision),
      estatus: 'E',
      rubrica: this.listRubrics,
    };
    this.validadorService
      .guardar(dataPayload, 'cp')
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (!isFromOpenRubric && value.mensaje.codigo === '200') {
            this.isSubmitingSave = false;
            this.consultarRevision();
            this._alertService.showAlert('Información Guardada');
            this.getProjectByIdProject().then((response) => {
              const tmpProject = response;
              const dataStorage = {
                name: 'view',
                value: tmpProject,
              };
              this.selectedValidateProyectoPAA = tmpProject;
              this.ls.set('selectedValidateProyectoPAA', dataStorage);
              this.validateStatus();
            });
          }
        },
        error: (err) => {
          this.isSubmitingSave = false;
        },
      });
  }

  send(): void {
    this.isSubmitingSend = true;
    let newStatus = '';
    if (
      this.selectedValidateProyectoPAA.estatusPresupuesto === '1' ||
      this.selectedValidateProyectoPAA.estatusPresupuesto === '2' ||
      this.selectedValidateProyectoPAA.estatusPresupuesto === '3'
    ) {
      newStatus = this.selectedValidateProyectoPAA.estatusPresupuesto;
    } else {
      newStatus = String(
        this.selectedValidateProyectoPAA.ixCicloValidacion + 1
      );
    }
    const dataPayload: IValidationPayload = {
      apartado: 'VALIDACION-CORTO-PLAZO',
      id: this.selectedProducto.idProducto,
      cveUsuario: this.dataUser.cveUsuario,
      revision: this.dataRevisionAppValidate.concat(this.dataRevision),
      // estatus: newStatus,
      // estatus: newStatus === '4' ? 'R' : newStatus,
      estatus: 'R',
      rubrica: this.listRubrics,
    };
    this.validadorService
      .guardar(dataPayload, 'cp')
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmitingSend = false;
          if (value.mensaje.codigo === '200') {
            // this.consultarRevision();
            this.router.navigate([
              '/Planeación/Planeación a Corto Plazo/Revisión y Validación',
            ]);
            this._alertService.showAlert('Comentarios Enviados');
          }
        },
        error: (err) => {
          this.isSubmitingSend = false;
        },
      });

    // this.getProjectByIdProject().then((response) => {
    //   const estatusPresupuesto = response.estatusPresupuesto;
    //   if (estatusPresupuesto === 'V') {
    //     this.isSubmitingSend = false;
    //     this._alertService.showAlert(
    //       'El Usuario Presupuesto Envió el Proyecto a Validación Técnica, no es Posible Enviar Comentarios.'
    //     );
    //     const tmpProject = response;
    //     const dataStorage = {
    //       name: 'view',
    //       value: tmpProject,
    //     };
    //     this.selectedValidateProyectoPAA = tmpProject;
    //     this.ls.set('selectedValidateProyectoPAA', dataStorage);
    //     this.validateStatus();
    //   } else {
    //     let newStatus = '';
    //     if (
    //       this.selectedValidateProyectoPAA.estatusPresupuesto === '1' ||
    //       this.selectedValidateProyectoPAA.estatusPresupuesto === '2' ||
    //       this.selectedValidateProyectoPAA.estatusPresupuesto === '3'
    //     ) {
    //       newStatus = this.selectedValidateProyectoPAA.estatusPresupuesto;
    //     } else {
    //       newStatus = String(
    //         this.selectedValidateProyectoPAA.ixCicloValidacion + 1
    //       );
    //     }
    //     const dataPayload: IValidationPayload = {
    //       apartado: 'VALIDACION-CORTO-PLAZO',
    //       id: this.selectedProducto.idProducto,
    //       cveUsuario: this.dataUser.cveUsuario,
    //       revision: this.dataRevisionAppValidate.concat(this.dataRevision),
    //       estatus: newStatus === '4' ? 'R' : newStatus,
    //       rubrica: this.listRubrics,
    //     };
    //     this.validadorService
    //       .guardar(dataPayload, 'cp')
    //       .pipe(takeUntil(this.notifier))
    //       .subscribe({
    //         next: (value) => {
    //           this.isSubmitingSend = false;
    //           this.consultarRevision();
    //           this.router.navigate([
    //             '/Planeación/Planeación a Corto Plazo/Revisión y Validación',
    //           ]);
    //           this._alertService.showAlert('Comentarios Enviados');
    //         },
    //         error: (err) => {
    //           this.isSubmitingSend = false;
    //         },
    //       });
    //   }
    // });
  }

  validate(): void {
    this.isSubmitingValidation = true;
    const dataPayload: IValidationPayload = {
      apartado: 'VALIDACION-CORTO-PLAZO',
      id: this.selectedProducto.idProducto,
      cveUsuario: this.dataUser.cveUsuario,
      revision: this.dataRevisionAppValidate.concat(this.dataRevision),
      estatus: 'V',
      rubrica: this.listRubrics,
    };
    this.validadorService
      .guardar(dataPayload, 'cp')
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmitingValidation = false;
          this.router.navigate([
            '/Planeación/Planeación a Corto Plazo/Revisión y Validación',
          ]);
          this._alertService.showAlert('Validación Técnica Confirmada');
        },
        error: (err) => {
          this.isSubmitingValidation = false;
        },
      });
    // this.getProjectByIdProject().then((response) => {
    //   const estatus = response.estatusPresupuesto;
    //   if (estatus === '1' || estatus === '2' || estatus === '3') {
    //     this.isSubmitingValidation = false;
    //     this._alertService.showAlert(
    //       `El Usuario Presupuesto Envió el Proyecto a la ${estatus === '1'
    //         ? '1ra'
    //         : estatus === '2'
    //           ? '2da'
    //           : estatus === '3'
    //             ? '3ra'
    //             : ''
    //       } Revisión, no es Posible Enviar a Validación Técnica.`
    //     );
    //     const tmpProject = response;
    //     const dataStorage = {
    //       name: 'view',
    //       value: tmpProject,
    //     };
    //     this.selectedValidateProyectoPAA = tmpProject;
    //     this.ls.set('selectedValidateProyectoPAA', dataStorage);
    //     this.validateStatus();
    //   } else {
    //     const dataPayload: IValidationPayload = {
    //       apartado: 'VALIDACION-CORTO-PLAZO',
    //       id: this.selectedProducto.idProducto,
    //       cveUsuario: this.dataUser.cveUsuario,
    //       revision: this.dataRevisionAppValidate.concat(this.dataRevision),
    //       estatus: 'V',
    //       rubrica: this.listRubrics,
    //     };
    //     this.validadorService
    //       .guardar(dataPayload, 'cp')
    //       .pipe(takeUntil(this.notifier))
    //       .subscribe({
    //         next: (value) => {
    //           this.isSubmitingValidation = false;
    //           this.router.navigate([
    //             '/Planeación/Planeación a Corto Plazo/Revisión y Validación',
    //           ]);
    //           this._alertService.showAlert('Validación Técnica Confirmada');
    //         },
    //         error: (err) => {
    //           this.isSubmitingValidation = false;
    //         },
    //       });
    //   }
    // });
  }

  openRubric(): void {
    this.save(true);
    let docAnalitico: any = undefined;
    if (this.selectedValidateProyectoPAA.archivos?.length > 0) {
      docAnalitico = this.selectedValidateProyectoPAA.archivos[0];
    }
    const dataRubric: IRubricaComponent = {
      listRubrics: this.listRubrics,
      docAnalitico,
      totalRubric: this.totalRubric,
      selectedActividad: this.selectedActividad.idActividad,
      selectedProducto: this.selectedProducto.idProducto,
    };
    this.ls.set('selectedRubric', dataRubric);
    this.redirectToRubric = true;
    this.router.navigateByUrl(
      '/Planeación/Planeación a Corto Plazo/Revisión y Validación/Revisión Planeación/Rúbrica'
    );
  }

  get getValidateFields(): QuestionBase<any>[] {
    const questions: QuestionBase<any>[] = this.questions.slice(0, 9);
    questions.push(
      // new TextboxQuestion({
      //   nane: 'Calendarización del Gasto',
      //   label: 'Calendarización del Gasto',
      //   value: '',
      //   onlyLabel: true,
      //   validators: [Validators.required, Validators.maxLength(200)],
      // }),
      // new TextboxQuestion({
      //   idElement: 136,
      //   nane: 'Acciones',
      //   label:
      //     'Acciones',
      //   value: '',
      //   validators: [Validators.required, Validators.maxLength(200)],
      // }),
      new TextboxQuestion({
        idElement: 137,
        nane: 'Calendarización del Gasto',
        label: 'Calendarización del Gasto',
        value: '',
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );
    return questions;
  }

  ngOnDestroy(): void {
    document.querySelector('.can-validate')?.classList.remove('validate');
    document.querySelector('footer')?.classList.remove('validate');
    if (!this.redirectToRubric) {
      this.ls.remove('selectedValidateProyectoPAA');
      this.ls.remove('selectedRubric');
    }
  }
}
