import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
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
  IAccionFollowPayload,
  IItmeAccionFollowResponse,
} from '@common/interfaces/seguimiento/actions.interface';

import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';

import { mapOptionProducts } from '@common/mapper/data-options.mapper';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { ActionsFollowService } from '@common/services/seguimiento/actions.service';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import {
  getCveProyecto,
  getIdAdecuancionSolicitud,
  getNumeroAccion,
  getNumeroActividad,
  getNumeroNivelEducativo,
} from '@common/utils/Utils';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { TIPO_APARTADO } from '../enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  @Input() canSelectOne: boolean = false;

  @Input() catCategoriaR!: ICatalogResponse;
  @Input() catNivelEducativoR!: ICatalogResponse;
  @Input() catTipoProductoR!: ICatalogResponse;

  data: any[] = [];
  loading = true;
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
    { columnDef: 'csEstatus', header: 'Estatus', width: '110px' },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
  };

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  private _body = document.querySelector('body');

  dataPP: any[] = [];
  validation = false;
  editable = true;

  dataUser: IDatosUsuario;
  yearNav: string = '';
  selectedSolicitud: any;
  whatModuleStart!: string;

  dataProjects: IItemConsultarPRoyectosResponse[] = [];
  dataActivities: IItemActivitiesResponse[] = [];
  dataProducts: IItemProductResponse[] = [];

  projectSelected: IItemConsultarPRoyectosResponse | null = null;
  activitySelected: any = null;
  dataSelectedProduct: IItemProductResponse | undefined = undefined;
  nivelEducativoProducto: ICatalogResponse | undefined;

  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];

  isCleanForm: boolean = false;
  updateForm: boolean = false;

  claveAccion: number = 0;
  dataSelected: IItmeAccionFollowResponse | null = null;
  isView: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private projectsFollowService: ProjectsService,
    private activitiesFollowService: ActivitiesFollowService,
    private productsFollowService: ProductsService,
    private actionsFollowService: ActionsFollowService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
    this.whatModuleStart = this.ls.get('whatModuleStart');

    this._body?.classList.add('hideW');
  }

  ngOnInit(): void {
    this.setCatalogsInput();
    this.buildForm(); //COMMENT: Dejar el build aqui para cargar la modificacion
    this.suscribreForm();
    this.getAll();
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

    if (!this.canSelectOne) {
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
    this.editable = true;
    this.validation = false;
  }

  private suscribreForm() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          if (value) {
            this.getActivities(value);
            const findedProject = this.dataProjects.filter(
              (item) => item.idProyecto === value
            );
            if (findedProject?.length > 0) {
              this.projectSelected = findedProject[0];
            }
            this.form
              .get('claveUnidad')
              ?.setValue(this.projectSelected?.claveUnidad);

            this.form.get('nombreProducto')?.disable();
            this.form.get('nombreProducto')?.setValue('');
            this.form.get('claveNivelEducativo')?.setValue('');
            this.form.get('claveAccion')?.setValue('');
          }
        }
      });

    this.form
      .get('nombreActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (!this.dataSelected) {
          this.form.get('claveNivelEducativo')?.setValue('');
          this.form.get('claveAccion')?.setValue('');
          if (value) {
            this.form.get('nombreProducto')?.setValue('');
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
            this.getActionByIdProduct(value);
            if (!this.isView) {
              this.getSecuenciaAccionByProducto(value);
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
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
      const dataActiontCreate: IAccionFollowPayload = {
        idProducto: nombreProducto,
        claveAccion: parseInt(claveAccion),
        nombre: nombreAccion,
        idAdecuacionSolicitud: getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.acciones,
          tipoModificacion: MODIFICATION_TYPE.alta,
        }),
        cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
        csEstatus: this.form.valid ? 'C' : 'I',
        idAccionReferencia: null,
      };

      this.actionsFollowService
        .createAction(dataActiontCreate)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200') {
              this.getActionByIdProduct(nombreProducto);
              this.newAccion();
              this._alertService.showAlert('Se Guardó Correctamente');
              this.claveAccion = 0;
              this.getAll();
            }
          },
        });
    }
  }

  async updateAction() {
    const formBody = this.form.getRawValue();
    const { nombreAccion, nombreProducto, claveAccion } = formBody;
    if (!nombreAccion) {
      this._alertService.showAlert(
        'Es necesario registrar el nombre de la acción'
      );
    } else {
      const dataActionUpdate: IAccionFollowPayload = {
        idProducto: nombreProducto,
        claveAccion: claveAccion,
        nombre: nombreAccion,
        cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
        csEstatus: this.form.valid ? 'C' : 'I',
        idAdecuacionSolicitud: getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.acciones,
          tipoModificacion: MODIFICATION_TYPE.alta,
        }),
        idAccionReferencia: null,
      };
      this.actionsFollowService
        .updateAction(this.dataSelected?.idAccion, dataActionUpdate)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200') {
              this.getActionByIdProduct(formBody.nombreProducto);
              this.newAccion();
              this._alertService.showAlert('Se Modificó Correctamente');
              this.claveAccion = 0;
            }
          },
        });
    }
  }

  async getAll(): Promise<void> {
    this.loading = true;
    if (
      this.whatModuleStart === 'proyects' ||
      this.whatModuleStart === 'activities' ||
      this.whatModuleStart === 'products' ||
      this.whatModuleStart === 'actions'
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
          this.questions[0].options = this.dataProjects.map((item) => {
            return {
              id: item.idProyecto,
              value: item.nombre,
            };
          });
        } else if (this.whatModuleStart === 'actions') {
          this.getProjects({
            excluirCortoPlazo: false,
            priorizarProyectoAsociado: false,
            idSolicitud: 0,
          });
        }
      });
  }

  async getActivities(idProject: number) {
    this.form.controls['nombreActividad']?.disable();
    this.form.controls['nombreProducto']?.disable();
    this.questions[1].options = [];
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
          this.questions[1].options = tmpData;
          this.form.controls['nombreActividad']?.enable();
        }
      });
  }

  async getProductsByIdActivity(idActivity: string) {
    this.form.controls['nombreProducto']?.disable();
    this.questions[2].options = [];
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
            this.form.controls['nombreProducto']?.enable();
            this.questions[2].options = mapOptionProducts(this.dataProducts);
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

  async getActionByIdProduct(idProduct: number) {
    this.data = [];
    let excluirCortoPlazo: boolean = false,
      idSolicitud: number = 0;
    if (
      this.whatModuleStart === 'proyects' ||
      this.whatModuleStart === 'activities' ||
      this.whatModuleStart === 'products' ||
      this.whatModuleStart === 'actions'
    ) {
      excluirCortoPlazo = true;
      idSolicitud = this.selectedSolicitud.idSolicitud ?? 0;
    }
    this.actionsFollowService
      .getActions(idProduct, excluirCortoPlazo, idSolicitud)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            const tmpData: any[] = [];
            for (const item of value.respuesta) {
              let product = this.dataProducts.find(
                (producto) => producto.idProducto === item.idProducto
              );
              if (!this.projectSelected) {
                return;
              }
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
                nombreAccion: item.nombre,
                csEstatus: this.getStatus(item.csEstatus),
              });
              //}
            }
            this.data = tmpData;
            this.tableActions(true);
          } else {
            this.data = [];
            this.tableActions(false);
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItmeAccionFollowResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        this.isCleanForm = true;
        this.updateForm = false;
        this.isView = true;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
        }, 100);
        this.form.disable();
        break;
      case TableConsts.actionButton.edit:
        this.form.enable();
        this.resetAllForm();
        this.isCleanForm = true;
        this.updateForm = true;
        this.isView = false;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Acción?',
          });
          if (confirm) {
            this.actionsFollowService
              .deleteAccion(dataAction.idAccion)
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.resetAllForm();
                    this.data = [
                      ...this.data.filter(
                        (item) => item.idAccion !== dataAction.idAccion
                      ),
                    ];
                    this.newAccion();
                  }
                },
              });
          }
        }
        break;
    }
  }

  resetAllForm() {
    this.form.reset();
    this.isCleanForm = false;
    this.updateForm = false;
    this.isView = false;
    this.dataSelected = null;
  }

  newAccion() {
    this.form.enable({ emitEvent: false });
    this.resetAllForm();
    this.form.get('nombreActividad')?.disable({ emitEvent: false });
    this.form.get('nombreProducto')?.disable({ emitEvent: false });
    this.form.get('claveNivelEducativo')?.disable({ emitEvent: false });
    this.form.get('claveAccion')?.disable({ emitEvent: false });
    this.form.get('claveUnidad')?.disable({ emitEvent: false });
    this.form.get('nombreAccion')?.disable({ emitEvent: false });
  }

  private tableActions(view: boolean) {
    if (view) {
      this.actions.view = true;
      this.actions.edit = true;
      this.actions.delete = true;
    } else {
      this.actions.view = false;
      this.actions.edit = false;
      this.actions.delete = false;
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

  private uploadDataToForm(dataAction: IItmeAccionFollowResponse) {
    const product = this.dataProducts.find(
      (producto) => producto.idProducto === dataAction.idProducto
    );
    const activity = this.dataActivities.find(
      (activity) => activity.idActividad === product?.idActividad
    );
    const project = this.dataProjects.find(
      (project) => project.idProyecto === activity?.idProyecto
    );

    this.form.get('nombreProyecto')?.setValue(project?.idProyecto);
    this.form.get('nombreActividad')?.setValue(activity?.idActividad);
    this.form.get('nombreProducto')?.setValue(product?.idProducto);

    this.form
      .get('claveNivelEducativo')
      ?.setValue(this.getClaveNivelEducativo(dataAction.idProducto));

    this.form
      .get('claveAccion')
      ?.setValue(getNumeroAccion(dataAction?.claveAccion));
    this.form.get('nombreAccion')?.setValue(dataAction?.nombre);

    this.form
      .get('claveUnidad')
      ?.setValue(dataAction.cveUnidad || this.dataUser.perfilLaboral.cveUnidad);

    this.form.get('claveNivelEducativo')?.disable();
    this.form.get('claveAccion')?.disable();
    this.form.get('claveUnidad')?.disable();
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

  private getStatus(status: string) {
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
}
