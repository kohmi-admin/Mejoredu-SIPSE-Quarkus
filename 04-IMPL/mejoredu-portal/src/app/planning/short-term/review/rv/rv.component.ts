import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { AlertService } from '@common/services/alert.service';
import { SpentTable } from '../../annual-project/form/v2/budgets/classes/spent-table.class';
import { Spent } from '../../annual-project/form/v2/budgets/classes/spent.class';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { ProjectsService } from '@common/services/projects.service';
import { ActivitiesService } from '@common/services/activities.service';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import { ProductsService } from '@common/services/products.service';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import { ValidadorService } from '@common/services/validador.service';
import {
  IRevisionPayload,
  IValidationPayload,
} from '@common/interfaces/validation.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { Router } from '@angular/router';
import {
  getCveAccion,
  getCveProducto,
  getCveProyecto,
  getNumeroActividad,
} from '@common/utils/Utils';
import { IItmeBudgetResponse } from '@common/interfaces/short-term/budget.interface';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { BudgetsService } from '@common/services/budgets.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';

@Component({
  selector: 'app-rv',
  templateUrl: './rv.component.html',
  styleUrls: ['./rv.component.scss', './cp.scss'],
})
export class RvComponent extends SpentTable {
  ls = new SecureLS({ encodingType: 'aes' });
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  notifier = new Subject();
  selectedValidateProyectoPAA: IItemProjectsResponse;
  selectedActividad!: IItemActivitiesResponse;
  selectedProducto!: IItemProductResponse;
  listActivities: IItemActivitiesResponse[] = [];
  listProducts: IItemProductResponse[] = [];
  listBudgets: IItmeBudgetResponse[] = [];
  dataUser: IDatosUsuario;
  isSubmitingSave: boolean = false;
  isSubmitingSend: boolean = false;
  isSubmitingValidation: boolean = false;
  showAppValidate: boolean = false;
  existRevisionSave: boolean = false;
  enableSend: boolean = true;
  enableValidation: boolean = true;
  catPartidasPresupuestales: IItemCatalogoResponse[] = [];
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];
  dataRevision: IRevisionPayload[] = [
    {
      idElemento: 78,
      check: 1,
      comentarios: null,
    },
  ];
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
    private router: Router,
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private validadorService: ValidadorService,
    private projectsService: ProjectsService,
    private activitiesService: ActivitiesService,
    private productsService: ProductsService,
    private catalogService: CatalogsService,
    private budgetsService: BudgetsService
  ) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.selectedValidateProyectoPAA = this.ls.get(
      'selectedValidateProyectoPAA'
    ).value;
    this.buildForm();
    if (this.selectedValidateProyectoPAA) {
      this.getCatalogs();
      this.validateStatus();
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
    const estatusPlaneacion =
      this.selectedValidateProyectoPAA.estatusPlaneacion;
    if (estatusPlaneacion) {
      if (estatusPlaneacion === 'V') {
        this.enableValidation = true;
      }
      if (
        estatusPlaneacion === '1' ||
        estatusPlaneacion === '2' ||
        estatusPlaneacion === '3'
      ) {
        this.enableSend = true;
      }
      if (estatusPlaneacion === 'E' || estatusPlaneacion === 'P') {
        this.enableSend = true;
        this.enableValidation = true;
      }
    } else {
      this.enableSend = true;
      this.enableValidation = true;
    }
  }

  ngOnInit() {
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
          this.table = [];
          this.questions[5].options = [];
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
      .get('observations')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value !== undefined && value !== null) {
          this.dataRevision[0].check = value === '' ? 1 : 0;
          this.dataRevision[0].comentarios = value === '' ? null : value;
        }
      });
  }

  buildForm(): void {
    this.questions = [
      new TextboxQuestion({
        nane: 'project',
        label: 'Proyecto',
        readonly: true,
        value: '',
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'activities',
        label: 'Actividades',
        disabled: true,
        filter: true,
        options: [],
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'products',
        label: 'Productos',
        disabled: true,
        filter: true,
        options: [],
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        nane: 'potic',
        label: 'POTIC',
        readonly: true,
        value: '',
        validators: [Validators.maxLength(200)],
      }),

      new DropdownQuestion({
        nane: 'agend',
        label: 'Agenda de Autoridad',
        disabled: true,
        options: [],
      }),

      new DropdownQuestion({
        nane: 'kayName',
        label: 'Clave y Nombre de la Acción',
        filter: true,
        options: [],
      }),

      new TextareaQuestion({
        nane: 'observationsPlan',
        label: 'Observaciones Planeación',
        value: '',
        readonly: true,
      }),

      new TextareaQuestion({
        nane: 'observations',
        label: 'Observaciones Presupuesto',
        value: '',
        validators: [Validators.required, Validators.maxLength(200)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['alcance']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['catalogoPartidasPresupuestales']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['categoria']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoProducto']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(
        ([
          dataAlcance,
          dataCatalogoPartidasPresupuestales,
          dataCategoria,
          dataTipoProducto,
        ]) => {
          this.questions[4].options = mapCatalogData({
            data: dataAlcance,
          });
          this.catPartidasPresupuestales =
            dataCatalogoPartidasPresupuestales.catalogo;
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
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
            this.questions[5].options = this.listBudgets.map((item) => {
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
              const findedComentPre = value.respuesta.revision.filter(
                (item) => item.idElemento === 78
              );
              if (findedComentPre?.length > 0) {
                const tmpRev78 = findedComentPre[0];
                this.form
                  .get('observations')
                  ?.setValue(tmpRev78.check === 1 ? '' : tmpRev78.comentarios);
              }
              const findedComentPla = value.respuesta.revision.filter(
                (item) => item.idElemento === 79
              );
              if (findedComentPla?.length > 0) {
                const tmpRev79 = findedComentPla[0];
                this.form
                  .get('observationsPlan')
                  ?.setValue(tmpRev79.check === 1 ? '' : tmpRev79.comentarios);
              }
            }
          }
        },
        error: (err) => { },
      });
  }

  save(): void {
    this.isSubmitingSave = true;
    const dataPayload: IValidationPayload = {
      apartado: 'VALIDACION-CORTO-PLAZO',
      id: this.selectedProducto.idProducto,
      cveUsuario: this.dataUser.cveUsuario,
      revision: this.dataRevision,
      estatus: 'E',
    };
    this.validadorService
      .guardar(dataPayload, 'cp')
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
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
              this.isSubmitingSave = false;
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
    const dataPayload: IValidationPayload = {
      apartado: 'VALIDACION-CORTO-PLAZO',
      id: this.selectedProducto.idProducto,
      cveUsuario: this.dataUser.cveUsuario,
      revision: this.dataRevision,
      estatus: 'R',
    };
    this.validadorService
      .guardar(dataPayload, 'cp')
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmitingSend = false;
          if (value.mensaje.codigo === '200') {
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
  }

  validate(): void {
    this.isSubmitingValidation = true;
    const dataPayload: IValidationPayload = {
      apartado: 'VALIDACION-CORTO-PLAZO',
      id: this.selectedProducto.idProducto,
      cveUsuario: this.dataUser.cveUsuario,
      revision: this.dataRevision,
      estatus: 'V',
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
  }

  ngOnDestroy(): void {
    this.notifier.complete();
    this.ls.remove('selectedValidateProyectoPAA');
  }
}
