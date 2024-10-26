import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { ProjectsService } from '@common/services/projects.service';
import { AlfrescoService } from '@common/services/alfresco.service';
import {
  getCveProyecto,
  getFileType,
  getFormatDataForGeneralView,
  getFormatDataFromGeneralDataForExcel,
  getGlobalStatus,
} from '@common/utils/Utils';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { SectionFilesService } from '@common/services/section-files.service';
import {
  IArchivoPayload,
  ISectionFilesPayload,
} from '@common/interfaces/section-files.interface';
import * as moment from 'moment';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import { ExcelJsService } from '@common/services/exceljs.service';

@Component({
  selector: 'app-proyecto-paa',
  templateUrl: './proyecto-paa.component.html',
  styleUrls: ['./proyecto-paa.component.scss'],
})
export class ProyectoPaaComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataAlf: ISeguridadAlfResponse;
  yearNav: string;
  notifier = new Subject();
  dataUser: IDatosUsuario;
  columns: TableColumn[] = [
    {
      columnDef: 'claveProyecto',
      header: 'Clave del proyecto',
      alignLeft: true,
    },
    { columnDef: 'nombre', header: 'Nombre del proyecto', alignLeft: true },
    { columnDef: 'estatusFull', header: 'Estatus', width: '120px' },
  ];
  columnsFileSection: TableColumn[] = [
    {
      columnDef: 'cxNombre',
      header: 'Nombre del Documento',
      alignLeft: true,
    },
  ];
  data: any[] = [];
  dataAprobados: any[] = [];
  dataPAA: any[] = [];
  dataActas: any[] = [];
  actions: TableActionsI = {
    view: true,
    custom: [
      {
        id: 'downloadAnalitico',
        icon: 'sim_card_download',
        name: 'Descargar Documento Analítico',
      },
      {
        icon: 'download',
        name: 'Descargar Reporte del Proyecto',
      },
    ],
  };
  actionsFileSection: TableActionsI = {
    custom: [
      {
        id: 'download',
        icon: 'download',
        name: 'Descargar',
      },
    ],
  };
  filesArchivosPaa: any[] = [];
  arrayFilesPaa: any[] = [];
  filesArchivosActas: any[] = [];
  arrayFilesActas: any[] = [];

  subseccionPaa: string = '0';
  subseccionActas: string = '1';

  isSubmitingFilePaa: boolean = false;
  isSubmitingFileActas: boolean = false;

  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];
  catAlcance: IItemCatalogoResponse[] = [];

  constructor(
    private _router: Router,
    private projectsService: ProjectsService,
    private alfrescoService: AlfrescoService,
    private sectionFilesService: SectionFilesService,
    private globalFuntions: GlobalFunctionsService,
    private catalogService: CatalogsService,
    private excelJsService: ExcelJsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.dataAlf = this.ls.get('dataAlf');
    if (this.dataUser.idTipoUsuario === 'ADMINISTRADOR') {
      this.actionsFileSection.delete = true;
    }
    this.getProjects();
    this.getProjectsValidar();
    this.getFileSections();
    this.getCatalogs();
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

  async handleAddFile(section: string) {
    let files: any[] = [];
    if (section === this.subseccionPaa) {
      this.isSubmitingFilePaa = true;
      files = await this.getFileToService(
        this.dataPAA.concat(this.arrayFilesPaa)
      );
    }

    if (section === this.subseccionActas) {
      this.isSubmitingFileActas = true;
      files = await this.getFileToService(
        this.dataActas.concat(this.arrayFilesActas)
      );
    }

    const tmpFiles: IArchivoPayload[] = [];
    for (const item of files) {
      tmpFiles.push({
        idArchivo: 0,
        idTipoDocumento: item.tipoArchivo,
        fechaCarga: moment().format(),
        uuid: item.uuid,
        nombre: item.nombre,
      });
    }
    const dataService: ISectionFilesPayload = {
      archivos: tmpFiles,
      idAnhio: +this.yearNav,
      subseccion: +section,
      usuario: this.dataUser.cveUsuario,
    };
    this.sectionFilesService
      .register(dataService)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: async (value) => {
          this.isSubmitingFilePaa = false;
          this.isSubmitingFileActas = false;
          if (value.codigo === '200') {
            if (section === this.subseccionPaa) {
              this.arrayFilesPaa = [];
              let inpFilePaa: any = document.getElementById('inpFilePaa');
              inpFilePaa.value = '';
              this.dataPAA = await this.getFilesBySection(this.subseccionPaa);
            }
            if (section === this.subseccionActas) {
              this.arrayFilesActas = [];
              let inpFileActas: any = document.getElementById('inpFileActas');
              inpFileActas.value = '';
              this.dataActas = await this.getFilesBySection(
                this.subseccionActas
              );
            }
          }
        },
        error: (err) => {
          this.isSubmitingFilePaa = false;
          this.isSubmitingFileActas = false;
        },
      });
  }

  getProjects() {
    this.data = [];
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.data = value.proyecto
              .filter((item) => {
                if (item.estatus !== 'B' && item.estatus !== 'O') {
                  if (
                    (this.dataUser.idTipoUsuario === 'ENLACE' ||
                      this.dataUser.idTipoUsuario === 'PLANEACION' ||
                      this.dataUser.idTipoUsuario === 'PRESUPUESTO') &&
                    item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad
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
                }
                return false;
              })
              .map((item) => {
                return {
                  ...item,
                  claveProyecto: getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  }),
                  estatusFull: getGlobalStatus(item.estatus),
                };
              });
          }
        },
      });
  }

  getProjectsValidar() {
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.dataAprobados = value.proyecto
              .filter((item) => {
                if (item.estatus === 'O') {
                  if (
                    (this.dataUser.idTipoUsuario === 'ENLACE' ||
                      this.dataUser.idTipoUsuario === 'PLANEACION' ||
                      this.dataUser.idTipoUsuario === 'PRESUPUESTO') &&
                    item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad
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
                }
                return false;
              })
              .map((item) => {
                return {
                  ...item,
                  claveProyecto: getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  }),
                  estatusFull: getGlobalStatus(item.estatus),
                };
              });
          }
        },
        error: () => { },
      });
  }

  async getFileSections() {
    this.dataPAA = await this.getFilesBySection(this.subseccionPaa);
    this.dataActas = await this.getFilesBySection(this.subseccionActas);
  }

  getFilesBySection(subseccionPaa: string) {
    return new Promise<any>((resolve, reject) => {
      this.sectionFilesService
        .getfilesByAnnio(this.yearNav, subseccionPaa)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200') {
              resolve(value.respuesta);
            } else {
              reject(value);
            }
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.ls.set('selectedConsultaProyectoPAA', event);
        this._router.navigate([
          '/Planeación/Planeación a Corto Plazo/Consulta/Visualizar',
        ]);
        break;
      case 'downloadAnalitico':
        if (event.value?.archivos.length > 0) {
          this.downloadFileAlf(
            event.value?.archivos[0].uuid,
            event.value?.archivos[0].nombre
          );
        }
        break;
      case 'Descargar Reporte del Proyecto':
        this.getVistaGeneral(event.value);
        break;
    }
  }

  async onTableActionFileSection(event: TableButtonAction, section: string) {
    switch (event.name) {
      case 'download':
        if (event.value?.cxUuid) {
          this.downloadFileAlf(event.value?.cxUuid, event.value?.cxNombre);
        } else {
          this.globalFuntions.downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete:
        if (section === this.subseccionPaa) {
          const indexPaa = this.dataPAA.findIndex(
            (element) => element.cxUuid === event.value.cxUuid
          );
          if (indexPaa > -1) {
            this.dataPAA.splice(indexPaa, 1);
          }
        }
        if (section === this.subseccionActas) {
          const indexActas = this.dataActas.findIndex(
            (element) => element.cxUuid === event.value.cxUuid
          );
          if (indexActas > -1) {
            this.dataActas.splice(indexActas, 1);
          }
        }
        this.handleAddFile(section);
        break;
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  async getFileToService(arrayFiles: any[]) {
    let file: any[] = [];
    if (arrayFiles.length) {
      for (const item of arrayFiles) {
        if (item.cxUuid) {
          file.push({
            uuid: item.cxUuid,
            tipoArchivo: item.idTipoDocumento,
            nombre: item.cxNombre,
          });
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(this.dataAlf.uuidPlaneacion, item)
            .then((uuid) => {
              file.push({
                uuid,
                tipoArchivo: getFileType(item.name),
                nombre: item.name,
              });
            })
            .catch((err) => { });
        }
      }
    }
    return file;
  }

  getVistaGeneral(project: any) {
    this.projectsService
      .getVistaGeneralByIdProject(
        this.yearNav,
        this.dataUser.cveUsuario,
        project.idProyecto
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length) {
            const dataVistaGeneral = getFormatDataForGeneralView({
              proyectoService: value.proyecto[0],
              selectedProject: project,
              catAlcance: this.catAlcance,
              catCategoria: this.catCategoria,
              catTipoProducto: this.catTipoProducto,
            });
            this.exportToExcel(dataVistaGeneral);
          }
        },
        error: (err) => { },
      });
  }

  async exportToExcel(dataVistaGeneral: any): Promise<void> {
    const tmpProgramas: any[] =
      getFormatDataFromGeneralDataForExcel(dataVistaGeneral);
    this.excelJsService.createExcelReporteProyectoAnual({
      dataVistaGeneral,
      data: tmpProgramas,
    });
  }
}
