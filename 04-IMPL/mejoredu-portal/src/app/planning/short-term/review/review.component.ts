import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { ProjectsService } from '@common/services/projects.service';
import { CTipoUsuario } from '@common/constants/tipo-usuario.enum';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  getCveProyecto,
  getFormatDataForGeneralView,
  getFormatDataFromGeneralDataForExcel,
  getGlobalStatus,
} from '@common/utils/Utils';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { ExcelJsService } from '@common/services/exceljs.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  columns: TableColumn[] = [
    {
      columnDef: 'claveNombreUnidad',
      header: 'Clave y Nombre de la Unidad',
      alignLeft: true,
    },
    {
      columnDef: 'claveNombreProyecto',
      header: 'Clave y Nombre del Proyecto',
      alignLeft: true,
    },
    {
      columnDef: 'statusPlaneacion',
      header: 'Estatus Planeación',
      width: '210px',
      alignRight: true,
    },
    {
      columnDef: 'statusPresupuesto',
      header: 'Estatus Presupuesto',
      width: '210px',
      alignRight: true,
    },
  ];
  data: any[] = [];
  actionsString = 'Opciones';
  actions: TableActionsI = {
    custom: [
      {
        id: 'downloadProject',
        icon: 'download',
        name: 'Descargar Proyecto',
      },
      {
        id: 'revisionValidacion',
        icon: 'fact_check',
        name: 'Revisión y Validación Técnica',
      },
    ],
  };
  notifier = new Subject();
  yearNav: string;

  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];
  catAlcance: IItemCatalogoResponse[] = [];

  constructor(
    private _router: Router,
    private projectsService: ProjectsService,
    private catalogService: CatalogsService,
    private excelJsService: ExcelJsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getProjects();
    if (this.dataUser.idTipoUsuario === CTipoUsuario.SUPERVISOR) {
      this.setSupervisorActions();
    }
    if (this.dataUser.idTipoUsuario === CTipoUsuario.PLANEACION) {
      this.setPlaneacionActions();
    }
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

  getProjects() {
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.data = value.proyecto
              .filter((item) => {
                if (item.estatus !== 'C') {
                  if (
                    (this.dataUser.idTipoUsuario === 'PLANEACION' ||
                      this.dataUser.idTipoUsuario === 'PRESUPUESTO') &&
                    item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad
                  ) {
                    return true;
                  } else if (this.dataUser.idTipoUsuario === 'SUPERVISOR') {
                    return true;
                  }
                }
                return false;
              })
              .map((item) => {
                return {
                  ...item,
                  claveNombreUnidad: `${item.claveUnidad} ${item.nombreUnidad}`,
                  claveNombreProyecto: `${getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  })} ${item.nombre}`,
                  estatusFull: getGlobalStatus(
                    item.estatus,
                    this.dataUser.idTipoUsuario
                  ),
                  statusPresupuesto: getGlobalStatus(
                    item.estatusPresupuesto,
                    this.dataUser.idTipoUsuario
                  ),
                  statusPlaneacion: getGlobalStatus(
                    item.estatusPlaneacion,
                    this.dataUser.idTipoUsuario
                  ),
                  statusSupervisor: getGlobalStatus(
                    item.estatusSupervisor,
                    this.dataUser.idTipoUsuario
                  ),
                };
              })
              .reverse();
          }
        },
      });
  }

  showActionIf = (action: string, value: any): boolean => {
    if (action === 'downloadProject') {
      return true;
    }

    if (
      value.estatus !== 'I' &&
      value.estatus !== 'C' &&
      value.estatus !== 'T'
    ) {
      if (action === 'revisionValidacion') {
        switch (this.dataUser.idTipoUsuario) {
          case 'PLANEACION':
            return (
              value.estatusPlaneacion === 'P' || value.estatusPlaneacion === 'E'
            );
          case 'PRESUPUESTO':
            return (
              value.estatusPresupuesto === 'P' ||
              value.estatusPresupuesto === 'E'
            );
        }
      }

      if (action === 'validacion') {
        return (
          this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
          this.dataUser.perfilLaboral.ixNivel === 1 &&
          value.estatusPlaneacion === 'V' &&
          value.estatusPresupuesto === 'V' &&
          (value.estatusSupervisor === 'P' || value.estatusSupervisor === 'E')
        );
      }
      return true;
    } else {
      return false;
    }
  };

  setSupervisorActions() {
    this.actions = {
      custom: [
        {
          id: 'validacion',
          icon: 'fact_check',
          name: 'Validación',
        },
      ],
    };
    this.columns = [
      {
        columnDef: 'claveNombreUnidad',
        header: 'Clave y Nombre de la Unidad',
        alignLeft: true,
      },
      {
        columnDef: 'claveNombreProyecto',
        header: 'Clave y Nombre del Proyecto',
        alignLeft: true,
      },
      {
        columnDef: 'statusPlaneacion',
        header: 'Estatus Planeación',
        width: '210px',
        alignRight: true,
      },
      {
        columnDef: 'statusPresupuesto',
        header: 'Estatus Presupuesto',
        width: '210px',
        alignRight: true,
      },
      {
        columnDef: 'statusSupervisor',
        header: 'Estatus Supervisor',
        width: '210px',
        alignRight: true,
      },
    ];
    this.actionsString = 'Validación';
  }

  setPlaneacionActions() {
    this.columns = [
      {
        columnDef: 'claveNombreUnidad',
        header: 'Clave y Nombre de la Unidad',
        alignLeft: true,
      },
      {
        columnDef: 'claveNombreProyecto',
        header: 'Clave y Nombre del Proyecto',
        alignLeft: true,
      },
      {
        columnDef: 'statusPresupuesto',
        header: 'Estatus Presupuesto',
        width: '210px',
        alignRight: true,
      },
      {
        columnDef: 'statusPlaneacion',
        header: 'Estatus Planeación',
        width: '210px',
        alignRight: true,
      },
    ];
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      // Usuario Supervisor
      case 'Validar':
      case 'validacion':
        {
          // COMMENT: Rol Supervisor
          const newEvent = {
            ...event,
            name: 'view',
          };
          this.ls.set('selectedValidateProyectoPAA', newEvent);
          this._router.navigate([
            '/Planeación/Planeación a Corto Plazo/Revisión y Validación/Validar',
          ]);
        }
        break;
      // Usuario Planeación y Presupuesto
      case 'revisionValidacion':
        this.ls.set('selectedValidateProyectoPAA', event);
        if (this.dataUser.idTipoUsuario === CTipoUsuario.PRESUPUESTO) {
          // COMMENT: Rol presupuesto
          this._router.navigate([
            '/Planeación/Planeación a Corto Plazo/Revisión y Validación/Revisión',
          ]);
          break;
        }
        // COMMENT: Rol planeacion
        this._router.navigate([
          '/Planeación/Planeación a Corto Plazo/Revisión y Validación/Revisión Planeación',
        ]);
        break;
      case 'downloadProject':
        this.getVistaGeneral(event.value);
        break;
    }
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
