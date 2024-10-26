import { Component, OnInit } from '@angular/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { RequestTbl } from '../requests/request/classes/request-tbl.class';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { Router } from '@angular/router';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { DateQuestion } from '@common/form/classes/question-date.class';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { SolicitudSeguimientoService } from '@common/services/seguimiento/solicitud-seguimiento.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  getGlobalStatusSeguimiento,
  getIdAdecuancionSolicitud,
  getTiposModificacion,
} from '@common/utils/Utils';
import { IConsultaPorFiltrosPayload } from '@common/interfaces/seguimiento/consultaPorFiltros.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import * as moment from 'moment';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { ModalService } from '@common/modal/modal.service';
import { AlertService } from '@common/services/alert.service';
import { TIPO_ADECUACION } from '../requests/request/enum/tipoAdecuacion.enum';
import { IItemConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';
import { TIPO_APARTADO } from '../requests/request/enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../requests/request/enum/modification.enum';

@Component({
  selector: 'app-requests-review',
  templateUrl: './requests-review.component.html',
  styleUrls: ['./requests-review.component.scss'],
})
export class RequestsReviewComponent extends RequestTbl implements OnInit {
  ls = new SecureLS({ encodingType: 'aes' });
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  submitingFilters: boolean = false;
  override actions: TableActionsI = {
    view: false,
    custom: [
      {
        id: 'viewPdf',
        name: 'Visualizar y Descargar Documento de la solicitud',
        icon: 'picture_as_pdf',
        color: 'primary',
      },
      {
        id: 'validation',
        icon: 'fact_check',
        name: 'Validación',
      },
    ],
  };

  constructor(
    private _router: Router,
    private _formBuilder: QuestionControlService,
    private solicitudSeguimientoService: SolicitudSeguimientoService,
    private catalogService: CatalogsService,
    private modalService: ModalService,
    private alertService: AlertService
  ) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.buildForm();
    this.getCatalogs();
    this.submit();
  }

  ngOnInit() {
    this.ls.remove('selectedSolicitudValidate');
  }

  buildForm(): void {
    this.questions = [
      new DateQuestion({
        nane: 'fechaSolicitud',
        label: 'Fecha de Solicitud',
        validators: [Validators.maxLength(200)],
      }),
      new DateQuestion({
        nane: 'fechaAutorizacion',
        label: 'Fecha de Autorización',
        validators: [Validators.maxLength(200)],
      }),
      new DropdownQuestion({
        nane: 'unidad',
        label: 'Unidad',
        filter: true,
        options: [
          {
            id: 'Unidad de Evaluación Diagnóstica',
            value: 'Unidad de Evaluación Diagnóstica',
          },
        ],
        validators: [Validators.maxLength(200)],
      }),
      new NumberQuestion({
        nane: 'anio',
        label: 'Año',
        value: +this.yearNav,
        validators: [],
      }),
      new DropdownQuestion({
        nane: 'tipoAdecuacion',
        label: 'Tipo de Adecuación',
        filter: true,
        options: [],
        validators: [Validators.maxLength(200)],
      }),
      new DropdownQuestion({
        nane: 'tipoModificacion',
        label: 'Tipo de Modificación',
        filter: true,
        multiple: true,
        options: [],
        validators: [Validators.maxLength(200)],
      }),
      new DropdownQuestion({
        nane: 'estatus',
        label: 'Estatus',
        filter: true,
        options: [
          {
            id: 2236,
            value: 'Pre-registro',
          },
          {
            id: 2237,
            value: 'Registrado',
          },
          {
            id: 2238,
            value: 'En Revisión',
          },
          {
            id: 2239,
            value: 'Rechazado',
          },
          {
            id: 2240,
            value: 'Validado',
          },
          {
            id: 2241,
            value: 'Formulado',
          },
        ],
        validators: [Validators.maxLength(200)],
      }),
    ];

    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadAdministrativa']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoAdecuacion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoModificacion']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataClave, dataAdecuacion, dataModificacion]) => {
        // COMMENT: unidad
        this.questions[2].options = mapCatalogData({
          data: dataClave,
        });

        // COMMENT: tipoAdecuacion
        this.questions[4].options = mapCatalogData({
          data: dataAdecuacion,
        });

        // COMMENT: tipoModificacion
        this.questions[5].options = mapCatalogData({
          data: dataModificacion,
        });
      });
  }

  submit() {
    this.submitingFilters = true;
    const dataFilters: IConsultaPorFiltrosPayload = {
      // cambiaIndicadores: false,
    };
    const {
      fechaSolicitud,
      fechaAutorizacion,
      unidad,
      anio,
      tipoAdecuacion,
      tipoModificacion,
      estatus,
    } = this.form.getRawValue();
    if (fechaSolicitud)
      dataFilters.fechaSolicitud = moment(fechaSolicitud).format('YYYY-MM-DD');
    if (fechaAutorizacion)
      dataFilters.fechaAutorizacion =
        moment(fechaAutorizacion).format('YYYY-MM-DD');
    if (unidad) dataFilters.idCatalogoUnidad = unidad;
    if (anio) dataFilters.idCatalogoAnhio = anio;
    if (tipoAdecuacion) dataFilters.idCatalogoAdecuacion = tipoAdecuacion;
    if (tipoModificacion) dataFilters.idCatalogoModificacion = tipoModificacion;
    if (estatus) dataFilters.idCatalogoEstatus = estatus;

    this.solicitudSeguimientoService
      .consultaPorFiltros(this.dataUser.cveUsuario, dataFilters)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.submitingFilters = false;
          if (value.codigo === '200' && value.respuesta.length) {
            this.data = value.respuesta
              .filter((item) => {
                if (
                  this.dataUser.idTipoUsuario === 'ENLACE' &&
                  item.unidadId ===
                  this.dataUser.perfilLaboral.idCatalogoUnidad &&
                  item.estatusId !== 2236 &&
                  item.estatusId !== 2237 &&
                  item.estatusId !== 2242
                  //   &&
                  // ((item.adecuacionId ===
                  //   TIPO_ADECUACION.programaticaPresupuestal &&
                  //   ((item.estatusId === 2239 &&
                  //     item.estatusIdPlaneacion === 2239) ||
                  //     (item.estatusId === 2271 &&
                  //       item.estatusIdPlaneacion === 2239) ||
                  //     (item.estatusId === 2239 &&
                  //       item.estatusIdPlaneacion === 2271))) ||
                  //   ((item.adecuacionId === TIPO_ADECUACION.presupuestal ||
                  //     item.adecuacionId === TIPO_ADECUACION.programatica) &&
                  //     item.estatusId === 2239))
                ) {
                  return true;
                } else if (
                  this.dataUser.idTipoUsuario === 'PLANEACION' &&
                  item.unidadId ===
                  this.dataUser.perfilLaboral.idCatalogoUnidad &&
                  item.estatusId !== 2236 &&
                  item.estatusId !== 2237 &&
                  item.estatusId !== 2242
                  // &&
                  // ((item.adecuacionId ===
                  //   TIPO_ADECUACION.programaticaPresupuestal &&
                  //   (item.estatusIdPlaneacion === 92672 ||
                  //     item.estatusIdPlaneacion === 2238)) ||
                  //   ((item.adecuacionId === TIPO_ADECUACION.presupuestal ||
                  //     item.adecuacionId === TIPO_ADECUACION.programatica) &&
                  //     (item.estatusId === 2238 || item.estatusId === 92672)))
                ) {
                  return true;
                } else if (
                  this.dataUser.idTipoUsuario === 'PRESUPUESTO' &&
                  item.unidadId ===
                  this.dataUser.perfilLaboral.idCatalogoUnidad &&
                  item.estatusId !== 2236 &&
                  item.estatusId !== 2237 &&
                  item.estatusId !== 2242
                  //   &&
                  // (item.adecuacionId ===
                  //   TIPO_ADECUACION.programaticaPresupuestal ||
                  //   item.adecuacionId === TIPO_ADECUACION.presupuestal) &&
                  // (item.estatusId === 2238 || item.estatusId === 92672)
                ) {
                  return true;
                } else if (
                  this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                  this.dataUser.perfilLaboral?.ixNivel === 1 &&
                  item.estatusId !== 2236 &&
                  item.estatusId !== 2237 &&
                  item.estatusId !== 2242
                  // ((item.adecuacionId ===
                  //   TIPO_ADECUACION.programaticaPresupuestal &&
                  //   item.estatusId === 2271 &&
                  //   item.estatusIdPlaneacion === 2271) ||
                  //   ((item.adecuacionId === TIPO_ADECUACION.programatica ||
                  //     item.estatusIdPlaneacion ===
                  //     TIPO_ADECUACION.presupuestal) &&
                  //     item.estatusId === 2271))
                ) {
                  return true;
                } else if (
                  this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                  this.dataUser.perfilLaboral?.ixNivel === 2 &&
                  item.estatusId !== 2236 &&
                  item.estatusId !== 2237 &&
                  item.estatusId !== 2242
                  // item.estatusId === 2241
                ) {
                  return true;
                } else if (
                  this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                  this.dataUser.perfilLaboral?.ixNivel === 3 &&
                  item.estatusId !== 2236 &&
                  item.estatusId !== 2237 &&
                  item.estatusId !== 2242
                  // item.estatusId === 2244
                ) {
                  return true;
                } else if (
                  // COMMENT: en caso de afectacion en la MIR
                  // FIX: Agregar validacion cuando es afectacion de la MIR
                  this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                  this.dataUser.perfilLaboral?.ixNivel === 4 &&
                  item.estatusId !== 2236 &&
                  item.estatusId !== 2237 &&
                  item.estatusId !== 2242 &&
                  item.estatusId === 2240 &&
                  item.cambiaIndicadores
                  // item.estatusId === 2240
                ) {
                  return true;
                } else if (
                  this.dataUser.idTipoUsuario === 'ADMINISTRADOR' ||
                  this.dataUser.idTipoUsuario === 'CONSULTOR'
                ) {
                  return true;
                } else return false;
              })
              .map((item) => {
                const booleanStatus = this.getValidation(item);
                return {
                  ...item,
                  // cxUUID: 'cdf10fff-badd-4789-ab84-fd0ea3ebd351',
                  tipoModificacion: getTiposModificacion(item.adecuaciones),
                  fSolicitud: item.fechaSolicitud
                    ? moment(item.fechaSolicitud, 'YYYY-MM-DD').format(
                      'DD/MM/YYYY'
                    )
                    : '',
                  fAutorizacion: item.fechaAutorizacion
                    ? moment(item.fechaAutorizacion, 'YYYY-MM-DD').format(
                      'DD/MM/YYYY'
                    )
                    : '',
                  status: getGlobalStatusSeguimiento(
                    // 2239,
                    // item.estatusId,
                    this.dataUser.idTipoUsuario === 'ENLACE' && booleanStatus
                      ? 2239
                      : // : this.dataUser.idTipoUsuario === 'PLANEACION'
                      //   ? item.estatusIdPlaneacion ?? 92672
                      item.estatusId,
                    'string',
                    this.dataUser.cveUsuario
                  ),
                };
              })
              .reverse();
          }
        },
        error: (err) => {
          this.submitingFilters = false;
          this.data = [];
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case 'validation':
        this.handleHandle(event.value);
        break;
      case 'viewPdf':
        if (event.value.cxUUID) {
          this.modalService.openGenericModal({
            idModal: 'modal-disabled',
            component: 'viewerPdf',
            data: {
              title: 'Visualización del Documento de la Solicitud',
              sourceFromAlfresco: event.value.cxUUID,
              propertiesViewerPdf: '#toolbar=0&navpanes=0&scrollbar=0',
              sourceType: 'resourceUrl',
              downloadFile: {
                type: 'alfresco',
                uuidFile: event.value.cxUUID,
                name: `DocumentoDeLaSolicitud.pdf`,
              },
            },
          });
        } else {
          this.alertService.showAlert('No se Encontro el Documento');
        }
        break;
    }
  }

  async handleHandle(selectedSolicitud: IItemConsultaSolicitudResponse) {
    let statusToValidate = 0;
    if (selectedSolicitud.adecuacionId === TIPO_ADECUACION.programatica) {
      statusToValidate = selectedSolicitud.estatusId;
    } else {
      statusToValidate =
        this.dataUser.idTipoUsuario === 'PLANEACION'
          ? selectedSolicitud.estatusIdPlaneacion
          : selectedSolicitud.estatusId;
    }

    if (statusToValidate === 92672) {
      this.solicitudSeguimientoService
        .cambiarEstatusSolicitud(
          getGlobalStatusSeguimiento('E', 'number'),
          selectedSolicitud.idSolicitud ?? 0,
          this.dataUser.cveUsuario
        )
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200') {
              this.ls.set('selectedSolicitudValidate', selectedSolicitud);
              this._router.navigate([
                '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Revisión de Solicitudes/Estado',
              ]);
            }
          },
          error: (err) => { },
        });
    } else {
      this.ls.set('selectedSolicitudValidate', selectedSolicitud);
      this._router.navigate([
        '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Revisión de Solicitudes/Estado',
      ]);
    }
  }

  consultaSolicitudPorId(
    idSolicitud: number
  ): Promise<IItemConsultaSolicitudResponse> {
    return new Promise<IItemConsultaSolicitudResponse>((resolve, reject) => {
      this.solicitudSeguimientoService
        .consultaPorIdSolicitud(idSolicitud)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200') {
              resolve(value.respuesta);
            }
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  showActionIf = (action: string, value: any) => {
    if (action === 'viewPdf') {
      return true;
    }

    if (action === 'validation') {
      if (this.getValidation(value)) {
        return true;
      }
    }

    return false;
  };

  getValidation(value: any): boolean {
    switch (this.dataUser.idTipoUsuario) {
      case 'ENLACE':
        return (
          (value.adecuacionId === TIPO_ADECUACION.programaticaPresupuestal &&
            ((value.estatusId === 2239 && value.estatusIdPlaneacion === 2239) ||
              (value.estatusId === 2271 &&
                value.estatusIdPlaneacion === 2239) ||
              (value.estatusId === 2239 &&
                value.estatusIdPlaneacion === 2271))) ||
          ((value.adecuacionId === TIPO_ADECUACION.presupuestal ||
            value.adecuacionId === TIPO_ADECUACION.programatica) &&
            value.estatusId === 2239)
        );
      case 'PLANEACION':
        return (
          (value.adecuacionId === TIPO_ADECUACION.programaticaPresupuestal &&
            (value.estatusIdPlaneacion === 92672 ||
              value.estatusIdPlaneacion === 2238)) ||
          ((value.adecuacionId === TIPO_ADECUACION.presupuestal ||
            value.adecuacionId === TIPO_ADECUACION.programatica) &&
            (value.estatusId === 2238 || value.estatusId === 92672))
        );
      case 'PRESUPUESTO':
        return (
          (value.adecuacionId === TIPO_ADECUACION.programaticaPresupuestal ||
            value.adecuacionId === TIPO_ADECUACION.presupuestal) &&
          (value.estatusId === 2238 || value.estatusId === 92672)
        );
      case 'SUPERVISOR': {
        if (this.dataUser.perfilLaboral?.ixNivel === 1) {
          return (
            (value.adecuacionId === TIPO_ADECUACION.programaticaPresupuestal &&
              value.estatusId === 2271 &&
              value.estatusIdPlaneacion === 2271) ||
            ((value.adecuacionId === TIPO_ADECUACION.programatica ||
              value.estatusIdPlaneacion === TIPO_ADECUACION.presupuestal) &&
              value.estatusId === 2271)
          );
        }
        if (
          this.dataUser.perfilLaboral?.ixNivel === 2 &&
          value.estatusId === 2241
        ) {
          return true;
        }
        if (
          this.dataUser.perfilLaboral?.ixNivel === 3 &&
          value.estatusId === 2244
        ) {
          return true;
        }
        if (
          this.dataUser.perfilLaboral?.ixNivel === 4 &&
          value.estatusId === 2240 &&
          value.cambiaIndicadores
        ) {
          return true;
        }
        return false;
      }
      default:
        return false;
    }
  }

  showActionIfBack = (action: string, value: any) => {
    const idAdeProductoAlta = getIdAdecuancionSolicitud({
      selectedSolicitud: value,
      tipoApartado: TIPO_APARTADO.productos,
      tipoModificacion: MODIFICATION_TYPE.alta,
    });
    const idAdeProductoModificacion = getIdAdecuancionSolicitud({
      selectedSolicitud: value,
      tipoApartado: TIPO_APARTADO.productos,
      tipoModificacion: MODIFICATION_TYPE.modificacion,
    });
    const idAdeProductoCancelacion = getIdAdecuancionSolicitud({
      selectedSolicitud: value,
      tipoApartado: TIPO_APARTADO.productos,
      tipoModificacion: MODIFICATION_TYPE.cancelacion,
    });

    const idTipoUsuario = this.dataUser.idTipoUsuario;
    let nivel = 0;
    if (idTipoUsuario === 'SUPERVISOR')
      nivel = this.dataUser.perfilLaboral.ixNivel;

    if (value.adecuacionId === TIPO_ADECUACION.programatica) {
      if (
        idTipoUsuario === 'PLANEACION' ||
        (idTipoUsuario === 'SUPERVISOR' &&
          (nivel === 1 || nivel === 2 || nivel === 3)) ||
        (idTipoUsuario === 'SUPERVISOR' &&
          nivel === 4 &&
          (idAdeProductoAlta ||
            idAdeProductoModificacion ||
            idAdeProductoCancelacion))
      ) {
        if (action === 'validation') return true;
      }
    }

    if (value.adecuacionId === TIPO_ADECUACION.programaticaPresupuestal) {
      if (
        idTipoUsuario === 'PLANEACION' ||
        idTipoUsuario === 'PRESUPUESTO' ||
        (idTipoUsuario === 'SUPERVISOR' &&
          (nivel === 1 || nivel === 2 || nivel === 3)) ||
        (idTipoUsuario === 'SUPERVISOR' &&
          nivel === 4 &&
          (idAdeProductoAlta ||
            idAdeProductoModificacion ||
            idAdeProductoCancelacion))
      ) {
        if (action === 'validation') return true;
      }
    }

    if (value.adecuacionId === TIPO_ADECUACION.presupuestal) {
      if (
        idTipoUsuario === 'PRESUPUESTO' ||
        (idTipoUsuario === 'SUPERVISOR' &&
          (nivel === 1 || nivel === 2 || nivel === 3))
      ) {
        if (action === 'validation') return true;
      }
    }

    return false;
  };
}
