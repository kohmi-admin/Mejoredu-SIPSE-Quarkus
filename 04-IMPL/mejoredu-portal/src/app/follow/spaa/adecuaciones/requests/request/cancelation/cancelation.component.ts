import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { Subject, forkJoin, take, takeUntil } from 'rxjs';
import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import { mapOptionActions, mapOptionProducts, mapOptionProjects } from '@common/mapper/data-options.mapper';
import { IItemActivitiesResponse } from '@common/interfaces/activities.interface';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import { ActionsFollowService } from '@common/services/seguimiento/actions.service';
import { getCveProyecto, getIdAdecuancionSolicitud, getNumeroAccion, getNumeroActividad, getNumeroNivelEducativo, getNumeroProducto } from '@common/utils/Utils';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { AlertService } from '@common/services/alert.service';
import { TIPO_APARTADO } from '../enum/tipoApartado.enum';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import { ICatalogResponse, IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { IItmeAccionFollowResponse } from '@common/interfaces/seguimiento/actions.interface';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableActionsI, TableConsts } from '@common/mat-custom-table/consts/table';
import { TableColumn } from '@common/models/tableColumn';

@Component({
  selector: 'app-cancelation',
  templateUrl: './cancelation.component.html',
  styleUrls: ['./cancelation.component.scss']
})
export class CancelationComponent implements OnInit {
  ls = new SecureLS({ encodingType: 'aes' });
  form!: FormGroup;
  @Input() questions: QuestionBase<any>[] = [];
  @Input() modificationType: string = '';

  notifier = new Subject();

  dataUser: IDatosUsuario;
  yearNav: string = '';
  selectedSolicitud: any;
  isButtonDisabled: boolean = false;
  emmitEvent: boolean = true;

  dataProjects: IItemConsultarPRoyectosResponse[] = [];
  dataActivities: IItemActivitiesResponse[] = [];
  dataProducts: IItemProductResponse[] = [];
  dataAccions: IItmeAccionFollowResponse[] = [];

  projectSelected: IItemConsultarPRoyectosResponse | null = null;
  activitySelected: any = null;

