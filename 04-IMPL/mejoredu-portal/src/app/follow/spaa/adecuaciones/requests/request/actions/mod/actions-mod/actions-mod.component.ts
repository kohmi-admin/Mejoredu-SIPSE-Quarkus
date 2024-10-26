import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import {
  IItmeAccionFollowResponse,
  IAccionFollowPayload,
  IItemGetAcccionModByIdAdecuacionResponse,
} from '@common/interfaces/seguimiento/actions.interface';
import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import { mapOptionProducts } from '@common/mapper/data-options.mapper';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { AlertService } from '@common/services/alert.service';
import { ActionsFollowService } from '@common/services/seguimiento/actions.service';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import {
  getIdAdecuancionSolicitud,
  getCveProyecto,
  getNumeroAccion,
  getNumeroNivelEducativo,
  getNumeroActividad,
  getCveProducto,
  getGlobalStatus,
} from '@common/utils/Utils';
import { Subject, takeUntil, Observable } from 'rxjs';
import SecureLS from 'secure-ls';
import { MODIFICATION_TYPE } from '../../../enum/modification.enum';
import { TIPO_APARTADO } from '../../../enum/tipoApartado.enum';
import { TableColumn } from '@common/models/tableColumn';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { IItemConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';

interface IData extends IItemGetAcccionModByIdAdecuacionResponse {
  claveProyecto: string;
  claveActividad: string;
  claveProducto: string;
  nombreAccion: string;
  proyecto: IItemConsultarPRoyectosResponse;
  actividad: IItemActivitiesResponse;
  producto: IItemProductResponse;
  fullStatus: string;
}

interface ISendData {
  from: 'left' | 'right';
  viewType: 'view' | 'edit';
  isNew: boolean;
  actionSelected: IItmeAccionFollowResponse;
  actionModificacion?: IItmeAccionFollowResponse;
  activitySelected: IItemActivitiesResponse;
  productSelected: IItemProductResponse;
  projectSelected: IItemConsultarPRoyectosResponse;
}

interface IEvents {
  from: 'left' | 'right';
  event: string;
}

@Component({
  selector: 'app-actions-mod',
  templateUrl: './actions-mod.component.html',
  styleUrls: ['./actions-mod.component.scss'],
})
export class ActionsModComponent {
  ls = new SecureLS({ encodingType: 'aes' });

  @Output() setRecord: EventEmitter<ISendData> = new EventEmitter<any>();
  @Output() setEvents: EventEmitter<IEvents> = new EventEmitter<any>();

  @Input() position!: 'left' | 'right';
  @Input() receivedRecord: any;
  @Input() receivedEvents: any;
  @Input() catCategoriaR!: ICatalogResponse;
  @Input() catNivelEducativoR!: ICatalogResponse;
  @Input() catTipoProductoR!: ICatalogResponse;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  private _body = document.querySelector('body');

  dataUser: IDatosUsuario;
  yearNav: string = '';
  dataProjects: IItemConsultarPRoyectosResponse[] = [];
  dataActivities: IItemActivitiesResponse[] = [];
  dataProducts: IItemProductResponse[] = [];
  dataActions: IItmeAccionFollowResponse[] = [];
  projectSelected: IItemConsultarPRoyectosResponse | null = null;
  activitySelected: any = null;
  productSelected: any = null;
  actionSelected: any = null;
  nivelEducativoProducto: ICatalogResponse | undefined;
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];
  updateForm: boolean = false;
  formLeftComplete: boolean = false;
  data: IData[] = [];
  dataSelectedMod!: ISendData;
  isSeletedFromTable: boolean = false;
  canEdit: boolean = true;
  selectedSolicitud: IItemConsultaSolicitudResponse;
  actions: TableActionsI = {
    delete: true,
    view: true,
    edit: true,
  };
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
    { columnDef: 'fullStatus', header: 'Estatus Modificación', width: '150px' },
  ];

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private projectsFollowService: ProjectsService,
    private activitiesFollowService: ActivitiesFollowService,
    private productsFollowService: ProductsService,
    private actionsFollowService: ActionsFollowService
  ) {
    this.canEdit = this.ls.get('canEdit');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
    this.canEdit = this.selectedSolicitud.estatusId !== 2237;
    if (!this.canEdit) {
      this.actions.delete = false;
      this.actions.edit = false;
    }
    this._body?.classList.add('hideW');
  }

  ngOnInit(): void {
    this.setCatalogsInput();
    this.buildForm();
    if (this.position === 'right') {
      this.form.get('nombreProyecto')?.disable({ emitEvent: false });
    } else {
      this.getAll();
      this.suscribreForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const receivedEvents: IEvents = changes['receivedEvents']?.currentValue;
    const receivedRecord: ISendData = changes['receivedRecord']?.currentValue;
    if (receivedEvents) {
      if (this.position === 'left' && receivedEvents.from === 'right') {
        if (receivedEvents.event === 'saveItem') {
          this.getAcccionModiByIdAdecuacionSolicitud();
        }
      }

      if (this.position === 'right' && receivedEvents.from === 'left') {
        if (receivedEvents.event === 'cleanForm') {
          this.resetAllForm();
          this.formLeftComplete = false;
        }
      }
    }

    if (receivedRecord) {
      if (this.position === 'right' && receivedRecord.from === 'left') {
        const receivedRecord = changes['receivedRecord'].currentValue;
        this.updateForm = !receivedRecord.isNew;
        this.processReceivedValue(changes['receivedRecord'].currentValue);
      }
    }
  }

  processReceivedValue(value: ISendData) {
    this.dataSelectedMod = value;
    this.questions[0].options = [
      {
        id: value.projectSelected.idProyecto,
        value: value.projectSelected.nombre,
      },
    ];
    this.form.get('nombreProyecto')?.setValue(value.projectSelected.idProyecto);
    this.form.get('claveUnidad')?.setValue(value.projectSelected?.claveUnidad);
    this.questions[1].options = [
      {
        id: value.activitySelected.idActividad,
        value: value.activitySelected.cxNombreActividad,
      },
    ];
    this.form
      .get('nombreActividad')
      ?.setValue(value.activitySelected.idActividad);
    this.questions[2].options = [
      {
        id: value.productSelected.idProducto,
        value: value.productSelected.nombre,
      },
    ];
    this.form.get('nombreProducto')?.setValue(value.productSelected.idProducto);
    this.form
      .get('claveNivelEducativo')
      ?.setValue(this.getClaveNivelEducativo(value.productSelected.idProducto));

    const actionSelected: IItmeAccionFollowResponse =
      value.actionModificacion ?? value.actionSelected;

    this.form.get('nombreAccion')?.setValue(actionSelected.nombre);
    if (value.viewType === 'view') {
      this.form.get('nombreAccion')?.disable();
    } else {
      this.form.get('nombreAccion')?.enable();
    }
    this.form
      .get('claveAccion')
      ?.setValue(getNumeroAccion(actionSelected.claveAccion));
    this.formLeftComplete = true;
  }

  setCatalogsInput() {
    this.nivelEducativoProducto = this.catNivelEducativoR;
    this.catCategoria = this.catCategoriaR.catalogo;
    this.catTipoProducto = this.catTipoProductoR.catalogo;
  }

  async buildForm(): Promise<void> {
    const questions: any = [];

    questions.push(
      new DropdownQuestion({
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'nombreActividad',
        label: 'Nombre de la Actividad',
        disabled: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'nombreProducto',
        label: 'Nombre del Producto',
        filter: true,
        disabled: true,
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'claveAccion',
        value: '',
        label: 'Clave de la Acción',
        disabled: true,
        validators: [Validators.required],
      })
    );

    if (this.position != 'left') {
      questions.push(
        new TextareaQuestion({
          nane: 'nombreAccion',
          label: 'Nombre de la Acción',
          disabled: true,
          rows: 1,
          validators: [Validators.required, Validators.maxLength(250)],
        })
      );
    } else {
      questions.push(
        new DropdownQuestion({
          filter: true,
          nane: 'nombreAccion',
          label: 'Nombre de la Acción',
          disabled: true,
          validators: [Validators.required, Validators.maxLength(90)],
        })
      );
    }

    questions.push(
      new TextboxQuestion({
        nane: 'claveNivelEducativo',
        label: 'Clave del Nivel Educativo',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(100)],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'claveUnidad',
        label: 'Clave de Unidad',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(100)],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  private suscribreForm() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe(async (value) => {
        if (value) {
          this.resetToActivities();
          if (!this.isSeletedFromTable) this.onEmitValueEmpty();
          await this.getActivities(value);
          const findedProject = this.dataProjects.filter(
            (item) => item.idProyecto === value
          );
          if (findedProject?.length > 0) {
            this.projectSelected = findedProject[0];
          }
          this.form
            .get('claveUnidad')
            ?.setValue(this.projectSelected?.claveUnidad);
        }
      });

    this.form
      .get('nombreActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe(async (value) => {
        if (value) {
          this.resetToProduct();
          const findedActivity = this.dataActivities.filter(
            (item) => item.idActividad === value
          );
          if (findedActivity?.length > 0) {
            this.activitySelected = findedActivity[0];
          }
          await this.getProductsByIdActivity(value);
          if (!this.isSeletedFromTable) this.onEmitValueEmpty();
        }
      });

    this.form
      .get('nombreProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe(async (value) => {
        if (value) {
          this.resetToAction();
          const findedProduct = this.dataProducts.filter(
            (item) => item.idProducto === value
          );
          if (findedProduct?.length > 0) {
            this.productSelected = findedProduct[0];
          }
          this.form
            .get('claveNivelEducativo')
            ?.setValue(this.getClaveNivelEducativo(parseInt(value)));
          await this.getActionByIdProduct(value);
          if (!this.isSeletedFromTable) this.onEmitValueEmpty();
          this.isSeletedFromTable = false;
        }
      });

    this.form
      .get('nombreAccion')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          const findedAction = this.dataActions.filter(
            (item) => item.idAccion === value
          );
          if (findedAction?.length > 0) {
            this.actionSelected = findedAction[0];
          }
          this.form
            .get('claveAccion')
            ?.setValue(getNumeroAccion(findedAction[0].claveAccion));
          const findedMod = this.data.find(
            (itemFilter) => itemFilter.accionReferencia.idAccion === value
          );
          this.onEmitValue({
            isNew: !findedMod,
            viewType: 'edit',
            actionSelected: findedMod?.accionReferencia,
            actionModificacion: findedMod?.accionModificacion,
            activitySelected: findedMod?.actividad,
            productSelected: findedMod?.producto,
            projectSelected: findedMod?.proyecto,
          });
        }
      });
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  submit() {
    const { nombreAccion, nombreProducto, claveAccion } =
      this.form.getRawValue();
    if (!nombreAccion || nombreAccion === '') {
      this._alertService.showAlert(
        'Es Necesario Registrar el Nombre de la Acción'
      );
    } else {
      if (this.updateForm) {
        const dataActionUpdate: IAccionFollowPayload = {
          idProducto: nombreProducto,
          claveAccion: claveAccion,
          nombre: nombreAccion,
          cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
          csEstatus: this.form.valid ? 'C' : 'I',
          idAdecuacionSolicitud: getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.acciones,
            tipoModificacion: MODIFICATION_TYPE.modificacion,
          }),
          idAccionReferencia: this.dataSelectedMod.actionSelected.idAccion,
        };
        this.actionsFollowService
          .updateAction(
            this.dataSelectedMod.actionModificacion?.idAccion,
            dataActionUpdate
          )
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.mensaje.codigo === '200') {
                this._alertService.showAlert('Se Modificó Correctamente');
                this.onEmitEvents('saveItem');
              }
            },
          });
      } else {
        const dataActiontCreate: IAccionFollowPayload = {
          idProducto: nombreProducto,
          claveAccion: parseInt(claveAccion),
          nombre: nombreAccion,
          idAdecuacionSolicitud: getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.acciones,
            tipoModificacion: MODIFICATION_TYPE.modificacion,
          }),
          cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
          csEstatus: this.form.valid ? 'C' : 'I',
          idAccionReferencia: this.dataSelectedMod.actionSelected.idAccion,
        };

        this.actionsFollowService
          .createAction(dataActiontCreate)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.codigo === '200') {
                this.actionsFollowService
                  .getActionById(value.respuesta.idAccion)
                  .subscribe({
                    next: (valueById) => {
                      if (value.codigo === '200') {
                        this.dataSelectedMod.actionModificacion =
                          valueById.respuesta;
                      }
                      this.updateForm = true;
                      this._alertService.showAlert('Se Guardó Correctamente');
                      this.onEmitEvents('saveItem');
                    },
                  });
              }
            },
          });
      }
    }
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IData = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.form.disable({ emitEvent: false });
        this.selectedActionMod(dataAction, 'view');
        break;
      case TableConsts.actionButton.edit:
        this.form.disable({ emitEvent: false });
        this.selectedActionMod(dataAction, 'edit');
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Cancelación Seleccionada?',
          });
          if (confirm) {
            this.actionsFollowService
              .deleteAdecuacion({
                idReferencia: dataAction.idAccionReferencia,
                idAdecuacionSolicitud: getIdAdecuancionSolicitud({
                  tipoApartado: TIPO_APARTADO.acciones,
                  tipoModificacion: MODIFICATION_TYPE.modificacion,
                }),
              })
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getAll();
                    this.resetAllForm();
                    this.onEmitEvents('cleanForm');
                  }
                },
              });
          }
        }
        break;
    }
  }

  selectedActionMod(data: IData, viewType: 'view' | 'edit') {
    this.isSeletedFromTable = true;
    const projectSelected = data.proyecto;
    const activitySelected = data.actividad;
    const productSelected = data.producto;
    const actionSelected = data.accionReferencia;

    this.form
      .get('nombreProyecto')
      ?.setValue(projectSelected.idProyecto, { emitEvent: true });
    this.form.get('nombreProyecto')?.enable({ emitEvent: false });
    this.form
      .get('claveUnidad')
      ?.setValue(projectSelected.claveUnidad, { emitEvent: false });
    this.form
      .get('nombreActividad')
      ?.setValue(activitySelected.idActividad, { emitEvent: true });
    this.form
      .get('nombreProducto')
      ?.setValue(productSelected.idProducto, { emitEvent: true });
    this.form
      .get('claveNivelEducativo')
      ?.setValue(this.getClaveNivelEducativo(productSelected.idProducto), {
        emitEvent: false,
      });
    this.form
      .get('nombreAccion')
      ?.setValue(actionSelected.idAccion, { emitEvent: false });
    this.form
      .get('claveAccion')
      ?.setValue(getNumeroAccion(actionSelected.claveAccion), {
        emitEvent: false,
      });
    this.onEmitValue({
      viewType,
      isNew: false,
      actionModificacion: data.accionModificacion,
      actionSelected,
      activitySelected,
      productSelected,
      projectSelected,
    });
  }

  async getAll(): Promise<void> {
    await this.getProjects();
    this.getAcccionModiByIdAdecuacionSolicitud();
  }

  getAcccionModiByIdAdecuacionSolicitud() {
    this.actionsFollowService
      .getAcccionModiByIdAdecuacionSolicitud(
        getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.acciones,
          tipoModificacion: MODIFICATION_TYPE.modificacion,
        })
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: async (value) => {
          if (value.respuesta.length > 0) {
            let tmpData: IData[] = [];

            for (const item of value.respuesta) {
              let accionReferencia = item.accionReferencia;

              const productSelected = await this.getProductByIdPromise(
                accionReferencia.idProducto
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
                  claveProyecto: getCveProyecto({
                    cveUnidad: projectSelected.claveUnidad,
                    cveProyecto: +projectSelected.clave,
                  }),
                  claveActividad: getNumeroActividad(
                    this.dataActivities.filter(
                      (x) => x.idActividad === productSelected.idActividad
                    )?.[0]?.cveActividad ?? 0
                  ),
                  claveProducto: getCveProducto({
                    catCategoria: this.catCategoria,
                    catTipoProducto: this.catTipoProducto,
                    projectSelected,
                    activitySelected,
                    productSelected: productSelected,
                  }),
                  nombreAccion: accionReferencia.nombre,
                  proyecto: projectSelected,
                  actividad: activitySelected,
                  producto: productSelected,
                  fullStatus: getGlobalStatus(
                    item.accionModificacion.csEstatus
                  ),
                });
              }
            }
            this.data = tmpData;
          } else {
            this.data = [];
          }
        },
      });
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
              this.questions[0].options = this.dataProjects.map((item) => {
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

  async getActivities(idProject: number, disable?: boolean) {
    return new Promise<void>((resolve, reject) => {
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
              this.questions[1].options = tmpData;
              resolve();
            }
          },
          error: (error) => {
            reject(new Error(error));
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

  async getProductsByIdActivity(idActivity: string) {
    return new Promise<void>((resolve, reject) => {
      this.questions[2].options = [];
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
              this.questions[2].options = mapOptionProducts(this.dataProducts);
              resolve();
            }
          },
          error: (error) => {
            reject(new Error(error));
          },
        });
    });
  }

  async getActionByIdProduct(idProduct: number) {
    return new Promise<void>((resolve, reject) => {
      let excluirCortoPlazo: boolean = false,
        idSolicitud: number = 0;
      this.actionsFollowService
        .getActions(idProduct, excluirCortoPlazo, idSolicitud)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta?.length > 0) {
              let actionsTemp: any[] = [];
              for (const item of value.respuesta) {
                actionsTemp.push({
                  id: item.idAccion,
                  value: item.nombre,
                });
              }
              this.dataActions = value.respuesta;
              this.form.get('nombreAccion')?.enable({ emitEvent: false });
              this.questions[4].options = actionsTemp;
              resolve();
            }
          },
          error: (error) => {
            reject(new Error(error));
          },
        });
    });
  }

  onEmitValue({
    viewType,
    isNew,
    actionSelected,
    actionModificacion,
    activitySelected,
    productSelected,
    projectSelected,
  }: {
    viewType: 'view' | 'edit';
    isNew: boolean;
    projectSelected?: any;
    activitySelected?: any;
    productSelected?: any;
    actionSelected?: any;
    actionModificacion?: any;
  }): void {
    const valueToEmit: ISendData = {
      from: this.position,
      projectSelected: projectSelected ?? this.projectSelected,
      activitySelected: activitySelected ?? this.activitySelected,
      productSelected: productSelected ?? this.productSelected,
      actionSelected: actionSelected ?? this.actionSelected,
      actionModificacion,
      viewType: this.canEdit ? viewType : 'view',
      isNew,
    };
    this.setRecord.emit(valueToEmit);
  }

  onEmitValueEmpty() {
    this.setEvents.emit({
      from: this.position,
      event: 'cleanForm',
    });
  }

  onEmitEvents(event: string) {
    const valueToEmit: IEvents = {
      from: this.position,
      event,
    };
    this.setEvents.emit(valueToEmit);
  }

  resetAllForm() {
    this.form.reset({ emitEvent: false });
    this.updateForm = false;
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
    this.form.get('nombreActividad')?.disable({ emitEvent: false });
    this.form.get('nombreProducto')?.disable({ emitEvent: false });
    this.form.get('nombreAccion')?.disable({ emitEvent: false });

    this.form.get('nombreActividad')?.setValue('');
    this.form.get('numeroProducto')?.setValue('');
    this.form.get('nombreProducto')?.setValue('');

    this.form.get('claveAccion')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.form.get('nombreAccion')?.setValue('');
    this.form.get('claveUnidad')?.setValue('');
  }

  private resetToProduct() {
    this.form.get('nombreProducto')?.disable({ emitEvent: false });
    this.form.get('nombreAccion')?.disable({ emitEvent: false });

    this.form.get('numeroProducto')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.form.get('nombreProducto')?.setValue('');

    this.form.get('claveAccion')?.setValue('');
    this.form.get('nombreAccion')?.setValue('');
    this.form.get('claveUnidad')?.setValue('');
  }

  private resetToAction() {
    this.form.get('nombreAccion')?.disable({ emitEvent: false });

    this.form.get('claveAccion')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.form.get('nombreAccion')?.setValue('');
    this.form.get('claveUnidad')?.setValue('');
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }
}
