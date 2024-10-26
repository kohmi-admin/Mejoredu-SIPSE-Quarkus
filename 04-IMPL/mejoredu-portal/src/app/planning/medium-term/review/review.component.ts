import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import { getGlobalStatus } from '@common/utils/Utils';
import { IDatosUsuario } from '@common/interfaces/login.interface';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  columns: TableColumn[] = [
    { columnDef: 'nombrePrograma', header: 'Nombre del PI', alignLeft: true },
    { columnDef: 'fhRegistro', header: 'Fecha de Registro', width: '120px' },
    {
      columnDef: 'fhActualizacion',
      header: 'Fecha de Actualización',
      width: '120px',
    },
    {
      columnDef: 'statusFull',
      header: 'Estatus',
      width: '145px',
      alignRight: true,
    },
  ];
  data: any[] = [];
  actions: TableActionsI = {
    custom: [
      {
        icon: 'fact_check',
        name: 'Validar',
      },
    ],
  };
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;

  constructor(
    private _router: Router,
    private principalService: PrincipalService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getAllGestor();
  }

  /*
   * COMMENT: Estatus de consulta
   * estatus (Presupuesto)
   * estatusPlaneacion
   * estatusSupervisor
   */
  getAllGestor() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta) {
            const respuesta = value.respuesta;
            const newData = {
              ...respuesta,
              statusFull: getGlobalStatus(
                respuesta.estatus,
                this.dataUser.idTipoUsuario
              ),
            };
            this.data = [newData];
          }
        },
        error: () => { },
      });
  }

  async onTableAction(event: TableButtonAction) {
    if (event.name === 'Validar') {
      const newEvent = {
        ...event,
        name: 'view',
      };
      this.ls.set('selectedValidatePI', newEvent);
      this._router.navigate([
        '/Planeación/Planeación de Mediano Plazo/Validación/Validar',
      ]);
    }
  }

  showActionIf = (action: string, value: any) => {
    if (action === 'Validar') {
      if (
        this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
        (value.estatus === 'P' || value.estatus === 'E')
      ) {
        return true;
      }
    }
    return false;
  };
}