  nivelEducativoProducto: ICatalogResponse | undefined;
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];

  viewTableCancelation: boolean = false;
  titleSection: string = "";
  actions: TableActionsI = {
    delete: true,
    view: true,
  };
  customBtn: string = '';
  columns: TableColumn[] = [];
  data: any [] = [];

  constructor(
    private _fromBuilder: QuestionControlService,
    private _alertService: AlertService,

    private catalogService: CatalogsService,

    private projectsFollowService: ProjectsService,
    private activitiesFollowService: ActivitiesFollowService,
    private productsFollowService: ProductsService,
    private actionsFollowService: ActionsFollowService,
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
  }

  async getAll(): Promise<void> {
    this.getCatalogs();
  }

  async getCatalogs() {
    forkJoin([
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
          dataNivelEducativo,
          dataCategoria,
          dataTipoProducto,
        ]) => {
          this.nivelEducativoProducto = dataNivelEducativo;
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
        }
      );
  }

  ngOnInit(): void {
    this.form = this._fromBuilder.toFormGroup(this.questions);
    this.validateCancelationInit();
    this.suscribeForm();
    this.clearForm();
    this.getAll();
  }

  suscribeForm() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          const projectSelected = this.dataProjects.find(
            (proyecto: IItemConsultarPRoyectosResponse) => proyecto.idProyecto === value
          );
          if (!projectSelected) {
            return;
          }
          this.projectSelected = projectSelected;
          this.form.get('claveProyecto')?.setValue(getCveProyecto({ cveUnidad: this.dataUser.perfilLaboral.cveUnidad, cveProyecto: +projectSelected?.clave }));
          if(this.emmitEvent && (this.modificationType === 'activity' || this.modificationType === 'product' || this.modificationType === 'actions')){
            this.getActivities(value);
          }
        }
      });

    this.form
      .get('nombreActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          const activitySelected = this.dataActivities.find(
            (activity: IItemActivitiesResponse) => activity.idActividad === value
          );
          if (!activitySelected) {
            return;
          }
          this.activitySelected = activitySelected;
          if (this.modificationType === 'activity') {
            this.form.get('claveActividad')?.setValue(`${this.form.get('claveProyecto')?.value}-${getNumeroActividad(activitySelected.cveActividad)}`);
          }
          if (this.emmitEvent && (this.modificationType === 'product' || this.modificationType === 'actions')) {
            this.getProductsByIdActivity(value);
          }
        }
      });

    this.form
      .get('nombreProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          let product = this.dataProducts.find(
            (producto) => producto.idProducto === value
          );
          if (!product) {
            this.form.get('nombreProducto')?.disable({emitEvent: false})
            return;
          }
          this.form.get('numeroProducto')?.setValue(getNumeroProducto(+product?.cveProducto));
          this.form.get('claveProducto')?.setValue(
            this.setClaveProducto({
              projectSelected: this.projectSelected,
              activitySelected: this.activitySelected,
              claveProductoForm: '0000-000-00-0-00',
              numeroProductoForm: product?.cveProducto || '',
              categorizacionProductoForm: product?.idCategorizacion || 0,
              tipoProductoForm: product?.idTipoProducto || 0,
              setClaveProducto: false,
            })
          );
          if (this.emmitEvent && this.modificationType === 'actions') {
            this.form.get('claveNivelEducativo')?.setValue(this.getClaveNivelEducativo(parseInt(value)));
            this.getActionsByIdProduct(value);
          }
        }
      });

    this.form
      .get('nombreAccion')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          let accionSelect = this.dataAccions.find(
            (accion) => accion.idAccion === value
          );
          if (!accionSelect) {
            this.form.get('nombreAccion')?.disable({emitEvent: false})
            return;
          }
          this.form.get('claveAccion')?.setValue(getNumeroAccion(accionSelect?.claveAccion));
          this.form.get('claveUnidad')?.setValue(`${this.dataUser.perfilLaboral.cveUnidad} - ${this.dataUser.perfilLaboral.cdNombreUnidad}`);
        }
      });
  }

  validateCancelationInit(){
    switch (this.modificationType) {
      case 'activity':
        this.getActivitiesCancelation();
        break;
      case 'product':
        this.getProductsCancelation();
          break;
      case 'actions':
        this.getActionsCancelation();
        break;
      default:
        this.getProjectCancelation();
        break;
    }
  }

  async getProjectCancelation() {
    await this.getProjects();
    this.projectsFollowService.getProyectoCancelacion(
      getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.proyecto,
        tipoModificacion: MODIFICATION_TYPE.cancelacion,
      })
    ).pipe(takeUntil(this.notifier)).subscribe({
      next: (value) => {
        if(value.respuesta.length > 0){
          this.chargeInitTable();
          this.data = value.respuesta.map((item => {
            return {
              claveNombreUnidad: `${item.proyectoReferencia.claveUnidad} ${item.proyectoReferencia.nombreUnidad}` ,
              claveProyecto: getCveProyecto({
                cveUnidad: item.proyectoReferencia.claveUnidad,
                cveProyecto: +item.proyectoReferencia.clave,
              }),
              nombre: item.proyectoReferencia.nombre,
              ...item.proyectoReferencia
            }
          }));
        }
      }
    })
  }

  async selectedProjectCancelation(proyectoReferencia: any){
    this.questions[0].options = [{
      id: proyectoReferencia.idProyecto,
      value: proyectoReferencia.nombre,
    }]
    this.emmitEvent = false;
    this.form.get('nombreProyecto')?.setValue(proyectoReferencia.idProyecto);
    this.cancelationSuccess();
    this.emmitEvent = true;
  }

  async deleteProjectCancelation(proyectoReferencia: any){
    this.projectsFollowService.deleteAdecuacion({
      idReferencia: proyectoReferencia.idProyecto,
      idAdecuacionSolicitud: getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.proyecto,
        tipoModificacion: MODIFICATION_TYPE.cancelacion,
      })
    }).pipe(takeUntil(this.notifier))
    .subscribe({
      next: (value) => {
        if(value.mensaje.codigo === '200'){
          this._alertService.showAlert('Se Descarto la Cancelación Correctamente');
          this.data = this.data.filter(item => item.idProyecto !== proyectoReferencia.idProyecto);
        }
      }
    })
  }

  async getActivitiesCancelation(){
    await this.getProjects();
    this.activitiesFollowService.getActivityCancelation(
      getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.actividades,
        tipoModificacion: MODIFICATION_TYPE.cancelacion,
      })
    )
    .pipe(takeUntil(this.notifier))
    .subscribe({
      next: (value) => {
        if(value.respuesta.length > 0){
          this.chargeInitTable();
          this.data = value.respuesta.map((item => {
            return {
              claveProyectos: getCveProyecto({
                cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
                cveProyecto: +this.dataProjects.filter((x)=> x.idProyecto === item.actividadReferencia.idProyecto)[0].clave,
              }),
              claveActividad: getNumeroActividad(item.actividadReferencia.cveActividad),
              nombreActividad: item.actividadReferencia.cxNombreActividad,
              ...item.actividadReferencia
            }
          }));
        }
      }
    })
  }

  async selectedActivityCancelation(actividadReferencia: any){
    this.questions[this.modificationType === 'activity' ? 3 : 1].options = [{
      id: actividadReferencia.idActividad,
      value: actividadReferencia.cxNombreActividad,
    }]
    this.emmitEvent = false;
    this.form.get('nombreProyecto')?.setValue(actividadReferencia.idProyecto);
    this.form.get('nombreActividad')?.setValue(actividadReferencia.idActividad);
    this.form.get('claveActividad')?.setValue(`${this.form.get('claveProyecto')?.value}-${getNumeroActividad(actividadReferencia.cveActividad)}`);
    this.cancelationSuccess();
    this.emmitEvent = true;
  }

  async deleteActivityCancelation(actividadReferencia: any){
    this.activitiesFollowService.deleteAdecuacion({
      idReferencia: actividadReferencia.idActividad,
      idAdecuacionSolicitud: getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.actividades,
        tipoModificacion: MODIFICATION_TYPE.cancelacion,
      })
    }).pipe(takeUntil(this.notifier))
    .subscribe({
      next: (value) => {
        if(value.mensaje.codigo === '200'){
          this._alertService.showAlert('Se Descarto la Cancelación Correctamente');
          this.data = this.data.filter(item => item.idActividad !== actividadReferencia.idActividad);
        }
      }
    })
  }

  async getProductsCancelation() {
    await this.getProjects();
    this.productsFollowService.getProductCancelation(
      getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.productos,
        tipoModificacion: MODIFICATION_TYPE.cancelacion,
      })
    ).pipe(takeUntil(this.notifier))
    .subscribe({
      next: async (value) => {
        if(value.respuesta.length > 0) {
          this.chargeInitTable();
          let tmpData: any[] = [];

          for (const item of value.respuesta) {
            let claveProyecto = "", claveActividad = "", claveProducto: any;
            let productoReferencia = item.productoReferencia;

            claveProyecto = getCveProyecto({
              cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
              cveProyecto: +this.dataProjects.filter((x) => x.idProyecto === productoReferencia.idProyecto)[0].clave,
            });

            await this.getActivities(productoReferencia.idProyecto);

            claveActividad = getNumeroActividad(this.dataActivities.filter((x) => x.idActividad === productoReferencia.idActividad)[0].cveActividad);

            claveProducto = this.setClaveProducto({
              projectSelected: this.dataProjects.filter((x) => x.idProyecto === productoReferencia.idProyecto)[0],
              activitySelected: this.dataActivities.filter((x) => x.idActividad === productoReferencia.idActividad)[0],
              claveProductoForm: '0000-000-00-0-00',
              numeroProductoForm: productoReferencia?.cveProducto || '',
              categorizacionProductoForm: productoReferencia?.idCategorizacion || 0,
              tipoProductoForm: productoReferencia?.idTipoProducto || 0,
              setClaveProducto: false,
            })

            tmpData.push({
              claveProyecto,
              claveActividad,
              claveProducto,
              ...item.productoReferencia
            });
          }

          this.data = tmpData;
        }
      }
    })
  }

  async selectedProductoCancelation(productoReferencia: any){
    this.questions[this.modificationType === 'product' ? 4 : 2].options = [{
      id: productoReferencia.idProducto,
      value: productoReferencia.nombre,
    }]
    await this.getActivities(productoReferencia.idProyecto);
    this.emmitEvent = false;
    this.form.get('nombreProyecto')?.setValue(productoReferencia.idProyecto);
    this.form.get('nombreActividad')?.setValue(productoReferencia.idActividad);
    let actividadSelecionada = this.dataActivities.filter((item) => item.idActividad === productoReferencia.idActividad)[0];
    this.form.get('claveActividad')?.setValue(`${this.form.get('claveProyecto')?.value}-${getNumeroActividad(actividadSelecionada.cveActividad)}`);
    this.form.get('nombreProducto')?.setValue(productoReferencia.idProducto);
    this.form.get('numeroProducto')?.setValue(getNumeroProducto(productoReferencia?.cveProducto));
    this.form.get('claveProducto')?.setValue(
      this.setClaveProducto({
        projectSelected: this.projectSelected,
        activitySelected: this.activitySelected,
        claveProductoForm: '0000-000-00-0-00',
        numeroProductoForm: productoReferencia?.cveProducto || '',
        categorizacionProductoForm: productoReferencia?.idCategorizacion || 0,
        tipoProductoForm: productoReferencia?.idTipoProducto || 0,
        setClaveProducto: false,
      })
    );
    this.cancelationSuccess();
    this.emmitEvent = true;
  }

  async deleteProdcutCancelation(productoReferencia: any){
    this.productsFollowService.deleteAdecuacion({
      idReferencia: productoReferencia.idProducto,
      idAdecuacionSolicitud: getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.productos,
        tipoModificacion: MODIFICATION_TYPE.cancelacion,
      })
    }).pipe(takeUntil(this.notifier))
    .subscribe({
      next: (value) => {
        if(value.mensaje.codigo === '200'){
          this._alertService.showAlert('Se Descarto la Cancelación Correctamente');
          this.data = this.data.filter(item => item.idProducto !== productoReferencia.idProducto);
        }
      }
    })
  }

  async getActionsCancelation() {
    await this.getProjects();
    this.actionsFollowService.getAcccionCancelacion(
      getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.acciones,
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
            let claveProyecto = "", claveActividad = "", claveProducto: any;
            let accionReferencia = item.accionReferencia;

            return new Promise<void>((resolve) => {
              this.productsFollowService.getProductById(accionReferencia.idProducto)
                .subscribe({
                  next: async (producto) => {
                    let productoFind = producto.respuesta;
                    claveProyecto = getCveProyecto({
                      cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
                      cveProyecto: +this.dataProjects.filter((x) => x.idProyecto === productoFind.idProyecto)[0].clave,
                    });
                    await this.getActivities(productoFind.idProyecto, true);

                    claveActividad = getNumeroActividad(this.dataActivities.filter((x) => x.idActividad === productoFind.idActividad)[0].cveActividad);

                    claveProducto = this.setClaveProducto({
                      projectSelected: this.dataProjects.filter((x) => x.idProyecto === productoFind.idProyecto)[0],
                      activitySelected: this.dataActivities.filter((x) => x.idActividad === productoFind.idActividad)[0],
                      claveProductoForm: '0000-000-00-0-00',
                      numeroProductoForm: productoFind?.cveProducto || '',
                      categorizacionProductoForm: productoFind?.idCategorizacion || 0,
                      tipoProductoForm: productoFind?.idTipoProducto || 0,
                      setClaveProducto: false,
                    });

                    tmpData.push({
                      claveProyecto,
                      claveActividad,
                      claveProducto,
                      nombreAccion: accionReferencia.nombre,
                      ...accionReferencia
                    });
                    resolve();
                  },
                  error: () => resolve() // resolve on error to prevent hanging
                });
            });
          });

          await Promise.all(promises);
          this.data = tmpData;
        }
      }
    });
  }


  async selectedActionsCancelation(accionReferencia: any) {
    this.questions[4].options = [{
      id: accionReferencia.idAccion,
      value: accionReferencia.nombre,
    }]
    this.productsFollowService.getProductById(accionReferencia.idProducto)
      .subscribe({
        next: async (producto) => {
          let productoFind = producto.respuesta;
          this.questions[this.modificationType === 'product' ? 4 : 2].options = [{
            id: productoFind.idProducto,
            value: productoFind.nombre,
          }]
          await this.getActivities(productoFind.idProyecto);
          await this.getProductsByIdActivity(productoFind.idActividad);
          this.emmitEvent = false;
          this.form.get('nombreProducto')?.setValue(productoFind.idProducto);
          this.form.get('nombreActividad')?.setValue(productoFind.idActividad);
          this.form.get('nombreProyecto')?.setValue(productoFind.idProyecto);
          this.form.get('claveNivelEducativo')?.setValue(this.getClaveNivelEducativo(parseInt(productoFind.idProducto)));
          this.form.get('nombreAccion')?.setValue(accionReferencia.idAccion);
          this.form.get('claveAccion')?.setValue(getNumeroAccion(accionReferencia?.claveAccion));
          this.form.get('claveUnidad')?.setValue(`${this.dataUser.perfilLaboral.cveUnidad} - ${this.dataUser.perfilLaboral.cdNombreUnidad}`);

          this.cancelationSuccess();
          this.emmitEvent = true;
        }
      })
  }

  async deleteActionsCancelation(accionReferencia: any){
    this.actionsFollowService.deleteAdecuacion({
      idReferencia: accionReferencia.idAccion,
      idAdecuacionSolicitud: getIdAdecuancionSolicitud({
        tipoApartado: TIPO_APARTADO.acciones,
        tipoModificacion: MODIFICATION_TYPE.cancelacion,
      })
    }).pipe(takeUntil(this.notifier))
    .subscribe({
      next: (value) => {
        if(value.mensaje.codigo === '200'){
          this._alertService.showAlert('Se Descarto la Cancelación Correctamente');
          this.data = this.data.filter(item => item.idAccion !== accionReferencia.idAccion);
        }
      }
    })
  }

  getProjects(){
    return new Promise<void>((resolve, reject) => {
      this.projectsFollowService
        .getConsultarProyectos(this.yearNav, false, this.selectedSolicitud.idSolicitud)
        .pipe(takeUntil(this.notifier))
        .subscribe({

          next: (value) => {
            const tmpData: IItemConsultarPRoyectosResponse[] = [];
            for (const item of value.respuesta) {
              if (item.estatus !== 'B' && item.estatus !== 'T') {
                tmpData.push(item);
              }
            }
            this.dataProjects = tmpData;
            this.questions[0].options = mapOptionProjects(this.dataProjects);
            resolve();
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  async getActivities(idProject: number, disable?: boolean) {
    return new Promise<void>((resolve, reject) => {
      this.resetToActivities();
      this.activitiesFollowService
        .getActivityByProjectIdSolicitud(idProject, false, this.selectedSolicitud.idSolicitud)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta?.length > 0) {
              if(!disable)
                this.form.get('nombreActividad')?.enable({emitEvent: false});

              const tmpData: any[] = [];
              for (const item of value.respuesta) {
                if (item.csEstatus != 'I' && item.csEstatus != 'B') {
                  tmpData.push({
                    id: item.idActividad,
                    value: item.cxNombreActividad,
                  });
                }
              }
              this.dataActivities = value.respuesta;
              this.questions[this.modificationType === 'activity' ? 3 : 1].options = tmpData;
              resolve();
            }
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  async getProductsByIdActivity(idActivity: string) {
    return new Promise<void>((resolve, reject) => {
      this.resetToProduct();
      this.productsFollowService
        .getProductByActivityIdSolicitud(idActivity, false, this.selectedSolicitud.idSolicitud)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta?.length > 0) {
              this.form.get('nombreProducto')?.enable({emitEvent: false});
              const tmpData: any[] = [];
              for (const item of value.respuesta) {
                if (item.estatus !== 'I' && item.estatus != 'B') {
                  tmpData.push(item);
                }
              }
              this.dataProducts = tmpData;
              this.questions[this.modificationType === 'product' ? 4 : 2].options = mapOptionProducts(this.dataProducts);
              resolve();
            }
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  async getActionsByIdProduct(idProduct: number) {
    return new Promise<void>((resolve, reject) => {
      this.resetToAction();
      this.actionsFollowService
        .getActions(idProduct, false, this.selectedSolicitud.idSolicitud)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta?.length > 0) {
              this.form.get('nombreAccion')?.enable({emitEvent: false});
              const tmpData: IItmeAccionFollowResponse[] = [];
              for (const item of value.respuesta) {
                tmpData.push(item);
              }
              this.dataAccions = tmpData;
              this.questions[4].options = mapOptionActions(this.dataAccions);
              resolve();
            }
          },
          error: (error) => {
            reject(error);
          }
        })
    });
  }

  submit(): void {
    const { nombreProyecto, nombreActividad, nombreProducto, nombreAccion } = this.form.getRawValue();
    switch (this.modificationType) {
      case 'activity':
        this.activitiesFollowService.cancelActivity(
          {
            idAdecuacionSolicitud:
              getIdAdecuancionSolicitud({
                tipoApartado: TIPO_APARTADO.actividades,
                tipoModificacion: MODIFICATION_TYPE.cancelacion,
              })
            ,
            idActividadReferencia: nombreActividad
          })
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this._alertService.showAlert('Se Cancelo Correctamente');
              this.getActivitiesCancelation();
            }
          })
        break;
      case 'product':
        this.productsFollowService.cancelProduct(
          {
            idAdecuacionSolicitud:
              getIdAdecuancionSolicitud({
                tipoApartado: TIPO_APARTADO.productos,
                tipoModificacion: MODIFICATION_TYPE.cancelacion,
              })
            ,
            idProductoReferencia: nombreProducto
          })
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this._alertService.showAlert('Se Cancelo Correctamente');
              this.getProductsCancelation();
            }
          })
        break;
      case 'actions':
        this.actionsFollowService.cancelAccion(
          {
            idAdecuacionSolicitud:
              getIdAdecuancionSolicitud({
                tipoApartado: TIPO_APARTADO.acciones,
                tipoModificacion: MODIFICATION_TYPE.cancelacion,
              })
            ,
            idAccionReferencia: nombreAccion
          })
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this._alertService.showAlert('Se Cancelo Correctamente');
              this.getActionsCancelation();
            }
          })
        break;
      default:
        this.projectsFollowService.cancelProject(
          {
            idAdecuacionSolicitud:
              getIdAdecuancionSolicitud({
                tipoApartado: TIPO_APARTADO.proyecto,
                tipoModificacion: MODIFICATION_TYPE.cancelacion,
              })
            ,
            idProyectoReferencia: nombreProyecto
          })
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this._alertService.showAlert('Se Cancelo Correctamente');
              this.cancelationSuccess();
            }
          })
        break;
    }
    this.clear();
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemActivitiesResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.chargeDataForm(dataAction);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Descartar la Cancelación Seleccionada?',
          });
          if (confirm) {
            this.deleteCancelation(dataAction);
          }
        }
        break;
    }
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
      arrClaveProducto[0] = String(getCveProyecto({ cveUnidad: this.dataUser.perfilLaboral.cveUnidad, cveProyecto: +projectSelected?.clave }));
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

  private getClaveNivelEducativo(idProducto: number): string {
    let productoEncontrado = this.dataProducts.find(
      (producto) => producto.idProducto === idProducto
    );
    let catalogNivelEducativo =
      this.nivelEducativoProducto?.catalogo.find(
        (catalogo) =>
          catalogo.idCatalogo === productoEncontrado?.idNivelEducativo
      );
    return catalogNivelEducativo?.ccExterna ? getNumeroNivelEducativo(+catalogNivelEducativo?.ccExterna) : 'NA';
  }

  private chargeInitTable() {
    this.data = [];
    this.viewTableCancelation = true;
    switch (this.modificationType) {
      case 'activity':
        this.titleSection = "Actividades con Cancelación";
        this.columns = [
          {
            columnDef: 'claveProyectos',
            header: 'Clave del<br />Proyecto',
            width: '200px',
          },
          {
            columnDef: 'claveActividad',
            header: 'Clave de la<br />Actividad',
            width: '200px',
          },
          {
            columnDef: 'nombreActividad',
            header: 'Nombre de la Actividad',
            alignLeft: true,
          }
        ];
        break;
      case 'product':
        this.titleSection = "Productos con Cancelación";
        this.columns = [
          { columnDef: 'claveProyecto', header: 'Clave del<br />Proyecto' },
          { columnDef: 'claveActividad', header: 'Clave de la<br />Actividad' },
          { columnDef: 'claveProducto', header: 'Clave del<br />Producto' }
        ];
        break;
      case 'actions':
        this.titleSection = "Acciones con Cancelación";
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
          { columnDef: 'nombreAccion', header: 'Nombre de Acción', alignLeft: true }
        ];
        break;
      default:
        this.titleSection = "Proyectos con Cancelación";
        this.columns = [
          {
            columnDef: 'claveNombreUnidad',
            header: 'Clave y Nombre de la Unidad',
            alignLeft: true,
          },
          {
            columnDef: 'claveProyecto',
            header: 'Clave del<br />Proyecto',
            width: '180px',
          },
          { columnDef: 'nombre', header: 'Nombre del Proyecto', alignLeft: true }
        ];
        break;
    }
  }

  private chargeDataForm(dataAction: any){
    switch (this.modificationType) {
      case 'activity':
        this.selectedActivityCancelation(dataAction);
        break;
      case 'product':
        this.selectedProductoCancelation(dataAction);
          break;
      case 'actions':
        this.selectedActionsCancelation(dataAction);
        break;
      default:
        this.selectedProjectCancelation(dataAction);
        break;
    }
  }

  private deleteCancelation(dataAction: any) {
    switch (this.modificationType) {
      case 'activity':
        this.deleteActivityCancelation(dataAction);
        break;
      case 'product':
        this.deleteProdcutCancelation(dataAction);
          break;
      case 'actions':
        this.deleteActionsCancelation(dataAction);
        break;
      default:
        this.deleteProjectCancelation(dataAction);
        break;
    }
  }

  private resetToActivities () {
    this.form.get('nombreActividad')?.disable({emitEvent: false});
    this.form.get('nombreProducto')?.disable({emitEvent: false});
    this.form.get('nombreAccion')?.disable({emitEvent: false});

    this.form.get('nombreActividad')?.setValue('');
    this.form.get('numeroProducto')?.setValue('');
    this.form.get('claveProducto')?.setValue('');
    this.form.get('nombreProducto')?.setValue('');

    this.form.get('claveAccion')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.form.get('claveUnidad')?.setValue('');
    this.form.get('nombreAccion')?.setValue('');
  }

  private resetToProduct () {
    this.form.get('nombreProducto')?.disable({emitEvent: false});
    this.form.get('nombreAccion')?.disable({emitEvent: false});

    this.form.get('numeroProducto')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.form.get('claveProducto')?.setValue('');
    this.form.get('nombreProducto')?.setValue('');

    this.form.get('claveAccion')?.setValue('');
    this.form.get('claveNivelEducativo')?.setValue('');
    this.form.get('claveUnidad')?.setValue('');
    this.form.get('nombreAccion')?.setValue('');
  }

  private resetToAction () {
    this.form.get('nombreAccion')?.disable({emitEvent: false});

    this.form.get('claveAccion')?.setValue('');
    this.form.get('claveUnidad')?.setValue('');
    this.form.get('nombreAccion')?.setValue('');
  }

  private clearForm(){
    this.form.reset();
    this.isButtonDisabled = false;
    this.dataProjects = [];
    this.dataActivities = [];
    this.dataProducts = [];
    this.dataAccions = [];

    this.emmitEvent = true;
  }

  clear(){
    this.form.get('nombreProyecto')?.enable({emitEvent: false});
    this.resetToActivities();
    this.form.reset();

    this.isButtonDisabled = false;
  }

  private cancelationSuccess() {
    //setTimeout(()=> {
      this.form.disable({emitEvent: false});
      this.isButtonDisabled = true;
    //},500)
  }
}
