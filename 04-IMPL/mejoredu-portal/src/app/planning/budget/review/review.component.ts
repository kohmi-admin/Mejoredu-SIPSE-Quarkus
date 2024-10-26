import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { getGlobalStatus } from '@common/utils/Utils';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  columns: TableColumn[] = [
    {
      columnDef: 'program',
      header: 'Programa Presupuestario',
      alignLeft: true,
    },
    { columnDef: 'registerDate', header: 'Fecha de Registro' },
    { columnDef: 'updateDate', header: 'Fecha de Actualización' },
    {
      columnDef: 'estatusFull',
      header: 'Estatus Supervisor',
      width: '230px',
      alignRight: true,
    },
  ];
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  yearNav: string;
  data: any[] = [];
  notifier = new Subject();
  actions: TableActionsI = {
    custom: [
      {
        icon: 'fact_check',
        name: 'Validar',
      },
    ],
  };

  constructor(
    private _router: Router,
    private ppConsultasService: PPConsultasService
  ) {
    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');
    this.getAll();
  }

  getAll() {
    this.data = [];
    this.ppConsultasService
      .getConsultaPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            this.data = value.respuesta.map((item) => {
              return {
                ...item,
                program: item.clave,
                registerDate: item.fechaRegistro
                  ? moment(item.fechaRegistro).format('DD/MM/YYYY')
                  : '',
                updateDate: item.fechaActualizacion
                  ? moment(item.fechaActualizacion).format('DD/MM/YYYY')
                  : '',
                estatusFull: getGlobalStatus(
                  item.estatusSupervisor ?? item.estatusGeneral,
                  this.dataUser.idTipoUsuario
                ),
              };
            });
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._router.navigate([
          '/Planeación/Programas Presupuestarios/Consulta',
        ]);
        break;
      case 'Validar':
        this.ls.set('selectedValidarPP', event.value);
        this._router.navigate([
          `/Planeación/Programas Presupuestarios/Validación/${event.value.program}`,
        ]);
        break;
    }
  }

  showActionIf(action: string, value: any): boolean {
    if (action === 'Validar') {
      if (value.estatusGeneral === 'P' || value.estatusGeneral === 'E') {
        return true;
      }
    }
    return false;
  }
}
