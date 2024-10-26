import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import * as SecureLS from 'secure-ls';
import { ProjectsService } from '@common/services/projects.service';
import { getGlobalStatus } from '@common/utils/Utils';
import { IDatosUsuario } from '@common/interfaces/login.interface';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
})
export class ModifyComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  columns: TableColumn[] = [
    { columnDef: 'nombre', header: 'Nombre del Proyecto', alignLeft: true },
    { columnDef: 'dfRegistro', header: 'Fecha de Registro', width: '120px' },
    {
      columnDef: 'dfActualizacion',
      header: 'Fecha de Actualización',
      width: '120px',
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
  data: any[] = [];
  actions: TableActionsI = {
    edit: true,
  };
  notifier = new Subject();
  yearNav: string;

  constructor(
    private _router: Router,
    private projectsService: ProjectsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getProjects();
  }

  getProjects() {
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.data = value.proyecto
              .filter(
                (item) =>
                  item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad &&
                  item.estatus !== 'I' &&
                  (item.estatus !== 'T' ||
                    (item.estatus === 'T' &&
                      ((item.estatusPlaneacion === 'R' &&
                        item.estatusPresupuesto === 'R' &&
                        item.estatusSupervisor === 'P') ||
                        (item.estatusPlaneacion === 'V' &&
                          item.estatusPresupuesto === 'V' &&
                          item.estatusSupervisor === 'R')))) &&
                  (item.estatus !== 'C' ||
                    (item.estatus === 'C' &&
                      ((item.estatusPlaneacion === 'R' &&
                        item.estatusPresupuesto === 'R' &&
                        item.estatusSupervisor === 'P') ||
                        (item.estatusPlaneacion === 'V' &&
                          item.estatusPresupuesto === 'V' &&
                          item.estatusSupervisor === 'R') ||
                        (item.estatusPlaneacion === 'R' &&
                          item.estatusPresupuesto === 'V') ||
                        (item.estatusPlaneacion === 'V' &&
                          item.estatusPresupuesto === 'R'))))
              )
              .map((item) => {
                return {
                  ...item,
                  estatusFull: getGlobalStatus(item.estatus),
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
        error: () => { },
      });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.edit:
        this.ls.set('selectedAjustesProyectoPAA', event);
        this._router.navigate([
          '/Planeación/Planeación a Corto Plazo/Formulación/Ajuste de Proyectos',
        ]);
        break;
    }
  }

  showActionIf(action: string, value: any) {
    if (action === TableConsts.actionButton.edit) {
      if (value.estatusPlaneacion === 'V' && value.estatusPresupuesto === 'V') {
        if (
          value.estatusSupervisor !== 'P' &&
          value.estatusSupervisor !== 'E' &&
          value.estatusSupervisor !== 'O'
        ) {
          return true;
        }
      } else if (
        (value.estatusPlaneacion === 'R' && value.estatusPresupuesto === 'V') ||
        (value.estatusPlaneacion === 'V' && value.estatusPresupuesto === 'R')
      ) {
        return true;
      } else if (
        value.estatusPlaneacion !== 'P' &&
        value.estatusPlaneacion !== 'E' &&
        value.estatusPlaneacion !== 'V' &&
        value.estatusPresupuesto !== 'P' &&
        value.estatusPresupuesto !== 'E' &&
        value.estatusPresupuesto !== 'V'
      ) {
        return true;
      }
    }
    return false;
  }
}
