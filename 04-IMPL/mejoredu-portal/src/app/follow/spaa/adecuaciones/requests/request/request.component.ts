import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { SwitchI } from './general-data/interfaces/switch.interface';
import { switches } from './general-data/utils/switches.const';
import { actived } from './general-data/classes/switch-manage.class';
import { QuestionBase } from '@common/form/classes/question-base.class';
import * as moment from 'moment';
import { RequestTbl } from './classes/request-tbl.class';
import { TableColumn } from '@common/models/tableColumn';
import { cancelationQuestions } from './cancelation/collections';
import { MODIFICATION_TYPE } from './enum/modification.enum';
import { SolicitudSeguimientoService } from '@common/services/seguimiento/solicitud-seguimiento.service';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  getGlobalStatusSeguimiento,
  getTiposModificacion,
} from '@common/utils/Utils';
import { IItemConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { IConsultaPorFiltrosPayload } from '@common/interfaces/seguimiento/consultaPorFiltros.interface';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { Router } from '@angular/router';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  TableConsts,
  TableActionsI,
} from '@common/mat-custom-table/consts/table';
import { AlertService } from '@common/services/alert.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import { ModalService } from '@common/modal/modal.service';
import { GoalsService } from '@common/services/goals.service';
import { StrategiesService } from '@common/services/strategies.service';
import { ActionsService } from '@common/services/actions.service';
import { P016MirService } from '@common/services/budget/p016/mir.service';
import { ParametersService } from '@common/services/medium-term/parameters.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent extends RequestTbl {
  ls = new SecureLS({ encodingType: 'aes' });
  @Input() switches: SwitchI[] = switches;
  form = new FormGroup({
    folioSolicitudSecond: new FormControl<string>('000'),
    fecha: new FormControl<string>(moment().format('DD/MM/YYYY')),
  });
  questions: QuestionBase<any>[] = [];
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  folioSolicitudFirst: string = '00-000-000-';
  override columns: TableColumn[] = [
    {
      columnDef: 'folioSolicitud',
      header: 'Folio de Solicitud',
      alignLeft: true,
      width: '155px',
    },
    {
      columnDef: 'fSolicitud',
      header: 'Fecha de Solicitud',
      width: '110px',
    },
    { columnDef: 'unidad', header: 'Unidad', alignLeft: true },
    { columnDef: 'anhio', header: 'Año', alignLeft: true, width: '55px' },
    {
      columnDef: 'tipoAdecuacion',
      header: 'Tipo de Adecuación',
      alignLeft: true,
    },
    {
      columnDef: 'tipoModificacion',
      header: 'Tipo de Modificación',
      alignLeft: true,
    },
    {
      columnDef: 'montoAplicacion',
      header: 'Monto de Aplicación',
      alignLeft: true,
    },
    { columnDef: 'status', header: 'Estatus', alignRight: true },
  ];
  cancelationQuestions = cancelationQuestions;
  modificationType = MODIFICATION_TYPE;
  tipoAdecuacion = 0;
  actived = actived;
  projectsByAnhoCPAndS: any[] = [];
  projectsByAnhoCP: any[] = [];
  catUnidad = {
    ccExterna: '2100',
    descripcion: 'Unidad de Evaluación Diagnóstica',
  };
  submitingFinalize: boolean = false;
  submitingRevision: boolean = false;
  showSteps: boolean = true;
  steps = {
    general: true,
    projects: false,
    activities: false,
    products: false,
    actions: false,
    budges: false,
  };

  catDireccionGeneralR!: ICatalogResponse;
  catTipoAdecuacionR!: ICatalogResponse;
  catCategoriaR!: ICatalogResponse;
  catTipoProductoR!: ICatalogResponse;
  catNombreIndicadorMIRR!: ICatalogResponse;
  catIndicadorPIR!: ICatalogResponse;
  catObjetivosPrioritarioR!: ICatalogResponse;
  catContinuidadOtrosProductosAnhosAnterioresR!: ICatalogResponse;
  catAnhoPublicarR!: ICatalogResponse;
  catNivelEducativoR!: ICatalogResponse;
  catEstrategiaPrioritariaR!: ICatalogResponse;
  catAccionPuntualPIR!: ICatalogResponse;
  catAlcanceR!: ICatalogResponse;
  catClaveNombreUnidadResponsableR!: ICatalogResponse;
  catContribucionProgramasEspecialesR!: ICatalogResponse;
  catContribucionPNCCIMGPR!: ICatalogResponse;
  secuencialSeguimiento: number = 0;
  selectedSolicitudFromValidate: string = '';
  selectedSolicitud: IItemConsultaSolicitudResponse;
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

  constructor(
    private router: Router,
    private solicitudSeguimientoService: SolicitudSeguimientoService,
    private projectsSeguimientoService: ProjectsService,
    private catalogService: CatalogsService,
    private modalService: ModalService,
    private alertService: AlertService,
    private goalsService: GoalsService,
    private strategiesService: StrategiesService,
    private actionsService: ActionsService,
    private p016MirService: P016MirService,
    private parametersService: ParametersService
  ) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
    this.selectedSolicitudFromValidate = this.ls.get(
      'selectedSolicitudFromValidate'
    );
    this.getSecuencial();
    this.consultaSolicitudesSwitch();
    this.getCatalogs();
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['direccionGeneral']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoAdecuacion']
      ),
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
        environment.endpoints.catalogs['indicadorPI']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs[
        'continuidadOtrosProductosAnhosAnteriores'
        ]
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['anhoPublicar']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nivelEducativo']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['alcance']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadAdministrativa']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['contribucionProgramasEspeciales']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['contribucionPNCCIMGP']
      ),
      this.goalsService.getCatalogObjetivo(this.yearNav),
      this.strategiesService.getCatalogEstrategia(this.yearNav),
      this.actionsService.getCatalogAccion(this.yearNav),
      this.p016MirService.getCatalogMir(this.yearNav),
      this.parametersService.getCatalogPi(this.yearNav),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(
        ([
          dataDireccionGeneral,
          dataTipoAdecuacion,
          dataCategoria,
          dataTipoProducto,
          dataNombreIndicadorMIR,
          dataIndicadorPI,
          dataContinuidadOtrosProductosAnhosAnteriores,
          dataAnhoPublicar,
          dataNivelEducativo,
          dataAlcance,
          dataClaveNombreUnidadResponsable,
          dataContribucionProgramasEspeciales,
          dataContribucionPNCCIMGP,
          dataObjetivosPrioritarioAnhio,
          dataEstrategiaPrioritariaAnhio,
          dataAccionPuntualPIAnhio,
          dataIndicadorMIRAnhio,
          dataIndicadorPIAnhio,
        ]) => {
          this.catDireccionGeneralR = dataDireccionGeneral;
          this.catTipoAdecuacionR = dataTipoAdecuacion;
          this.catCategoriaR = dataCategoria;
          this.catTipoProductoR = dataTipoProducto;
          this.catObjetivosPrioritarioR = dataObjetivosPrioritarioAnhio;
          this.catContinuidadOtrosProductosAnhosAnterioresR =
            dataContinuidadOtrosProductosAnhosAnteriores;
          this.catAnhoPublicarR = dataAnhoPublicar;
          this.catNivelEducativoR = dataNivelEducativo;
          this.catEstrategiaPrioritariaR = dataEstrategiaPrioritariaAnhio;
          this.catAccionPuntualPIR = dataAccionPuntualPIAnhio;
          this.catAlcanceR = dataAlcance;
          this.catClaveNombreUnidadResponsableR =
            dataClaveNombreUnidadResponsable;
          this.catContribucionProgramasEspecialesR =
            dataContribucionProgramasEspeciales;
          this.catContribucionPNCCIMGPR = dataContribucionPNCCIMGP;
          this.catNombreIndicadorMIRR = dataIndicadorMIRAnhio;
          this.catIndicadorPIR = dataIndicadorPIAnhio;
        }
      );
  }

  getSecuencial() {
    this.solicitudSeguimientoService
      .getSecuencialSeguimiento(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.secuencialSeguimiento = value.respuesta;
            this.setFolio(value.respuesta);
          }
        },
      });
  }

  setFolio(secuencial: number) {
    const anhio = this.yearNav.substring(2, 4);
    const unidad = this.dataUser.perfilLaboral.cxDgAdministracion;
    this.folioSolicitudFirst = `${anhio}-${unidad}-${secuencial
      .toString()
      .padStart(3, '0')}-`;
  }

  changeStep(event: any) {
    const from =
      event?.selectedStep?.content?.elementRef?.nativeElement?.parentElement
        ?.id;

    if (from) {
      for (const key in this.steps) {
        if (Object.hasOwn(this.steps, key)) {
          this.steps[key] = false;
        }
      }
      this.steps[from] = true;
    }
  }

  getCompleteFolio() {
    return (
      this.folioSolicitudFirst + this.form.get('folioSolicitudSecond')?.value
    );
  }

  consultaSolicitudesSwitch() {
    if (this.selectedSolicitudFromValidate) {
      this.consultaSolicitudPorId(this.selectedSolicitud.idSolicitud ?? 0);
    } else {
      this.consultaPorFiltros();
    }
  }

  onSaveSolicitud() {
    this.consultaPorFiltros();
  }

  consultaPorFiltros() {
    const dataFilters: IConsultaPorFiltrosPayload = {
      idCatalogoAnhio: +this.yearNav,
    };
    this.solicitudSeguimientoService
      .consultaPorFiltros(this.dataUser.cveUsuario, dataFilters)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta.length) {
            this.data = value.respuesta
              .filter(
                (item) => item.estatusId === 2236 || item.estatusId === 2237
              )
              .map((item) => {
                return {
                  ...item,
                  tipoModificacion: getTiposModificacion(item.adecuaciones),
                  fSolicitud: moment(item.fechaSolicitud, 'YYYY-MM-DD').format(
                    'DD/MM/YYYY'
                  ),
                  fAutorizacion: moment(
                    item.fechaSolicitud,
                    'YYYY-MM-DD'
                  ).format('DD/MM/YYYY'),
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
          this.data = [];
        },
      });
  }

  consultaSolicitudPorId = (
    idSolicitud: number,
    exeFuntion?: () => void
  ): void => {
    this.solicitudSeguimientoService
      .consultaPorIdSolicitud(idSolicitud)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.ls.set('selectedSolicitud', value.respuesta);
            this.data = [
              {
                ...value.respuesta,
                tipoModificacion: getTiposModificacion(
                  value.respuesta.adecuaciones
                ),
                fSolicitud: moment(
                  value.respuesta.fechaSolicitud,
                  'YYYY-MM-DD'
                ).format('DD/MM/YYYY'),
                fAutorizacion: moment(
                  value.respuesta.fechaSolicitud,
                  'YYYY-MM-DD'
                ).format('DD/MM/YYYY'),
                status: getGlobalStatusSeguimiento(
                  value.respuesta.estatusId,
                  'string',
                  this.dataUser.cveUsuario
                ),
              },
            ];
            if (exeFuntion) {
              exeFuntion();
            }
          }
        },
      });
  };

  getProjectsByAnho() {
    this.projectsSeguimientoService
      .getProjectByAnnio(this.yearNav, '2')
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        const tmpData: IItemProjectsResponse[] = [];
        for (const item of response.respuesta) {
          if (item.estatus === 'C') {
            tmpData.push(item);
          }
        }
        this.projectsByAnhoCPAndS = tmpData;
      });
  }

  getSwitchFromType(type: string): SwitchI {
    return this.switches.find((sw: SwitchI) => sw.type === type) as SwitchI;
  }

  checkIfSwitchIsEnabled(type: string): boolean {
    const sw: SwitchI = this.getSwitchFromType(type);
    const selectedSolicitud = this.ls.get('selectedSolicitud');
    return (
      (sw.alta.value ||
        sw.modificacion.value ||
        sw.cancelacion.value ||
        sw.ampliacion.value ||
        sw.reduccion.value ||
        sw.reintegro.value ||
        sw.traspaso.value) &&
      selectedSolicitud
    );
  }

  checkIfSomeSwitchIsEnabled(): boolean {
    return this.switches.some((sw: SwitchI) =>
      this.checkIfSwitchIsEnabled(sw.type)
    );
  }

  onResponseSolicitud(event: IItemConsultaSolicitudResponse) {
    const splitFolio = event.folioSolicitud.split('-');
    this.folioSolicitudFirst = `${splitFolio[0]}-${splitFolio[1]}-${splitFolio[2]}-`;
    this.form.get('folioSolicitudSecond')?.setValue(splitFolio[3]);
    this.form.get('fecha')?.setValue(this.convertFecha(event.fechaSolicitud));
    if (event.estatusId === 2237 || event.ibExisteInfo > 0) {
      this.form.get('folioSolicitudSecond')?.disable();
    } else {
      this.form.get('folioSolicitudSecond')?.enable();
    }
  }

  async changeStatusAdecuacion(from: 'finalizar' | 'revision') {
    const selectedSolicitud: IItemConsultaSolicitudResponse =
      this.ls.get('selectedSolicitud');
    let status = 0;
    let message = '';
    if (from === 'finalizar') {
      this.submitingFinalize = true;
      status = getGlobalStatusSeguimiento(
        'S',
        'number',
        this.dataUser.cveUsuario
      );
      message = '¿Está Seguro de Finalizar la Solicitud?';
    }
    if (from === 'revision') {
      this.submitingRevision = true;
      status = getGlobalStatusSeguimiento(
        'P',
        'number',
        this.dataUser.cveUsuario
      );
      message = '¿Está Seguro de Enviar a Revisión la Solicitud?';
    }

    const confirm = await this.alertService.showConfirmation({ message });
    if (confirm) {
      this.solicitudSeguimientoService
        .cambiarEstatusSolicitud(
          status,
          selectedSolicitud.idSolicitud ?? 0,
          this.dataUser.cveUsuario
        )
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.submitingFinalize = false;
            this.submitingRevision = false;
            if (value.mensaje.codigo === '200') {
              if (from === 'finalizar') {
                if (value.mensaje.mensaje) {
                  this.showSteps = false;
                  const exeFuntion = () => {
                    this.getSecuencial();
                    this.showSteps = true;
                    this.steps = {
                      general: true,
                      projects: false,
                      activities: false,
                      products: false,
                      actions: false,
                      budges: false,
                    };
                  };
                  if (this.selectedSolicitudFromValidate) {
                    this.consultaSolicitudPorId(
                      this.selectedSolicitud.idSolicitud ?? 0,
                      exeFuntion
                    );
                  } else {
                    this.consultaPorFiltros();
                    this.form.get('folioSolicitudSecond')?.setValue('000');
                    this.form
                      .get('fecha')
                      ?.setValue(moment().format('DD/MM/YYYY'));
                    this.ls.remove('selectedSolicitud');
                    setTimeout(() => {
                      exeFuntion();
                    }, 10);
                  }
                  this.modalService.openGenericModal({
                    idModal: 'modal-disabled',
                    component: 'viewerPdf',
                    data: {
                      title: 'Visualización del Documento de la Solicitud',
                      sourceFromAlfresco: value.mensaje.mensaje,
                      propertiesViewerPdf: '#toolbar=0&navpanes=0&scrollbar=0',
                      sourceType: 'resourceUrl',
                      downloadFile: {
                        type: 'alfresco',
                        uuidFile: value.mensaje.mensaje,
                        name: `DocumentoDeLaSolicitud.pdf`,
                      },
                    },
                  });
                  this.alertService.showAlert('Se Finalizó Correctamente');
                }
              }
              if (from === 'revision') {
                this.alertService.showAlert(
                  'Se Envió a Revisión Correctamente'
                );
                if (this.selectedSolicitudFromValidate) {
                  this.router.navigateByUrl(
                    '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Revisión de Solicitudes'
                  );
                } else {
                  this.router.navigateByUrl(
                    '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Solicitudes'
                  );
                }
              }
            }
          },
          error: (err) => {
            this.submitingFinalize = false;
            this.submitingRevision = false;
          },
        });
    } else {
      this.submitingFinalize = false;
      this.submitingRevision = false;
    }
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        break;
      case TableConsts.actionButton.edit:
        this.showSteps = false;
        this.solicitudSeguimientoService
          .consultaPorIdSolicitud(event.value.idSolicitud)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.codigo === '200') {
                this.form
                  .get('fecha')
                  ?.setValue(
                    moment(value.respuesta.fechaSolicitud, 'YYYY-MM-DD').format(
                      'DD/MM/YYYY'
                    )
                  );
                this.ls.set('selectedSolicitud', value.respuesta);
                if (value.respuesta.estatusId === 2237) {
                  this.form.get('folioSolicitudSecond')?.disable();
                } else {
                  this.form.get('folioSolicitudSecond')?.enable();
                }
              }
              this.steps = {
                general: true,
                projects: false,
                activities: false,
                products: false,
                actions: false,
                budges: false,
              };
              this.showSteps = true;
            },
            error: (err) => {
              this.steps = {
                general: true,
                projects: false,
                activities: false,
                products: false,
                actions: false,
                budges: false,
              };
              this.showSteps = true;
            },
          });
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this.alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Solicitud?',
          });
          if (confirm) {
            this.showSteps = false;
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
                    this.consultaPorFiltros();

                    this.ls.remove('selectedSolicitud');
                    this.steps = {
                      general: true,
                      projects: false,
                      activities: false,
                      products: false,
                      actions: false,
                      budges: false,
                    };
                    this.showSteps = true;
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

  showBtnFinalizar(): boolean {
    const selectedSolicitud: IItemConsultaSolicitudResponse =
      this.ls.get('selectedSolicitud');
    return (
      selectedSolicitud?.estatusId === 2236 ||
      selectedSolicitud?.estatusId === 2239
    );
  }

  showBtnRevision(): boolean {
    const selectedSolicitud: IItemConsultaSolicitudResponse =
      this.ls.get('selectedSolicitud');
    return selectedSolicitud?.estatusId === 2237;
  }

  ngOnDestroy(): void {
    this.ls.remove('selectedSolicitud');
    this.ls.remove('selectedProyecto');
    this.ls.remove('selectedSolicitudFromValidate');
    this.ls.remove('whatModuleStart');
  }
}
