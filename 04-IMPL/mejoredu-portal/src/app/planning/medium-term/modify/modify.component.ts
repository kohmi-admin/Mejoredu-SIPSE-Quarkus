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
import { getGlobalStatus } from '@common/utils/Utils';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
})
export class ModifyComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  columns: TableColumn[] = [
    {
      columnDef: 'nombrePrograma',
      header: 'Nombre del PI',
      alignLeft: true,
    },
    { columnDef: 'fhRegistro', header: 'Fecha de Registro', width: '120px' },
    {
      columnDef: 'fhActualizacion',
      header: 'Fecha de Actualización',
      width: '120px',
    },
    {
      columnDef: 'estatusFull',
      header: 'Estatus',
      width: '145px',
      alignRight: true,
    },
    // {
    //   columnDef: 'statusPlaneacion',
    //   header: 'Estatus Planeación',
    //   width: '210px',
    //   alignRight: true,
    // },
    // {
    //   columnDef: 'statusSupervisor',
    //   header: 'Estatus Supervisor',
    //   width: '210px',
    //   alignRight: true,
    // },
  ];
  data: any[] = [];
  actions: TableActionsI = {
    edit: true,
  };
  notifier = new Subject();
  yearNav: string;
  canEdit: boolean = true;

  constructor(
    private _router: Router,
    private principalService: PrincipalService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.canEdit = this.ls.get('canEdit');
    this.getGestorPorAnhio();
  }

  getGestorPorAnhio() {
    this.data = [];
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta) {
            const respuesta = value.respuesta;
            this.data = [
              {
                ...respuesta,
                estatusFull: getGlobalStatus(respuesta.estatus),
                // statusPlaneacion: getGlobalStatus(
                //   respuesta.estatusPlaneacion,
                //   this.dataUser.idTipoUsuario
                // ),
                // statusSupervisor: getGlobalStatus(
                //   respuesta.estatusSupervisor,
                //   this.dataUser.idTipoUsuario
                // ),
              },
            ];
          }
        },
        error: (error) => { },
      });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.edit:
        this.ls.set('selectedAjustesPI', event);
        this._router.navigate([
          '/Planeación/Planeación de Mediano Plazo/Actualización',
        ]);
        break;
    }
  }

  showActionIf = (action: string, value: any) => {
    if (
      action === TableConsts.actionButton.edit &&
      value.estatus === 'R' &&
      this.canEdit
      // moment().format('YYYY') === this.yearNav
    ) {
      return true;
    }
    return false;
  };
}
