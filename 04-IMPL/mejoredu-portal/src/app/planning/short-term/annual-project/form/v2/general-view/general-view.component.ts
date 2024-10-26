import { Component } from '@angular/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { ProjectsService } from '@common/services/projects.service';
import {
  IItemProjectsResponse,
  IItemVistaGeneralResponse,
} from '@common/interfaces/projects.interface';
import {
  getCveProyecto,
  getFormatDataForGeneralView,
  getFormatDataFromGeneralDataForExcel,
  getGlobalStatus,
} from '@common/utils/Utils';
import { AlertService } from '@common/services/alert.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { ExcelJsService } from '@common/services/exceljs.service';
import { ModalService } from '@common/modal/modal.service';

@Component({
  selector: 'app-general-view',
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.scss'],
})
export class GeneralViewComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  data: any[] = [];
  loading = true;
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  isSubmitingFinish: boolean = false;
  isSubmitingSend: boolean = false;
  isSubmitingReport: boolean = false;
  disabledFinish: boolean = true;
  disabledSend: boolean = true;
  disabledReport: boolean = true;
  selectedProject: IItemProjectsResponse | undefined;
  selectedProjectToTable: IItemVistaGeneralResponse | undefined;
  selectedAjustesProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  selectedConsultaProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];
  catAlcance: IItemCatalogoResponse[] = [];
  columns: TableColumn[] = [
    {
      columnDef: 'name',
      header: 'Clave y Nombre del Proyecto',
      alignLeft: true,
    },
    {
      columnDef: 'status',
      header: 'Estatus',
      width: '210px',
    },
  ];
  actions = {
    // view: true,
    custom: [
      {
        id: 'view',
        name: 'Seleccionar',
        icon: 'remove_red_eye',
        color: 'primary',
      },
    ],
  };
  private _body = document.querySelector('body');
  dataVistaGeneral: any;
  showTable: boolean = false;
  arraySecciones = ['Proyectos', 'Actividades', 'Productos', 'Presupuestos'];
  listSeccionesFaltantes: string[] = [];
  sectionsCompleted: boolean = false;

  constructor(
    private projectsService: ProjectsService,
    private _alertService: AlertService,
    private router: Router,
    private cp: CurrencyPipe,
    private catalogService: CatalogsService,
    private excelJsService: ExcelJsService,
    private modalService: ModalService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedAjustesProyectoPAA = this.ls.get('selectedAjustesProyectoPAA');
    this.selectedConsultaProyectoPAA = this.ls.get(
      'selectedConsultaProyectoPAA'
    );
    this._body?.classList.add('hideW');
    this.getCatalogs();
    this.getAll();
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.getProyectsSwitch();
    this.loading = false;
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
        environment.endpoints.catalogs['alcance']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataCategoria, dataTipoProducto, dataAlcance]) => {
        this.catCategoria = dataCategoria.catalogo;
        this.catTipoProducto = dataTipoProducto.catalogo;
        this.catAlcance = dataAlcance.catalogo;
      });
  }

  getVistaGeneral(idProject: number, yearNav?: string) {
    this.showTable = false;
    this.projectsService
      .getVistaGeneralByIdProject(
        yearNav ?? this.yearNav,
        this.dataUser.cveUsuario,
        idProject
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length) {
            this.dataVistaGeneral = getFormatDataForGeneralView({
              proyectoService: value.proyecto[0],
              selectedProject: this.selectedProject,
              catAlcance: this.catAlcance,
              catCategoria: this.catCategoria,
              catTipoProducto: this.catTipoProducto,
            });
            this.showTable = true;
          }
        },
        error: (err) => { },
      });
  }

  getProyectsSwitch() {
    if (this.selectedAjustesProyectoPAA) {
      this.getProjectsById();
    } else if (this.selectedConsultaProyectoPAA) {
      this.getProjectsConsulta();
    } else {
      this.getProjectsConsulta();
    }
  }

  getProjects() {
    this.projectsService
      .getProjectByAnnio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe(async (response) => {
        const tmpData: any[] = [];
        if (response.mensaje.codigo === '200' && response.proyecto?.length) {
          this.data = response.proyecto
            .filter(
              (item) =>
                item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad &&
                item.estatus !== 'B'
            )
            .map((item) => {
              return {
                ...item,
                name: `${getCveProyecto({
                  cveProyecto: +item.clave,
                  cveUnidad: item.claveUnidad,
                })} ${item.nombre}`,
                status: getGlobalStatus(
                  item.estatus,
                  this.dataUser.idTipoUsuario
                ),
              };
            });
          if (this.selectedProject) {
            const findedNewProyect = this.data.filter(
              (item) => item.idProyecto === this.selectedProject?.idProyecto
            );
            if (findedNewProyect.length) {
              this.selectedProject = findedNewProyect[0];
              this.onTableAction({ name: 'view', value: this.selectedProject });
            }
          }
        }
      });
  }

  getProjectsById() {
    if (this.selectedAjustesProyectoPAA)
      this.projectsService
        .getProjectById(this.selectedAjustesProyectoPAA.value.idProyecto)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200') {
              this.data = value.proyecto.map((item) => {
                return {
                  ...item,
                  name: `${getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  })} ${item.nombre}`,
                  claveNombreUnidad: `${item.claveUnidad} ${item.nombreUnidad}`,
                  // estatus: getGlobalStatus(item.estatus),
                  status: getGlobalStatus(item.estatus),
                };
              });
              this.ls.set('selectedAjustesProyectoPAA', {
                name: 'view',
                value: this.data[0],
              });
              if (this.selectedProject) {
                this.selectedProject = this.data[0];
                this.onTableAction({
                  name: 'view',
                  value: this.selectedProject,
                });
              }
            }
          },
          error: (err) => { },
        });
  }

  getProjectsConsulta() {
    this.data = [];
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.data = value.proyecto
              .filter((item) => {
                if (item.estatus !== 'B') {
                  if (
                    (this.dataUser.idTipoUsuario === 'ENLACE' ||
                      this.dataUser.idTipoUsuario === 'PLANEACION' ||
                      this.dataUser.idTipoUsuario === 'PRESUPUESTO' ||
                      (this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                        this.dataUser.perfilLaboral.ixNivel === 1)) &&
                    item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad
                  ) {
                    return true;
                  }

                  if (
                    this.dataUser.idTipoUsuario === 'ADMINISTRADOR' ||
                    this.dataUser.idTipoUsuario === 'CONSULTOR' ||
                    (this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                      this.dataUser.perfilLaboral.ixNivel != 1)
                  ) {
                    return true;
                  }
                }
                return false;
              })
              .map((item) => {
                return {
                  ...item,
                  name: `${getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  })} ${item.nombre}`,
                  status: getGlobalStatus(item.estatus),
                };
              });
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    this.selectedProject = undefined;
    this.isSubmitingFinish = false;
    this.disabledFinish = true;
    this.isSubmitingSend = false;
    this.disabledSend = true;
    this.isSubmitingReport = false;
    this.disabledReport = true;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.disabledReport = false;
        this.selectedProject = event.value;
        if (
          event.value.estatus !== 'T' &&
          (event.value.estatus === 'C' ||
            // event.value.estatus === 'V' ||
            event.value.estatus === 'R' ||
            (event.value.estatusPlaneacion === 'R' &&
              event.value.estatusPresupuesto === 'V') ||
            (event.value.estatusPlaneacion === 'V' &&
              event.value.estatusPresupuesto === 'R'))
        ) {
          this.getProyectComplete(event.value.idProyecto);
        }
        if (event.value.estatus === 'T') {
          this.disabledSend = false;
        }
        this.getVistaGeneral(event.value.idProyecto);
        break;
      case TableConsts.actionButton.delete:
        break;
    }
  }

  getProyectComplete(idProyecto: number) {
    this.listSeccionesFaltantes = [];
    this.projectsService
      .getProjectComplete(idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            const listStatus = value.respuesta;
            let totalSecciones: number = 0;
            for (const item of this.arraySecciones) {
              const findedSeccion = listStatus.filter((itemFind) =>
                item.toLowerCase().includes(itemFind.apartado.toLowerCase())
              );
              if (
                (findedSeccion.length === 1 &&
                  findedSeccion[0].estatus === 'C') ||
                (item === 'Proyectos' &&
                  findedSeccion.length === 1 &&
                  (findedSeccion[0].estatus === 'C' ||
                    findedSeccion[0].estatus === 'R' ||
                    findedSeccion[0].estatus === 'V')) ||
                (item === 'Productos' &&
                  findedSeccion.length === 2 &&
                  findedSeccion[0].estatus === 'C') ||
                (item === 'Presupuestos' && findedSeccion.length === 0)
              ) {
                totalSecciones++;
              } else {
                this.listSeccionesFaltantes.push(`- ${item}`);
              }
            }

            if (totalSecciones === 4) {
              this.sectionsCompleted = true;
            } else {
              this.sectionsCompleted = false;
            }
            this.disabledFinish = false;
            console.log("*_* sectionsCompleted: ", this.sectionsCompleted);

          }
        },
        error: (err) => { },
      });
  }

  finish() {
    if (this.selectedProject?.idProyecto) {
      if (this.sectionsCompleted) {
        this.isSubmitingFinish = true;
        this.projectsService
          .finalizarRegistro({
            id: this.selectedProject.idProyecto,
            usuario: this.dataUser.cveUsuario,
          })
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.mensaje.codigo) {
                this._alertService.showAlert(
                  'Se finalizó el registro con éxito.'
                );
                this.getProyectsSwitch();
                // this.selectedProject = undefined;
                this.isSubmitingFinish = false;
                this.disabledFinish = true;
                this.disabledReport = true;
              }
            },
            error: (err) => {
              this.isSubmitingFinish = false;
            },
          });
      } else {
        this.modalService.openGenericModal({
          idModal: 'modal-disabled',
          component: 'generic',
          data: {
            title: 'Datos faltantes',
            text: `Para finalizar el registro es necesario que complete las siguientes secciones del proyecto:`,
            listText: this.listSeccionesFaltantes,
            labelBtnPrimary: 'Aceptar',
          },
        });
      }
    }
  }

  send() {
    if (this.selectedProject?.idProyecto) {
      this.isSubmitingSend = true;
      this.projectsService
        .enviarARevision({
          id: this.selectedProject.idProyecto,
          usuario: this.dataUser.cveUsuario,
        })
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200') {
              this.showTable = false;
              this._alertService.showAlert('Se Envió a Revisión con Éxito.');
              if (this.selectedAjustesProyectoPAA) {
                this.router.navigate([
                  '/Planeación/Planeación a Corto Plazo/Ajustes',
                ]);
              } else {
                this.getProjects();
                this.selectedProject = undefined;
                this.isSubmitingSend = false;
                this.disabledSend = true;
                this.disabledReport = true;
              }
            }
          },
          error: (err) => {
            this.isSubmitingSend = false;
          },
        });
    }
  }

  getRowSpanProyecto(itemProyecto: any): number {
    let totalLength = itemProyecto.actividades.length;
    if (itemProyecto.actividades.length) {
      for (const itemActivities of itemProyecto.actividades) {
        totalLength += itemActivities.productos.length;
        if (itemActivities.productos.length) {
          for (const itemProducto of itemActivities.productos) {
            totalLength += itemProducto.acciones.length;
            if (itemProducto.acciones.length) {
              for (const itemAccion of itemProducto.acciones) {
                totalLength += itemAccion.partidasGasto.length;
              }
            }
          }
        }
      }
    }
    return totalLength + 1;
  }

  getRowSpanActividad(itemActivities: any): number {
    let totalLength = itemActivities.productos.length;
    if (itemActivities.productos.length) {
      for (const itemProducto of itemActivities.productos) {
        totalLength += itemProducto.acciones.length;
        if (itemProducto.acciones.length) {
          for (const itemAccion of itemProducto.acciones) {
            totalLength += itemAccion.partidasGasto.length;
          }
        }
      }
    }
    return totalLength + 1;
  }

  getRowSpanProducto(itemProducto: any) {
    let totalLength = itemProducto.acciones.length;
    if (itemProducto.acciones.length) {
      for (const itemAccion of itemProducto.acciones) {
        totalLength += itemAccion.partidasGasto.length;
      }
    }
    return totalLength + 1;
  }

  getRowSpanAccion(itemAccion: any) {
    return itemAccion.partidasGasto.length + 1;
  }

  getFormatMoneda(value: string) {
    return this.cp.transform(value);
  }

  getTotalByKey(key: string) {
    let total = 0;
    if (this.dataVistaGeneral.programas?.length) {
      for (const itemPrograma of this.dataVistaGeneral.programas) {
        if (itemPrograma.actividades?.length) {
          for (const itemActividad of itemPrograma.actividades) {
            if (itemActividad.productos?.length) {
              for (const itemProductos of itemActividad.productos) {
                if (itemProductos.acciones?.length) {
                  for (const itemAcciones of itemProductos.acciones) {
                    if (itemAcciones.partidasGasto?.length) {
                      for (const itemPArtida of itemAcciones.partidasGasto) {
                        total += +(itemPArtida[key] ?? 0);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return this.getFormatMoneda(`${total}`);
  }

  async exportToExcel(): Promise<void> {
    const tmpProgramas: any[] = getFormatDataFromGeneralDataForExcel(
      this.dataVistaGeneral
    );
    this.excelJsService.createExcelReporteProyectoAnual({
      dataVistaGeneral: this.dataVistaGeneral,
      data: tmpProgramas,
    });
  }

  getClaveProyecto() {
    return getCveProyecto({
      cveProyecto: this.dataVistaGeneral.cveProyecto,
      cveUnidad: this.dataVistaGeneral.cveUnidad,
      yearNav: String(this.dataVistaGeneral.anhio),
    });
  }

  getUnidadForTitle() {
    return this.selectedProject?.nombreUnidad ?? '';
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.notifier.complete();
  }
}
