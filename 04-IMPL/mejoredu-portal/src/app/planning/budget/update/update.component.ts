import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { StateService } from '../programs/services/state.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { getGlobalStatus } from '@common/utils/Utils';
import * as moment from 'moment';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent {
  columns = [
    { columnDef: 'program', header: 'Programa Presupuestario' },
    { columnDef: 'registerDate', header: 'Fecha de Registro' },
    { columnDef: 'updateDate', header: 'Fecha de Actualización' },
    { columnDef: 'estatusFull', header: 'Estatus' },
  ];
  ls = new SecureLS({ encodingType: 'aes' });
  yearNav: string = '';

  notifier = new Subject();

  data: any[] = [
    {
      program: 'Cargando...',
      registerDate: '',
      updateDate: '',
    },
  ];
  actions: TableActionsI = {
    edit: true,
    custom: [
      {
        icon: 'download',
        name: 'Descargar Programa Presupuestario',
      },
    ],
  };

  constructor(
    private _router: Router,
    private _stateService: StateService,
    private ppConsultasService: PPConsultasService
  ) {
    this.yearNav = this.ls.get('yearNav');
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
                estatusFull: getGlobalStatus(item.estatusGeneral),
              };
            });
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._stateService.setCanEdit(false);
        this._router.navigate([
          '/Planeación/Programas Presupuestarios/Registro/' +
          event.value.program,
        ]);
        break;
      case TableConsts.actionButton.edit:
        this.ls.set('selectedAjustesPP', event.value);
        this._stateService.setCanEdit(true);
        this._router.navigate([
          '/Planeación/Programas Presupuestarios/Actualización/' +
          event.value.program,
        ]);
        break;
    }
  }

  showActionIf(action: string, value: any): boolean {
    if (action === TableConsts.actionButton.edit) {
      if (value.estatusGeneral === 'R') {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
