import { Component } from '@angular/core';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { AlertService } from '@common/services/alert.service';
import { AddCommentComponent } from './add-comment/add-comment.component';
import * as moment from 'moment';
import { TimeLineI } from '@common/time-line/interfaces/time-line.interface';
import { ROLE, SimulateAuthService } from '@auth/simulate-auth.service';
import * as SecureLS from 'secure-ls';
import { SolicitudComentariosService } from '@common/services/seguimiento/solicitudComentarios.service';
import {
  IHistoricoSolicitudResponse,
  IItemConsultaSolicitudResponse,
} from '@common/interfaces/seguimiento/consultaSolicitud';
import { AlfrescoService } from '@common/services/alfresco.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { Router } from '@angular/router';
import { AdecuacionService } from '@common/services/seguimiento/adecuacion.service';
import { SolicitudSeguimientoService } from '@common/services/seguimiento/solicitud-seguimiento.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { SolicitudFirmaService } from '@common/services/seguimiento/solicitudFirma.service';
import { IRegistrarSolicitudFirmaPayload } from '@common/interfaces/seguimiento/solicitudFirma.interface';
import { DOCUMENT_TYPES } from '@common/enums/documentTypes.enum';
import { getGlobalStatusSeguimiento } from '@common/utils/Utils';
import { TIPO_ADECUACION } from '../../requests/request/enum/tipoAdecuacion.enum';
import { AuthService } from '@common/services/auth.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataAlf: ISeguridadAlfResponse;
  loading = false;
  data: any[] = [];
  columns = [
    { columnDef: 'comment', header: 'Detalle' },
    { columnDef: 'usuario', header: 'Usuario' },
    { columnDef: 'fechaDeSeguimiento', header: 'Fecha de Seguimiento' },
  ];
  actions: TableActionsI = {
    edit: false,
    delete: true,
  };
  role?: ROLE;
  roles = ROLE;
  items: TimeLineI[] = [];
  itemsBackup: TimeLineI[] = [
    {
      estatusId: 2236,
      title: 'Pre-registro',
      date: '00/00/0000',
      icon: 'edit',
      color: 'green',
      // active: true,
    },
    {
      estatusId: 2239,
      title: 'Rechazada',
      date: '00/00/0000',
      icon: 'close',
      color: 'green',
    },
    {
      estatusId: 2237,
      title: 'Registrado',
      date: '00/00/0000',
      icon: 'edit_square',
      color: 'green',
    },
    {
      estatusId: 92672,
      title: 'Por Revisar',
      date: '00/00/0000',
      icon: 'schedule',
      color: 'green',
    },
    {
      estatusId: 2238,
      title: 'En Revisión',
      date: '00/00/0000',
      icon: 'search',
      color: 'green',
    },
    {
      estatusId: 2271,
      title: 'Revisada',
      date: '00/00/0000',
      icon: 'check',
      color: 'green',
    },
    {
      estatusId: 2241,
      title: 'Formalizado',
      date: '00/00/0000',
      icon: 'check_circle',
      color: 'green',
    },
    {
      estatusId: 2244,
      title: 'Rubricado',
      date: '00/00/0000',
      icon: 'check_circle_outline',
      color: 'green',
    },
    {
      estatusId: 2240,
      title: 'Aprobada',
      date: '00/00/0000',
      icon: 'check_circle_outline',
      color: 'green',
    },
    {
      estatusId: 2243,
      title: 'Aprobación Cambio de MIR',
      date: '00/00/0000',
      icon: 'check_circle_outline',
      color: 'green',
    },
  ];
  currentStep = 2;
  notifier = new Subject();
  selectedSolicitudValidate: IItemConsultaSolicitudResponse;
  source: string = '';
  dataUser: IDatosUsuario;
  yearNav: string;
  submitingComentario: boolean = false;
  showAddComments: boolean = true;
  showAllBtn: boolean = false;
  showBtnEditar: boolean = false;
  showBtnCancelar: boolean = false;
  showBtnFormalizar: boolean = false;
  showBtnRubricar: boolean = false;
  showBtnAprobar: boolean = false;
  showBtnAutorizar: boolean = false;
  showBtnAgregarFirma: boolean = false;
  showBtnRevisado: boolean = false;
  showBtnRechazar: boolean = false;
  disabledBtnFormalizar: boolean = true;
  disabledBtnRubricar: boolean = true;
  disabledBtnAprobar: boolean = true;
  disabledBtnAutorizar: boolean = true;
  disabledBtnRevisado: boolean = true;
  disabledBtnRechazar: boolean = false;
  disabledBtnAgregarFirma: boolean = false;
  submitingBtnFormalizar: boolean = false;
  submitingBtnRubricar: boolean = false;
  submitingBtnAprobar: boolean = false;
  submitingBtnAutorizar: boolean = false;
  submitingBtnAgregarFirma: boolean = false;
  submitingBtnRevisado: boolean = false;
  submitingBtnRechazar: boolean = false;
  showInputFile: boolean = false;
  filesToUploadComponents: any[] = [];
  loadingAlfresco: boolean = true;

  /** COMMENT:
   * Actores que participan en cada flujo
   *
   * Tipo de adecuacion
   * Programatica:
   *  - ENLACE - Crea la solicitud - Ajusta la solictud
   *  - PLANEACION - Valida la solicitud
   *  - SUPERVISOR nivel 1 - Valida la solicitud
   *  - SUPERVISOR nivel 2 - Valida la solicitud
   *  - SUPERVISOR nivel 3 - Valida la solicitud
   *  En caso de afectacion a la MIR (afectacion en productos)
   *  - SUPERVISOR nivel 4 - Valida la solicitud
   *
   * Programatica Presupuestal:
   *  - ENLACE - Crea la solicitud - Ajusta la solictud
   *  PAra que el estatus de la solicitud cambie a Revision, ambos deben iniciar la revision
   *  PAra que el estatus de la solicitud cambie a Revisado, ambos deben Aprobar
   *  - PLANEACION - Valida la solicitud (entra al mismo tiempo que PRESUPUESTO)
   *  - PRESUPUESTO - Valida la solicitud (entra al mismo tiempo que PLANEACION)
   *  - SUPERVISOR nivel 1 - Valida la solicitud
   *  - SUPERVISOR nivel 2 - Valida la solicitud
   *  - SUPERVISOR nivel 3 - Valida la solicitud
   *  En caso de afectacion a la MIR (afectacion en productos)
   *  - SUPERVISOR nivel 4 - Valida la solicitud
   *
   * Presupuestal:
   *  - ENLACE - Crea la solicitud - Ajusta la solictud
   *  - PLANEACION (Solo puede consultar)
   *  - PRESUPUESTO - Valida la solicitud
   *  - SUPERVISOR nivel 1 - Valida la solicitud
   *  - SUPERVISOR nivel 2 - Valida la solicitud
   *  - SUPERVISOR nivel 3 - Valida la solicitud
   *
   * Estatus
   *  - Pre-registro
   *  - Registrado
   *  - Por Revisar
   *  - En Revisión
   *  - Revisado
   *  - Rechazado
   *  - Formalizado
   *  - Rubricado
   *  - Aprobado
   *  - Aprobación Cambio MIR
   */

  constructor(
    private _alertService: AlertService,
    private _dialog: MatDialog,
    private router: Router,
    private _simulateAuthService: SimulateAuthService,
    private solicitudComentariosService: SolicitudComentariosService,
    private alfrescoService: AlfrescoService,
    private adecuacionService: AdecuacionService,
    private solicitudSeguimientoService: SolicitudSeguimientoService,
    private solicitudFirmaService: SolicitudFirmaService,
    private authService: AuthService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.dataAlf = this.ls.get('dataAlf');
    this.selectedSolicitudValidate = this.ls.get('selectedSolicitudValidate');
    if (this.selectedSolicitudValidate) {
      this.getAll();
      this.getCommentsPorIdSolicitud();
      this.getViewPdfAlfresco();
      this.consultaSolicitudPorId(
        this.selectedSolicitudValidate.idSolicitud ?? 0
      );
    } else {
      this.router.navigate([
        '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Revisión de Solicitudes',
      ]);
    }
  }
  async getAll(): Promise<void> {
    this.role = this._simulateAuthService.role;
    this.loading = true;
    this.loading = false;
  }

  getCommentsPorIdSolicitud() {
    this.solicitudComentariosService
      .getComentarioPorIdSolicitud(
        this.selectedSolicitudValidate.idSolicitud ?? 0
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta.length) {
            this.data = value.respuesta.map((item) => {
              return {
                id: item.idComentario,
                comment: item.comentario,
                usuario: item.usuario,
                fechaDeSeguimiento: moment(
                  `${item.dfSeguimiento} ${item.dhSeguimiento}`,
                  'YYYY-MM-DD HH:mm:ss'
                ).format('DD/MM/YYYY, hh:mm:ss a'),
              };
            });
          } else {
            this.data = [];
          }
          this.validateAndShowBtns();
        },
        error: (err) => {
          this.data = [];
          this.validateAndShowBtns();
        },
      });
  }

  currentUserHaveComments(): boolean {
    const someCommentIsFromUser = (value: any): boolean =>
      value.usuario === this.dataUser.cveUsuario;
    return this.data.some(someCommentIsFromUser);
  }

  consultaSolicitudPorId(idSolicitud: number) {
    this.solicitudSeguimientoService
      .consultaPorIdSolicitud(idSolicitud)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (
            value.codigo === '200' &&
            value.respuesta.historicoSolicitud?.length
          ) {
            this.uploadHistory(
              value.respuesta.historicoSolicitud,
              value.respuesta.cambiaIndicadores
            );
          }
        },
      });
  }

  uploadHistory(
    history: IHistoricoSolicitudResponse[],
    cambiaIndicadores: boolean = false
  ) {
    const aprobacionCambioMir = {
      estatusId: 2243,
      title: 'Aprobación Cambio de MIR',
      date: '00/00/0000',
      icon: 'check_circle_outline',
      color: 'green',
    };
    let tmpHistory: TimeLineI[] = [
      {
        estatusId: 2236,
        title: 'Pre-registro',
        date: moment(
          this.selectedSolicitudValidate.fechaSolicitud,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY'),
        icon: 'edit',
        color: 'green',
        active: true,
      },
    ];
    for (const item of history) {
      let icon = '';
      const finded = this.itemsBackup.filter(
        (itemFilter) => itemFilter.estatusId === item.idEstatus
      );
      if (finded.length) {
        icon = finded[0].icon;
      }
      tmpHistory.push({
        estatusId: item.idEstatus,
        title: getGlobalStatusSeguimiento(item.idEstatus, 'string'),
        date: moment(item.dfSolicitud, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        icon,
        color: 'green',
        active: true,
      });
    }
    // COMMENT: Se obtiene el ultimo estatus y se busca en el array original de estatus para concatenar los estatus faltantes
    const lastEstatusId = history[history.length - 1].idEstatus;
    const index = this.itemsBackup.findIndex(
      (q) => q.estatusId === lastEstatusId
    );
    tmpHistory = tmpHistory.concat(
      this.itemsBackup.slice(index + 1, this.itemsBackup.length - 1)
    );
    if (
      (cambiaIndicadores &&
        this.selectedSolicitudValidate.adecuacionId ===
        TIPO_ADECUACION.programatica) ||
      this.selectedSolicitudValidate.adecuacionId ===
      TIPO_ADECUACION.programaticaPresupuestal
    ) {
      tmpHistory.push(aprobacionCambioMir);
    }
    this.items = tmpHistory;
  }

  validateAndShowBtns() {
    const idTipoUsuario = this.dataUser.idTipoUsuario;
    switch (this.dataUser.idTipoUsuario) {
      case 'ENLACE':
        if (this.selectedSolicitudValidate.estatusId === 2239) {
          this.showBtnEditar = true;
          this.showBtnCancelar = true;
        }
        break;
      case 'PLANEACION':
        this.showBtnRevisado = true;
        this.showBtnRechazar = true;
        if (
          this.selectedSolicitudValidate.adecuacionId ===
          TIPO_ADECUACION.presupuestal
        ) {
          this.showBtnRevisado = false;
          this.showBtnRechazar = false;
          this.showAddComments = false;
        }
        break;
      case 'PRESUPUESTO':
        this.showBtnRevisado = true;
        this.showBtnRechazar = true;
        break;
      case 'SUPERVISOR':
        this.showBtnRechazar = true;

        if (this.dataUser?.perfilLaboral?.ixNivel) {
          switch (this.dataUser.perfilLaboral.ixNivel) {
            case 1:
              this.showBtnFormalizar = true;
              break;
            case 2:
              this.showBtnRubricar = true;
              break;
            case 3:
              this.showBtnAprobar = true;
              break;
            case 4:
              this.showBtnAutorizar = true;
              break;

            default:
              break;
          }
        }
        break;

      default:
        break;
    }

    let status = this.selectedSolicitudValidate.estatusId;
    if (
      this.dataUser.idTipoUsuario === 'PLANEACION' &&
      this.selectedSolicitudValidate.adecuacionId ===
      TIPO_ADECUACION.programaticaPresupuestal
    ) {
      status = this.selectedSolicitudValidate.estatusIdPlaneacion;
    }

    switch (status) {
      case 2238:
      case 92672:
        this.currentStep = 4;
        if (this.currentUserHaveComments()) {
          // this.disabledBtnRevisado = true;
          this.disabledBtnRechazar = false;
        } else {
          // this.disabledBtnRevisado = false;
          this.disabledBtnRechazar = true;
        }
        break;
      case 2271:
        this.currentStep = 6;
        if (this.currentUserHaveComments()) {
          // this.disabledBtnFormalizar = true;
          this.disabledBtnRechazar = false;
        } else {
          // this.disabledBtnFormalizar = false;
          this.disabledBtnRechazar = true;
        }
        break;
      case 2241:
        this.currentStep = 7;
        if (this.currentUserHaveComments()) {
          // this.disabledBtnRubricar = true;
          this.disabledBtnRechazar = false;
        } else {
          // this.disabledBtnRubricar = false;
          this.disabledBtnRechazar = true;
        }
        break;
      case 2244:
        this.currentStep = 8;
        if (this.currentUserHaveComments()) {
          // this.disabledBtnAprobar = true;
          this.disabledBtnRechazar = false;
        } else {
          // this.disabledBtnAprobar = false;
          this.disabledBtnRechazar = true;
        }
        break;
      case 2240:
        this.currentStep = 9;
        if (this.currentUserHaveComments()) {
          // this.disabledBtnRevisado = true;
          this.disabledBtnRechazar = false;
        } else {
          // this.disabledBtnRevisado = false;
          this.disabledBtnRechazar = true;
        }
        break;
      case 2243:
        this.currentStep = 10;
        if (this.currentUserHaveComments()) {
          // this.disabledBtnAutorizar = true;
          this.disabledBtnRechazar = false;
        } else {
          // this.disabledBtnAutorizar = false;
          this.disabledBtnRechazar = true;
        }
        break;
      case 2239:
        this.currentStep = 5;
        break;

      default:
        break;
    }

    if (
      idTipoUsuario !== 'ENLACE' &&
      idTipoUsuario !== 'PLANEACION' &&
      idTipoUsuario !== 'PRESUPUESTO'
    ) {
      if (this.dataUser.perfilLaboral?.archivoFirma) {
        this.showBtnAgregarFirma = false;
        this.disabledBtnFormalizar = false;
        this.disabledBtnRubricar = false;
        this.disabledBtnAprobar = false;
        this.disabledBtnAutorizar = false;
      } else {
        this.showBtnAgregarFirma = true;
        this.disabledBtnFormalizar = true;
        this.disabledBtnRubricar = true;
        this.disabledBtnAprobar = true;
        this.disabledBtnAutorizar = true;
      }
    }
  }

  async manageComment(data?: any): Promise<void> {
    const result = await lastValueFrom(
      this._dialog
        .open(AddCommentComponent, {
          width: '600px',
          data,
        })
        .afterClosed()
    );
    if (!result) return;
    this.submitingComentario = true;
    if (!result.id) {
      this.solicitudComentariosService
        .registrarComentario({
          comentario: result.comment,
          idComentario: null,
          idSolicitud: this.selectedSolicitudValidate.idSolicitud ?? 0,
          usuario: this.dataUser.cveUsuario,
        })
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.submitingComentario = false;
            if (value.mensaje.codigo === '200') {
              this.getCommentsPorIdSolicitud();
              this._alertService.showAlert('Se Guardó Correctamente');
            }
          },
          error: (err) => {
            this.submitingComentario = true;
          },
        });
    } else {
      this.solicitudComentariosService
        .actualizarComentario(result.id, {
          comentario: result.comment,
          idComentario: result.id,
          idSolicitud: this.selectedSolicitudValidate.idSolicitud ?? 0,
          usuario: this.dataUser.cveUsuario,
        })
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.submitingComentario = false;
            if (value.codigo === '200') {
              this.getCommentsPorIdSolicitud();
              this._alertService.showAlert('Se Guardó Correctamente');
            }
          },
          error: (err) => {
            this.submitingComentario = true;
          },
        });
    }
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.manageComment(event.value);
        break;
      case TableConsts.actionButton.edit:
        this.manageComment(event.value);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Comentario?',
          });
          if (confirm) {
            this.solicitudComentariosService
              .eliminarComentario(event.value.id)
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  this.submitingComentario = false;
                  if (value.mensaje.codigo === '200') {
                    this.getCommentsPorIdSolicitud();
                    this._alertService.showAlert('Se Eliminó Correctamente');
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  consultaSolicitudPorIdStorage() {
    return new Promise<any>((resolve, reject) => {
      this.solicitudSeguimientoService
        .consultaPorIdSolicitud(this.selectedSolicitudValidate.idSolicitud ?? 0)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200') {
              resolve(value.respuesta);
            } else {
              reject(value.mensaje);
            }
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  clickAction(
    from:
      | 'editaSolicitud'
      | 'cancelar'
      | 'formalizar'
      | 'rubricar'
      | 'aprobar'
      | 'autorizarCambio'
      | 'agregarFirma'
      | 'revisado'
      | 'rechazar'
  ) {
    let messageAlert = '';
    let messageSuccess = '';
    switch (from) {
      case 'editaSolicitud':
        this.consultaSolicitudPorIdStorage().then((response) => {
          this.ls.set('selectedSolicitud', response);
          this.ls.set('selectedSolicitudFromValidate', 'validate');
          this.router.navigate([
            '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Solicitudes/Editar',
          ]);
        });

        break;
      case 'cancelar':
        this.showBtnCancelar = true;
        messageAlert = 'Cancelar';
        messageSuccess = 'Canceló';
        this.cambiarEstatus(
          2239,
          this.selectedSolicitudValidate.idSolicitud ?? 0,
          messageAlert,
          messageSuccess
        );
        break;
      case 'formalizar':
        this.showBtnFormalizar = true;
        messageAlert = 'Formalizar';
        messageSuccess = 'Formalizó';
        this.cambiarEstatus(
          2241,
          this.selectedSolicitudValidate.idSolicitud ?? 0,
          messageAlert,
          messageSuccess
        );
        break;
      case 'rubricar':
        this.showBtnRubricar = true;
        messageAlert = 'Rubricar';
        messageSuccess = 'Rubricó';
        this.cambiarEstatus(
          2244,
          this.selectedSolicitudValidate.idSolicitud ?? 0,
          messageAlert,
          messageSuccess
        );
        break;
      case 'aprobar':
        this.showBtnAprobar = true;
        messageAlert = 'Aprobar';
        messageSuccess = 'Aprobó';
        this.cambiarEstatus(
          2240,
          this.selectedSolicitudValidate.idSolicitud ?? 0,
          messageAlert,
          messageSuccess
        );
        break;
      case 'autorizarCambio':
        this.showBtnAutorizar = true;
        messageAlert = 'Autorizar el Cambio';
        messageSuccess = 'Autorizó el Cambio';
        this.cambiarEstatus(
          2243,
          this.selectedSolicitudValidate.idSolicitud ?? 0,
          messageAlert,
          messageSuccess
        );
        break;
      case 'agregarFirma':
        if (!this.showInputFile) {
          this.showInputFile = true;
          this.disabledBtnAgregarFirma = true;
        } else {
          this.handleAgregarFirma();
        }
        break;
      case 'revisado':
        this.showBtnRevisado = true;
        messageAlert = 'Revisar';
        messageSuccess = 'Revisó';
        this.cambiarEstatus(
          2271,
          this.selectedSolicitudValidate.idSolicitud ?? 0,
          messageAlert,
          messageSuccess
        );
        break;
      case 'rechazar':
        this.showBtnRechazar = true;
        messageAlert = 'Rechazar';
        messageSuccess = 'Rechazó';
        this.cambiarEstatus(
          2239,
          this.selectedSolicitudValidate.idSolicitud ?? 0,
          messageAlert,
          messageSuccess
        );
        break;

      default:
        break;
    }
  }

  async cambiarEstatus(
    idEstatus: number,
    idSolicitud: number,
    messageAlert: string,
    messageSuccess: string
  ) {
    const confirm = await this._alertService.showConfirmation({
      message: `¿Está Seguro de ${messageAlert} la solicitud?`,
    });
    if (confirm) {
      this.solicitudSeguimientoService
        .cambiarEstatusSolicitud(
          idEstatus,
          idSolicitud,
          this.dataUser.cveUsuario
        )
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.submitingBtnFormalizar = false;
            this.submitingBtnRubricar = false;
            this.submitingBtnAprobar = false;
            this.submitingBtnAutorizar = false;
            this.submitingBtnAgregarFirma = false;
            this.submitingBtnRevisado = false;
            this.submitingBtnRechazar = false;
            if (value.mensaje.codigo === '200') {
              this.consultaSolicitudPorIdStorage().then((response) => {
                this.ls.set('selectedSolicitudValidate', response);
              });
              this._alertService.showAlert(
                `Se ${messageSuccess} Correctamente`
              );
              this.router.navigate([
                '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Revisión de Solicitudes',
              ]);
            }
            this.validateAndShowBtns();
          },
          error: (err) => {
            this.submitingBtnFormalizar = false;
            this.submitingBtnRubricar = false;
            this.submitingBtnAprobar = false;
            this.submitingBtnAutorizar = false;
            this.submitingBtnAgregarFirma = false;
            this.submitingBtnRevisado = false;
            this.submitingBtnRechazar = false;
            this.validateAndShowBtns();
          },
        });
    }
  }

  getViewPdfAlfresco() {
    if (this.selectedSolicitudValidate.cxUUID) {
      this.alfrescoService
        .viewOrDownloadFileAlfService({
          action: 'viewer',
          uid: this.selectedSolicitudValidate.cxUUID,
        })
        .then((response) => {
          this.loadingAlfresco = false;
          this.source = String(response.urlFile);
        })
        .catch((err) => {
          this.loadingAlfresco = false;
        });
    } else {
      this.loadingAlfresco = false;
    }
  }

  downloadFile() {
    if (this.selectedSolicitudValidate.cxUUID) {
      this.alfrescoService.viewOrDownloadFileAlfService({
        action: 'download',
        uid: this.selectedSolicitudValidate.cxUUID,
        fileName: ``,
      });
    }
  }

  handleAgregarFirma() {
    this.submitingBtnAgregarFirma = true;
    this.alfrescoService
      .uploadFileToAlfrescoPromise(
        this.dataAlf.uuidSeguimiento,
        this.filesToUploadComponents[0]
      )
      .then((response) => {
        const dataFirma: IRegistrarSolicitudFirmaPayload = {
          usuario: this.dataUser.cveUsuario,
          idSolicitud: this.selectedSolicitudValidate.idSolicitud ?? 0,
          archivo: {
            cxNombre: this.filesToUploadComponents[0].name,
            cxUuid: response,
            tipoDocumento: {
              idTipoDocumento: DOCUMENT_TYPES.image,
            },
            anhoPlaneacion: +this.yearNav,
          },
        };
        this.solicitudFirmaService
          .registrarFirma(dataFirma)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.submitingBtnAgregarFirma = false;
              if (value.codigo === '200') {
                this.showInputFile = false;
                this.filesToUploadComponents = [];
                this.authService
                  .consultarFirma(this.dataUser.cveUsuario)
                  .pipe(takeUntil(this.notifier))
                  .subscribe({
                    next: (value) => {
                      this.submitingBtnAgregarFirma = false;
                      if (value.mensaje.codigo === '200') {
                        const dataStorage: IDatosUsuario = value.datosUsuario;
                        this.ls.set('dUaStEaR', dataStorage);
                        this.dataUser = dataStorage;
                        this.validateAndShowBtns();
                      }
                    },
                    error: (err) => {
                      this.submitingBtnAgregarFirma = false;
                    },
                  });

                // this.solicitudFirmaService
                //   .consultarFirma(value.respuesta)
                //   .pipe(takeUntil(this.notifier))
                //   .subscribe({
                //     next: (valueConsulta) => {
                //       this.submitingBtnAgregarFirma = false;
                //       if (valueConsulta.codigo === '200') {
                //         // REVIEW: agregar la firma al local storage en los datos del usuario en sesion
                //         const tmpRespConsulta = valueConsulta.respuesta;
                //         this.dataUser.perfilLaboral.archivoFirma = {
                //           estatus: tmpRespConsulta.archivo.csEstatus,
                //           idArchivo: tmpRespConsulta.archivo.idArchivo,
                //           nombre: '',
                //           usuario: tmpRespConsulta.archivo.cveUsuario,
                //           uuid: tmpRespConsulta.archivo.cxUuid,
                //           uuidToPdf: null,
                //         };
                //         this.ls.set('dUaStEaR', this.dataUser);
                //         this.validateAndShowBtns();
                //       }
                //     },
                //     error: (err) => {
                //       this.submitingBtnAgregarFirma = false;
                //     },
                //   });
              }
            },
            error: (err) => {
              this.submitingBtnAgregarFirma = false;
            },
          });
      })
      .catch((error) => {
        this.submitingBtnAgregarFirma = false;
      });
  }

  showActionIf = (action: string, value: any): boolean => {
    if (TableConsts.actionButton.delete === action) {
      const cveUsuario = this.dataUser.cveUsuario;
      return value.usuario === cveUsuario;
    }
    return true;
  };

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
