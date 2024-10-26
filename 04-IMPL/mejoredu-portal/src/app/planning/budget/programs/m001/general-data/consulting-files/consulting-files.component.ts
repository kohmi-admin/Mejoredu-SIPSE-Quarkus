import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { PPM001FichasService } from '@common/services/pp-m001-fichas.service';
import { Subscription } from 'rxjs';
import { StateViewService } from 'src/app/planning/budget/services/state-view.service';

@Component({
  selector: 'app-consulting-files',
  templateUrl: './consulting-files.component.html',
  styleUrls: ['./consulting-files.component.scss'],
})
export class ConsultingFilesComponent implements OnInit, OnDestroy {
  columns = [
    { columnDef: 'program', header: 'Nombre del Documento' },
    { columnDef: 'registerDate', header: 'Fecha de Carga' },
  ];
  // data: any[] = [
  //   {
  //     program: 'Acta de Aprobación',
  //     registerDate: '02/09/2023',
  //   },
  //   {
  //     program: 'Diagnóstico del Programa Presupuestario',
  //     registerDate: '02/09/2023',
  //   },
  // ];
  dataTable: any[] = [];
  actions: TableActionsI = {
    delete: false,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
        icon: 'download',
        color: 'primary',
      },
    ],
  };
  private ppM001FichasSubs!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ppM001FichasService: PPM001FichasService,
    private _stateViewService: StateViewService
  ) {
    if (this._stateViewService.validation) {
      this.actions = {
        view: true,
      };
    }
  }

  ngOnInit() {
    this.ppM001FichasSubs = this.ppM001FichasService.ppM001Fichas$.subscribe(
      (result) => {
        if (result?.from === 'form') {
          this.dataTable = result.data;
          if (result.enabledForm) {
            this.actions.delete = true;
          }
        }
      }
    );
    this.ppM001FichasService.sendData({
      from: 'table',
      data: 'onInit',
      enabledForm: false,
    });
  }

  handleTableActionArchivos(event: TableButtonAction) {
    this.ppM001FichasService.sendData({
      from: 'table',
      data: event,
      enabledForm: false,
    });
  }

  ngOnDestroy(): void {
    this.ppM001FichasSubs.unsubscribe();
  }
}
