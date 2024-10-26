import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { TabsControlService } from '../services/tabs-control.service';
import { MatDialog } from '@angular/material/dialog';
import { MetaComponent } from './meta/meta.component';
import { NoProgramadosComponent } from './no-programados/no-programados.component';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { getCveProyecto } from '@common/utils/Utils';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { IResponseConsultarPAA } from '@common/interfaces/seguimiento/avances.interface';
import * as moment from 'moment';
import { MetaNoEditableComponent } from './MetaNoEditable/meta-no-editable/meta-no-editable.component';
import { AlertService } from '@common/services/alert.service';
import { ExcelJsService } from '@common/services/exceljs.service';

export interface IProjectsAnhioStatus extends IItemProjectsResponse {
  proyectoPAA: string;
}

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
})
export class ProyectsComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  @Input() currentQuarter: number = 1;

  data: IResponseConsultarPAA[] = [];
  data2: any[] = [];
  allAvances: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'proyectoPAA', header: 'Proyecto PAA', alignLeft: true },
  ];
  columns2: TableColumn[] = [
    {
      columnDef: 'cveProyecto',
      header: 'Clave y Nombre del Proyecto',
      alignLeft: true,
    },
    {
      columnDef: 'cveActividad',
      header: 'Clave y Nombre de las Actividades',
      alignLeft: true,
    },
    {
      columnDef: 'cveProducto',
      header: 'Clave y Nombre de los Productos',
      alignLeft: true,
    },
    { columnDef: 'mesStr', header: 'Mes Programado', width: '150px' },
  ];
  actions: TableActionsI = {
    custom: [
      {
        id: 'view',
        icon: 'visibility',
        name: 'Ver Actividades',
      },
    ],
  };
  dataUser: IDatosUsuario = this.ls.get('dUaStEaR');
  canEdit: boolean = this.dataUser.idTipoUsuario == 'CONSULTOR' ? false : true;
  isEnlace: boolean = this.dataUser.idTipoUsuario == 'ENLACE' ? true : false;
  isPlaneacion: boolean =
    this.dataUser.idTipoUsuario == 'PLANEACION' ? true : false;
  actions2: TableActionsI = {
    view: true,
    delete: this.canEdit,
  };
  loading = true;
  activeProject: number = 0;
  activeProjectCve: string | undefined = '';
  isEnviadoRevision: boolean = false;
  notifier = new Subject();
  yearNav: string;

  constructor(
    private _tabsControlService: TabsControlService,
    private _dialog: MatDialog,
    private _avancesService: AvancesService,
    private _alertService: AlertService,
    private excelJsService: ExcelJsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.ls.set('canEdit', this.canEdit);
    this.getAll();
    this.consultarAvancesPorAnhio();
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.getProjectsPAA();
    this.loading = false;
  }

  getProjectsPAA() {
    this.data = [];
    this._avancesService
      .consultarProyectos(this.dataUser.cveUsuario, Number(this.yearNav))
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.data = value.respuesta.map((item) => {
            return {
              ...item,
              proyectoPAA: `${getCveProyecto({
                cveProyecto: +item.cveProyecto,
                cveUnidad: item.cveUnidad,
                yearNav: item.idAnhio?.toString(),
              })}. ${item.nombreProyecto}`,
            };
          });
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: any = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.activeProject = dataAction.idProyecto;
        this.activeProjectCve = dataAction.proyectoPAA;
        if (
          dataAction.estatusRevision == 'D' ||
          dataAction.estatusRevision == 'P'
        )
          this.isEnviadoRevision = true;
        this._tabsControlService.project = dataAction;
        this._tabsControlService.projectName = dataAction.proyectoPAA;
        this.mapAvancesPorAnhio();
        this.data2 = this.allAvances.filter((avance) => {
          return avance.idProyecto == this.activeProject;
        });
        break;
    }
  }

  async onTableAction2(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        let activeProduct = event.value;
        if (activeProduct.ixTipoRegistro == 0) {
          this.activeProject = event.value.projectId;
          this._tabsControlService.advance = event.value.idAvance;
          this._tabsControlService.product = event.value;
        } else {
          this.openMetaNoEditable(activeProduct);
        }
        break;
      case TableConsts.actionButton.delete:
        this.eliminarAvance(event.value.idAvance);
    }
  }

  openMeta(): void {
    this._dialog.open(MetaComponent, {
      width: '800px',
      data: {
        title: 'Metas Vencidas / Adelantadas',
        projectId: this.activeProject,
      },
    });
  }

  openMetaNoEditable(activeProduct) {
    let metaComponent = this._dialog.open(MetaNoEditableComponent, {
      width: '800px',
      data: {
        title: activeProduct.idProducto
          ? 'Metas Vencidas / Adelantadas'
          : 'Productos no -programados',
        projectId: this.activeProject,
      },
    });

    metaComponent.componentInstance.activeProduct = activeProduct;
  }

  openProducts(): void {
    this._dialog.open(NoProgramadosComponent, {
      width: '800px',
      data: {
        title: 'Productos no Programados',
        projectId: this.activeProject,
      },
    });
  }

  async consultarAvancesPorAnhio(): Promise<void> {
    const value = await lastValueFrom(
      this._avancesService.consultarAvancesPorAnhio(Number(this.yearNav))
    );
    this.allAvances = value.respuesta;
  }

  private mapAvancesPorAnhio() {
    this.allAvances = this.allAvances.map((item) => {
      const montName = moment()
        .month(item.mes - 1)
        .format('MMMM');
      return {
        ...item,
        idProducto: item.idProducto,
        cveProyecto: this.activeProjectCve,
        cveActividad: `${item.cveActividad} - ${item.nombreActividad}`,
        cveProducto:
          item.cveProducto == null
            ? ''
            : `${item.cveProyecto}-${item.cveActividad}-${item.cveProducto} - ${item.nombreProducto}`,
        mesStr:
          item.mes == null
            ? ''
            : this.getLabelMonth(montName, item),
      };
    });
  }

  public getLabelMonth(montName, item): string {
    if(item.ixTipoRegistro == 0) {
      switch(item.mes){
        case 1: case 2: case 3:
          return 'Enero, Febrero, Marzo'
          break;
        case 4: case 5: case 6:
          return 'Abril, Mayo, Junio'
          break;
        case 7: case 8: case 9:
          return 'Julio, Agosto, Septiembre'
          break;
        case 10: case 11: case 12:
          return 'Octubre, Noviembre, Diciembre'
          break;
        default: return ''
      }
    }else{
      return `${montName[0].toUpperCase() + montName.slice(1)}`;
    }
  }

  public enviarRevision() {
    let request = {
      idProyecto: this.activeProject,
      trimestre: this.currentQuarter,
    };
    this._avancesService
      .enviarProyectoRevision(request)
      .subscribe((response) => {
        this._alertService.showAlert('Enviado a revision');
      });
  }

  public async eliminarAvance(idAvance: number) {
    const confirm = await this._alertService.showConfirmation({
      message: '¿Está Seguro de Eliminar el Registro?',
    });
    if (confirm) {
      this._avancesService.eliminarAvance(idAvance).subscribe({
        next: (value: any) => {
          if (value.mensaje.codigo == '200') {
            this._alertService.showAlert('Se Eliminó Correctamente');
          }
        },
      });
    }
  }

  showActionIf = (action: string, value: any): boolean => {
    if (action === 'delete') {
      if (value.cveUsuario == this.dataUser.cveUsuario) {
        return true;
      }
    }
    if (action === 'view') return true;
    return false;
  };

  generateReport() {
    const avances = this.allAvances.map((item) => {
      const montName = moment()
        .month(item.mes - 1)
        .format('MMMM');
      let nombreProyecto =
        item.nombreProyecto.split('.')[1] == undefined
          ? item.nombreProyecto
          : item.nombreProyecto.split('.')[1];
      return {
        /* ...item, */
        cveProyecto: `${getCveProyecto({
          cveProyecto: +item.cveProyecto,
          cveUnidad: item.cveUnidad,
          yearNav: item.idAnhio?.toString(),
        })}. ${nombreProyecto}`,
        cveActividad: `${item.cveActividad} - ${item.nombreActividad}`,
        cveProducto:
          item.cveProducto == null
            ? ''
            : `${item.cveProyecto}-${item.cveActividad}-${item.cveProducto} - ${item.nombreProducto}`,
        mesStr:
          item.mes == null
            ? ''
            : `${montName[0].toUpperCase() + montName.slice(1)}`,
      };
    });
    this.excelJsService.createExcelReporteGeneralAvancesProgramaticos(avances);
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
