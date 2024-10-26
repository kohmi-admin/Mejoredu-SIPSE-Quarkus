import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { AlertService } from '@common/services/alert.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TableColumn } from '@common/models/tableColumn';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  downloadInputFile,
  getCveProyecto,
  getGlobalStatus,
  getIdAdecuancionSolicitud,
} from '@common/utils/Utils';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { AlfrescoService } from '@common/services/alfresco.service';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { ModalService } from '@common/modal/modal.service';
import { IRegistrarProyectoPayload } from '@common/interfaces/seguimiento/registrarProyecto';
import { IItemConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { TIPO_APARTADO } from '../enum/tipoApartado.enum';
import { IActualizarProyectoPayload } from '@common/interfaces/seguimiento/actualizarProyecto';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { ProjectsService as ProjectsServiceCP } from '@common/services/projects.service';
import { PModMoveService } from '@common/services/seguimiento/modificacion/pModMove.service';
import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import { IItemGetProModByIdAdecuacionResponse } from '@common/interfaces/seguimiento/proyectos.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  @Input() modify: boolean = false;
  @Input() canSelectOne: boolean = false;
  @Input() position: 'left' | 'right' | null = null;
  @Input() catClaveNombreUnidadResponsableR!: ICatalogResponse;
  @Input() catObjetivosPrioritarioR!: ICatalogResponse;
  @Input() catContribucionProgramasEspecialesR!: ICatalogResponse;
  @Input() catContribucionPNCCIMGPR!: ICatalogResponse;
  data: any[] = [];
  catalogNombreUnidad: IItemCatalogoResponse[] = [];
  // columns: TableColumn[] = [
  //   {
  //     columnDef: 'name',
  //     header: 'Clave y Nombre de la Unidad',
  //     alignLeft: true,
  //   },
  //   { columnDef: 'clave', header: 'Clave del<br />Proyecto', width: '180px' },
  //   { columnDef: 'nombre', header: 'Nombre del Proyecto', alignLeft: true },
  //   { columnDef: 'status', header: 'Estatus', width: '110px' },
  // ];
  columnsModificationTable: TableColumn[] = [
    {
      columnDef: 'name',
      header: 'Clave y Nombre de la Unidad',
      alignLeft: true,
    },
    { columnDef: 'clave', header: 'Clave del<br />Proyecto', width: '180px' },
    { columnDef: 'nombre', header: 'Nombre del Proyecto', alignLeft: true },
    { columnDef: 'fullStatus', header: 'Estatus', width: '110px' },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
    custom: [
      {
        id: 'viewPdf',
        name: 'Visualizar y Descargar Documento Analítico',
        icon: 'picture_as_pdf',
        color: 'primary',
      },
    ],
  };
  loading = true;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  private _body = document.querySelector('body');

  dataPP: any[] = [];
  yearNav: string;
  dataUser: IDatosUsuario;
  filesToUploadComponents: any[] = [];
  disabledSubmiting: boolean = false;
  isSubmiting: boolean = false;
  dataSelected: IItemProjectsResponse | undefined;
  isUploadFile: boolean = false;
  year2Digits: string;
  numSecuenciaProyectoanual: number = 0;
  selectedSolicitud: IItemConsultaSolicitudResponse;
  dataProjectsS1: IItemConsultarPRoyectosResponse[] = [];
  projectSelected: any = null;
  pModMoveSubscription: Subscription | undefined;
  canEdit: boolean = true;
  dataModificationTable: IItemGetProModByIdAdecuacionResponse[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private projectsService: ProjectsService,
    private projectsServiceCP: ProjectsServiceCP,
    private alfrescoService: AlfrescoService,
    private modalService: ModalService,
    private pModMoveService: PModMoveService
  ) {
    this.canEdit = this.ls.get('canEdit');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
    this.year2Digits = this.yearNav.substring(2, 4);
    this._body?.classList.add('hideW');
    this.canEdit = this.selectedSolicitud.estatusId !== 2237;
    if (!this.selectedSolicitud) {
      this._alertService.showAlert(
        'Para Continuar Primero debe de Guardar los Datos Generales.'
      );
    }
  }

  ngOnInit(): void {
    this.buildForm(); //COMMENT: Dejar el build aqui para cargar la modificacion
    if (!this.position) {
      this.getSecuenciaByUnidad();
    }
    this.getAll();
    if (this.position) {
      if (this.position === 'left') {
        this.form
          .get('nameProject')
          ?.valueChanges.pipe(takeUntil(this.notifier))
          .subscribe((value) => {
            if (value) {
              let projectSelected: any = null;
              const findedProject = this.dataProjectsS1.filter(
                (item) => item.idProyecto === value
              );
              if (findedProject?.length > 0) {
                projectSelected = findedProject[0];
              }
              this.projectSelected = projectSelected;

              let isNewForModification = true;
              let project = projectSelected;
              if (this.dataModificationTable.length) {
                const findMod = this.dataModificationTable.find(
                  (item) => item.proyectoReferencia.idProyecto === value
                );
                if (findMod) {
                  isNewForModification = false;
                  project = findMod.proyectoModificacion;
                }
              }
              this.onTableAction({
                name: 'view',
                value: this.projectSelected,
              });
              this.pModMoveService.sendData({
                from: 'left',
                isNew: isNewForModification,
                viewType: 'edit',
                data: project,
              });
            }
          });
      }
      if (this.position) {
        this.pModMoveSubscription = this.pModMoveService.pModMove$.subscribe({
          next: (value) => {
            if (value) {
              if (this.position === 'right' && value.from === 'left') {
                if (value.data === 'resetAllForm') {
                  this.newProyect();
                  this.projectSelected = null;
                  this.form.disable({ emitEvent: false });
                } else {
                  this.projectSelected = value.data;
                  this.numSecuenciaProyectoanual = value.data.clave;
                  if (!value.isNew) {
                    this.dataSelected = value.data;
                  } else {
                    this.dataSelected = undefined;
                  }
                  this.onTableAction({
                    name: this.canEdit ? value.viewType : 'view',
                    value: value.data,
                  });
                }
              }
              if (this.position === 'left' && value.from === 'right') {
                if (value.data === 'reloadProjects') {
                  this.getConsultarProyectosByIdAdecuacion();
                }
              }
            }
          },
        });
      }
    }
  }

  get showFileUpload(): boolean {
    if (this.position) {
      if (this.position === 'left') {
        return true;
      } else if (this.position === 'right' && this.projectSelected) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  get showBtnSave(): boolean {
    if (this.position) {
      if (this.position === 'right' && this.projectSelected) {
        return true;
      } else {
        return false;
      }
    } else {
      return this.canEdit;
    }
  }

  async buildForm(): Promise<void> {
    const questions: any = [];
    questions.push(
      new TextboxQuestion({
        nane: 'claveNombreUnidad',
        label: 'Clave y Nombre de la Unidad',
        value: `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`,
        disabled: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'clave',
        disabled: true,
        value: `${this.year2Digits}00`,
        label: 'Clave del Proyecto',
        validators: [Validators.required],
      })
    );

    if (!this.canSelectOne) {
      questions.push(
        new TextareaQuestion({
          nane: 'nameProject',
          label: 'Nombre del Proyecto',
          rows: 2,
          validators: [Validators.required, Validators.maxLength(200)],
        })
      );
    } else {
      questions.push(
        new DropdownQuestion({
          filter: true,
          nane: 'nameProject',
          label: 'Nombre del Proyecto',
          options: [],
          validators: [Validators.required, Validators.maxLength(200)],
        })
      );
    }

    questions.push(
      new TextareaQuestion({
        nane: 'objPrioritario',
        label: 'Objetivo',
        rows: 3,
        validators: [Validators.required, Validators.maxLength(400)],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'fundamentacion',
        label: 'Fundamentación',
        validators: [Validators.required, Validators.maxLength(2000)],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'alcance',
        label: 'Alcance',
        validators: [Validators.required, Validators.maxLength(2000)],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'contribucionObjetivoPrioritarioPI',
        label: 'Contribución al Objetivo Prioritario de PI',
        filter: true,
        multiple: true,
        options: mapCatalogData({
          data: this.catObjetivosPrioritarioR,
          withIdx: true,
        }),
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'contribucionProgramasEspecialesDerivadosPND',
        label: 'Contribución a Programas Especiales Derivados del PND',
        filter: true,
        options: mapCatalogData({
          data: this.catContribucionProgramasEspecialesR,
          withOptionNoAplica: true,
        }),
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'PNCCIMGP',
        label: 'Contribución al PNCCIMGP',
        filter: true,
        options: mapCatalogData({
          data: this.catContribucionPNCCIMGPR,
        }),
        multiple: true,
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    if (this.modify && this.position) {
      this.form.disable();
      if (this.position === 'left') {
        this.form.get('nameProject')?.enable({ emitEvent: false });
      }
    }
  }

  getConsultarProyectos({
    excluirCortoPlazo,
    priorizarProyectoAsociado,
  }: {
    excluirCortoPlazo: boolean;
    priorizarProyectoAsociado: boolean;
  }) {
    const selectedSolicitud: IItemConsultaSolicitudResponse =
      this.ls.get('selectedSolicitud');
    this.projectsService
      .getConsultarProyectos(
        this.yearNav,
        excluirCortoPlazo,
        selectedSolicitud.idSolicitud ?? 0,
        priorizarProyectoAsociado
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            if (!this.position) {
              this.onTableAction({
                name: this.canEdit ? 'edit' : 'view',
                value: value.respuesta[0],
              });
            }
            if (this.position === 'left') {
              if (!this.canEdit) {
                this.form.disable();
              }
              this.dataProjectsS1 = value.respuesta;
              this.questions[2].options = value.respuesta
                .filter(
                  (item) =>
                    item.estatus === 'O' &&
                    this.dataUser.perfilLaboral.cveUnidad === item.claveUnidad
                )
                .map((item) => {
                  return {
                    id: item.idProyecto,
                    value: item.nombre,
                  };
                });
              this.getConsultarProyectosByIdAdecuacion();
            }
          }
        },
        error: () => { },
      });
  }

  getConsultarProyectoCPById(idProject: number) {
    return new Promise((resolve, reject) => {
      this.projectsServiceCP
        .getProjectById(idProject)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200' && value.proyecto?.length) {
              resolve(value.proyecto[0]);
            } else {
              reject(null);
            }
          },
          error: (err: any) => {
            reject(err);
          },
        });
    });
  }

  getConsultarProyectoSById(idProject: number) {
    return new Promise((resolve, reject) => {
      this.projectsService
        .getProjectById(idProject)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200' && value.respuesta) {
              resolve(value.respuesta);
            } else {
              reject(null);
            }
          },
          error: (err: any) => {
            reject(err);
          },
        });
    });
  }

  getConsultarProyectosByIdAdecuacion() {
    this.projectsService
      .getProyModiByIdAdecuacionSolicitud(
        getIdAdecuancionSolicitud({
          tipoApartado: TIPO_APARTADO.proyecto,
          tipoModificacion: MODIFICATION_TYPE.modificacion,
        })
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta.length) {
            const tmpArray: any[] = [];
            for (const item of value.respuesta) {
              const findedProject = this.dataProjectsS1.find(
                (itemFind) =>
                  itemFind.idProyecto === item.proyectoReferencia.idProyecto
              );
              if (findedProject) {
                tmpArray.push({
                  ...item,
                  name: `${item.proyectoReferencia.claveUnidad} ${item.proyectoReferencia.nombreUnidad}`,
                  clave: getCveProyecto({
                    cveUnidad: findedProject?.claveUnidad,
                    cveProyecto: findedProject ? +findedProject.clave : 0,
                  }),
                  nombre: item.proyectoReferencia.nombre,
                  fullStatus: getGlobalStatus(
                    item.proyectoModificacion.estatus,
                    this.dataUser.idTipoUsuario
                  ),
                });
              }
            }

            this.dataModificationTable = tmpArray;
          } else {
            this.dataModificationTable = [];
          }
        },
      });
  }

  getSecuenciaByUnidad() {
    this.projectsServiceCP
      .getSecuenciaProyectoAnual(
        this.yearNav,
        String(this.dataUser.perfilLaboral.idCatalogoUnidad)
      )
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        this.numSecuenciaProyectoanual = response.respuesta;
        this.form.controls['clave'].setValue(
          getCveProyecto({
            cveProyecto: this.numSecuenciaProyectoanual,
            cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
          })
        );
      });
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  responseFileUpload(files: any[]) {
    this.filesToUploadComponents = files;
  }

  async getAll(): Promise<void> {
    this.loading = true;
    if (this.position === 'left') {
      this.getConsultarProyectos({
        excluirCortoPlazo: false,
        priorizarProyectoAsociado: false,
      });
    } else {
      this.getConsultarProyectos({
        excluirCortoPlazo: true,
        priorizarProyectoAsociado: false,
      });
    }
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemProjectsResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          if (this.position === 'left') {
            this.form.get('nameProject')?.enable({ emitEvent: false });
          }
          this.disabledSubmiting = true;
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        if (!this.position) {
          this.dataSelected = dataAction;
        }
        this.resetAllForm();
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.enable({ emitEvent: false });
          this.form.get('clave')?.disable();
          this.form.get('claveNombreUnidad')?.disable();
          this.disabledSubmiting = false;
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Proyecto?',
          });
          if (confirm) {
            this.projectsService
              .deleteProject({
                id: dataAction.idProyecto,
                usuario: this.dataUser.cveUsuario,
              })
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getConsultarProyectos({
                      excluirCortoPlazo: true,
                      priorizarProyectoAsociado: false,
                    });
                    this.newProyect();
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
      case 'viewPdf':
        this.modalService.openGenericModal({
          idModal: 'modal-disabled',
          component: 'viewerPdf',
          data: {
            title: 'Visualización del documento analítico ',
            sourceFromAlfresco: dataAction.archivos[0].uuidToPdf,
            propertiesViewerPdf: '#toolbar=0&navpanes=0&scrollbar=0',
            sourceType: 'resourceUrl',
            downloadFile: {
              type: 'alfresco',
              uuidFile: dataAction.archivos[0].uuid,
              name: dataAction.archivos[0].nombre,
            },
            // labelBtnPrimary: 'Descargar',
          },
        });
        break;
    }
  }

  async onTableModificacionesAction(event: TableButtonAction) {
    const dataAction: IItemProjectsResponse = event.value.proyectoReferencia;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          this.form.get('nameProject')?.enable({ emitEvent: false });
          this.pModMoveService.sendData({
            from: 'left',
            isNew: false,
            viewType: 'view',
            data: event.value.proyectoModificacion,
          });
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this.dataSelected = dataAction;
        this.resetAllForm();
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          this.form.get('nameProject')?.enable({ emitEvent: false });
          this.pModMoveService.sendData({
            from: 'left',
            isNew: false,
            viewType: 'edit',
            data: event.value.proyectoModificacion,
          });
        }, 100);
        break;
      case 'viewPdf':
        this.modalService.openGenericModal({
          idModal: 'modal-disabled',
          component: 'viewerPdf',
          data: {
            title: 'Visualización del documento analítico ',
            sourceFromAlfresco: dataAction.archivos[0].uuidToPdf,
            propertiesViewerPdf: '#toolbar=0&navpanes=0&scrollbar=0',
            sourceType: 'resourceUrl',
            downloadFile: {
              type: 'alfresco',
              uuidFile: dataAction.archivos[0].uuid,
              name: dataAction.archivos[0].nombre,
            },
          },
        });
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Modificación del Proyecto?',
          });
          if (confirm) {
            this.projectsService
              .deleteAdecuacion({
                idReferencia: dataAction.idProyecto,
                idAdecuacionSolicitud: getIdAdecuancionSolicitud({
                  tipoApartado: TIPO_APARTADO.proyecto,
                  tipoModificacion: MODIFICATION_TYPE.modificacion,
                }),
              })
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getConsultarProyectosByIdAdecuacion();
                    this.newProyect();
                    this.form.disable({ emitEvent: false });
                    this.form.get('nameProject')?.enable({ emitEvent: false });
                    this.pModMoveService.sendData({
                      from: 'left',
                      isNew: false,
                      viewType: 'view',
                      data: 'resetAllForm',
                    });
                  }
                },
              });
          }
        }
        break;
    }
  }

  onDownloadFile(event: any[]) {
    if (event.length) {
      if (event[0].cxUuid) {
        this.downloadFileAlf(event[0].cxUuid, event[0].cxNombre);
      } else {
        downloadInputFile(event[0]);
      }
    }
  }
  async submit() {
    const formBody = this.form.getRawValue();

    if (!this.filesToUploadComponents.length) {
      this._alertService.showAlert('El documento analítico es requerido.');
      return;
    }

    if (this.form.valid) {
      this.isSubmiting = true;
      let claveUnidad = this.dataUser?.perfilLaboral?.cveUnidad ?? '';
      let nombreUnidad = this.dataUser?.perfilLaboral?.cdNombreUnidad ?? '';
      let contribucionObjetivo: any[] = [];
      for (const item of formBody.contribucionObjetivoPrioritarioPI) {
        contribucionObjetivo.push({
          idCatalogo: item,
        });
      }
      let contribucionPNCCIMGP: any[] = [];
      for (const item of formBody.PNCCIMGP) {
        contribucionPNCCIMGP.push({
          idCatalogo: item,
        });
      }
      let idAdecuacionSolicitud =
        this.position === 'right'
          ? getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.proyecto,
            tipoModificacion: MODIFICATION_TYPE.modificacion,
          })
          : getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.proyecto,
            tipoModificacion: MODIFICATION_TYPE.alta,
          });
      if (!this.dataSelected) {
        let archivoToCreate: any = null;
        if (this.position === 'right') {
          if (
            this.projectSelected.archivos?.[0].uuid !==
            this.filesToUploadComponents?.[0].uuid
          ) {
            const responseAlf = await this.uploadToAlfresco(
              this.filesToUploadComponents
            );
            if (responseAlf) {
              archivoToCreate = [responseAlf];
            }
          } else {
            archivoToCreate = this.projectSelected.archivos;
          }
        } else {
          if (this.filesToUploadComponents?.length > 0) {
            const responseAlf = await this.uploadToAlfresco(
              this.filesToUploadComponents
            );
            if (responseAlf) {
              archivoToCreate = [responseAlf];
            }
          }
        }

        const dataCreateProyecto: IRegistrarProyectoPayload = {
          idAnhio: +this.yearNav,
          cveProyecto: this.numSecuenciaProyectoanual,
          nombreProyecto: formBody.nameProject,
          claveUnidad,
          nombreUnidad,
          objetivo: formBody.objPrioritario,
          csEstatus: this.form.valid ? 'C' : 'I',
          fundamentacion: formBody.fundamentacion,
          alcance: formBody.alcance,
          contribucionProgramaEspecial:
            formBody.contribucionProgramasEspecialesDerivadosPND === '0'
              ? null
              : formBody.contribucionProgramasEspecialesDerivadosPND,
          contribucionObjetivo,
          contribucionPNCCIMGP,
          archivos: archivoToCreate,
          cveUsuario: this.dataUser.cveUsuario,
          idAdecuacionSolicitud,
          idProyectoReferencia:
            this.position === 'right' ? this.projectSelected.idProyecto : null,
        };
        this.projectsService
          .createProject(dataCreateProyecto)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.codigo === '200') {
                let inpFile: any = document.getElementById(
                  'file-documento-analitico-seguimiento'
                );
                inpFile.value = '';
                if (!this.position) {
                  this.getConsultarProyectos({
                    excluirCortoPlazo: true,
                    priorizarProyectoAsociado: false,
                  });
                  this.getSecuenciaByUnidad();
                  this.resetAllForm();
                  this.dataSelected = undefined;
                }
                if (this.position === 'right') {
                  this.pModMoveService.sendData({
                    from: 'right',
                    isNew: false,
                    viewType: 'view',
                    data: 'reloadProjects',
                  });
                  this.getConsultarProyectoSById(
                    value.respuesta.idProyecto
                  ).then((response: any) => {
                    this.dataSelected = response;
                    this.onTableAction({
                      name: 'edit',
                      value: response,
                    });
                  });
                }
                this._alertService.showAlert('Se Guardó Correctamente');
              }
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
      } else {
        let archivoToUpdate: any = null;
        if (
          this.dataSelected.archivos?.[0].uuid !==
          this.filesToUploadComponents?.[0].uuid
        ) {
          const responseAlf = await this.uploadToAlfresco(
            this.filesToUploadComponents
          );
          if (responseAlf) {
            archivoToUpdate = responseAlf;
          }
        }

        const dataUpdateProyecto: IActualizarProyectoPayload = {
          idAnhio: +this.yearNav,
          cveProyecto: +this.dataSelected.clave,
          cxNombreProyecto: formBody.nameProject,
          cveUnidad: claveUnidad,
          cxNombreUnidad: nombreUnidad,
          cxObjetivo: formBody.objPrioritario,
          csEstatus: this.form.valid ? 'C' : 'I',
          cxFundamentacion: formBody.fundamentacion,
          cxAlcance: formBody.alcance,
          contribucionProgramaEspecial:
            formBody.contribucionProgramasEspecialesDerivadosPND === '0'
              ? null
              : formBody.contribucionProgramasEspecialesDerivadosPND,
          contribucionObjetivo,
          contribucionPNCCIMGP,
          archivo: archivoToUpdate,
          cveUsuario: this.dataUser.cveUsuario,
        };
        if (this.position === 'right') {
          dataUpdateProyecto.idProyectoReferencia =
            this.projectSelected.idProyecto;
          dataUpdateProyecto.idAdecuacionSolicitud = idAdecuacionSolicitud;
        }

        this.projectsService
          .updateProject(
            String(this.dataSelected?.idProyecto),
            dataUpdateProyecto
          )
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.mensaje.codigo === '200') {
                this.isSubmiting = false;
                if (!this.position) {
                  this.getConsultarProyectos({
                    excluirCortoPlazo: true,
                    priorizarProyectoAsociado: false,
                  });
                  this.getSecuenciaByUnidad();
                  this.newProyect();
                  this.dataSelected = undefined;
                }
                if (this.position === 'right') {
                  this.pModMoveService.sendData({
                    from: 'right',
                    isNew: false,
                    viewType: 'view',
                    data: 'reloadProjects',
                  });
                }
                this._alertService.showAlert('Se Modificó Correctamente');
              }
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
      }
    }
  }

  uploadDataToForm(dataAction: IItemProjectsResponse) {
    this.form.controls['claveNombreUnidad'].setValue(
      `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`
    );
    const findedNombreUnidad = this.catalogNombreUnidad.filter(
      (item) => item.cdDescripcionDos === dataAction.claveUnidad
    );

    if (findedNombreUnidad?.length > 0) {
      this.form.controls['name'].setValue(findedNombreUnidad[0].idCatalogo);
    }
    this.form.controls['clave'].setValue(
      getCveProyecto({
        cveProyecto: +dataAction.clave,
      })
    );
    if (this.position === 'left') {
      this.form.controls['nameProject'].setValue(dataAction.idProyecto, {
        emitEvent: false,
      });
    } else {
      this.form.controls['nameProject'].setValue(dataAction.nombre, {
        emitEvent: false,
      });
    }
    this.form.controls['objPrioritario'].setValue(dataAction.objetivo);
    this.form.controls['fundamentacion'].setValue(dataAction.fundamentacion);
    this.form.controls['alcance'].setValue(dataAction.alcance);
    this.form.controls['contribucionProgramasEspecialesDerivadosPND'].setValue(
      dataAction.contribucionProgramaEspecial ?? '0'
    );

    const contribucionObjetivoPrioritarioPI: number[] = [];
    if (dataAction.contribucionObjetivoPrioritarioPI?.length) {
      for (const item of dataAction.contribucionObjetivoPrioritarioPI) {
        contribucionObjetivoPrioritarioPI.push(item.idCatalogo);
      }
    }
    this.form.controls['contribucionObjetivoPrioritarioPI'].setValue(
      contribucionObjetivoPrioritarioPI
    );

    const PNCCIMGP: number[] = [];
    if (dataAction.contribucionPNCCIMGP?.length) {
      for (const item of dataAction.contribucionPNCCIMGP) {
        PNCCIMGP.push(item.idCatalogo);
      }
    }
    this.form.controls['PNCCIMGP'].setValue(PNCCIMGP);
    const dataFile = {
      ...dataAction.archivos[0],
      name: dataAction.archivos[0].nombre,
    };
    this.filesToUploadComponents = [dataFile];
  }

  newProyect() {
    this.resetAllForm();
    this.form.enable();
    this.form.controls['claveNombreUnidad'].setValue(
      `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`
    );
    this.form.get('claveNombreUnidad')?.disable();
    this.form.get('clave')?.disable();
    this.form.get('clave')?.setValue(`${this.year2Digits}00`);
    this.dataSelected = undefined;
    if (!this.position) {
      this.getSecuenciaByUnidad();
    }
  }

  uploadToAlfresco(files: any[]) {
    return new Promise<any>((resolve, reject) => {
      const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
      let fileTmp: any = null;
      if (files.length > 0) {
        this.isUploadFile = true;
        fileTmp = files[0];
        this.alfrescoService
          .uploadFileAlfService(dataAlf.uuidSeguimiento, fileTmp)
          .subscribe({
            next: (value) => {
              this.isUploadFile = false;
              resolve({
                idArchivo: null,
                estatus: 'A',
                nombre: fileTmp.name,
                usuario: this.dataUser.cveUsuario,
                uuid: value.entry.id,
              });
            },
            error: (err) => {
              this.isUploadFile = false;
              reject(err);
            },
          });
      }
    });
  }

  resetAllForm() {
    this.form.reset();
    this.disabledSubmiting = false;
    this.filesToUploadComponents = [];
    this.form.controls['claveNombreUnidad'].setValue(
      `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`
    );
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.notifier.complete();
    this.pModMoveSubscription?.unsubscribe();
  }
}
