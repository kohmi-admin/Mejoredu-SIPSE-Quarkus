import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import html2pdf from 'html2pdf.js';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { RequestTbl } from './request/classes/request-tbl.class';
import { DateQuestion } from '@common/form/classes/question-date.class';
import { SolicitudSeguimientoService } from '@common/services/seguimiento/solicitud-seguimiento.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  getGlobalStatusSeguimiento,
  getTiposModificacion,
} from '@common/utils/Utils';
import { IConsultaPorFiltrosPayload } from '@common/interfaces/seguimiento/consultaPorFiltros.interface';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import * as moment from 'moment';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  TableConsts,
  TableActionsI,
} from '@common/mat-custom-table/consts/table';
import { ModalService } from '@common/modal/modal.service';
import { AlertService } from '@common/services/alert.service';
import { ExcelJsService } from '@common/services/exceljs.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent extends RequestTbl {
  ls = new SecureLS({ encodingType: 'aes' });
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  makingReport: boolean = false;
  reportName: string = 'Reporte general de solicitudes de adecuaciones';
  override data: any[] = [];
  submitingFilters: boolean = false;
  override actions: TableActionsI = {
    view: false,
    edit: true,
    delete: true,
    custom: [
      {
        id: 'viewPdf',
        name: 'Visualizar y Descargar Documento de la solicitud',
        icon: 'picture_as_pdf',
        color: 'primary',
      },
    ],
  };
  canEdit: boolean = true;

  constructor(
    private _router: Router,
    private _formBuilder: QuestionControlService,
    private solicitudSeguimientoService: SolicitudSeguimientoService,
    private catalogService: CatalogsService,
    private modalService: ModalService,
    private alertService: AlertService,
    private excelService: ExcelJsService
  ) {
    super();
    this.canEdit = this.ls.get('canEdit');
    if (!this.canEdit) {
      this.actions.edit = false;
      this.actions.delete = false;
    }
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.createQuestions();
    this.getCatalogs();
    this.submit();
  }

  createQuestions() {
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
        options: [],
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
        dataClave.catalogo = dataClave.catalogo.filter((itemFilter) => {
          if (
            (this.dataUser.idTipoUsuario === 'ENLACE' ||
              this.dataUser.idTipoUsuario === 'PLANEACION' ||
              this.dataUser.idTipoUsuario === 'PRESUPUESTO') &&
            this.dataUser.perfilLaboral.cveUnidad === itemFilter.ccExterna
          ) {
            return true;
          }
          if (
            this.dataUser.idTipoUsuario === 'ADMINISTRADOR' ||
            this.dataUser.idTipoUsuario === 'SUPERVISOR' ||
            this.dataUser.idTipoUsuario === 'CONSULTOR'
          ) {
            return true;
          }
          return false;
        });
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
    const dataFilters: IConsultaPorFiltrosPayload = {};
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
              .filter(
                (item) => item.estatusId === 2236 || item.estatusId === 2237
              )
              .map((item) => {
                return {
                  ...item,
                  tipoModificacion: getTiposModificacion(item.adecuaciones),
                  fSolicitud: this.convertFecha(item.fechaSolicitud ?? ''),
                  fAutorizacion: this.convertFecha(
                    item.fechaAutorizacion ?? ''
                  ),
                  status: getGlobalStatusSeguimiento(
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
      case TableConsts.actionButton.edit:
        this.solicitudSeguimientoService
          .consultaPorIdSolicitud(event.value.idSolicitud)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.codigo === '200') {
                this.ls.set('selectedSolicitud', value.respuesta);
                this._router.navigate([
                  '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Solicitudes/Editar',
                ]);
              }
            },
          });
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this.alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Solicitud?',
          });
          if (confirm) {
            this.solicitudSeguimientoService
              .cambiarEstatusSolicitud(
                2242,
                event.value.idSolicitud,
                this.dataUser.cveUsuario
              )
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this.submit();
                    this.alertService.showAlert('Se Eliminó Correctamente');
                  }
                },
              });
          }
        }
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

  convertFecha(fecha: string) {
    if (fecha) {
      const splitFecha = fecha.split('-');
      return `${splitFecha[2]}/${splitFecha[1]}/${splitFecha[0]}`;
    } else {
      return '';
    }
  }

  newSolicitud() {
    this.ls.remove('selectedSolicitud');
    this.ls.remove('selectedProyecto');
    this.ls.remove('selectedSolicitudFromValidate');
  }

  showActionIf = (action: string, value: any) => {
    if (
      this.dataUser.idTipoUsuario === 'CONSULTOR' &&
      (action === 'edit' || action === 'delete')
    ) {
      return false;
    }
    return true;
  };

  downloadExcel() {
    this.excelService.createExcelSolicitudesAdecuaciones(this.data);
  }

  async descargar(): Promise<void> {
    this.makingReport = true;
    let page: any = document.getElementById('report-space');
    const opt = {
      filename: this.reportName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' },
      margin: 20,
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    html2pdf()
      .set(opt)
      .from(page)
      .save()
      .then(() => {
        this.makingReport = false;
      });
  }
}
