import { Component, Inject } from '@angular/core';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { StateViewService } from 'src/app/planning/budget/services/state-view.service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PPO001FichasService } from '@common/services/pp-o001-fichas.service';
import { TableButtonAction } from '@common/models/tableButtonAction';

@Component({
  selector: 'app-consulting-files',
  templateUrl: './consulting-files.component.html',
  styleUrls: ['./consulting-files.component.scss'],
})
export class ConsultingFilesComponent {
  columns = [
    { columnDef: 'program', header: 'Nombre del Documento' },
    { columnDef: 'registerDate', header: 'Fecha de Carga' },
  ];
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
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private ppO001FichasService: PPO001FichasService,
    private _stateViewService: StateViewService
  ) {
    if (this._stateViewService.validation) {
      this.actions = {
        view: true,
      };
    }
  }

  ngOnInit() {
    this.ppM001FichasSubs = this.ppO001FichasService.ppO001Fichas$.subscribe(
      (result) => {
        if (result?.from === 'form') {
          this.dataTable = result.data;
          if (result.enabledForm) {
            this.actions.delete = true;
          }
        }
      }
    );
    this.ppO001FichasService.sendData({
      from: 'table',
      data: 'onInit',
      enabledForm: false,
    });
  }

  handleTableActionArchivos(event: TableButtonAction) {
    this.ppO001FichasService.sendData({
      from: 'table',
      data: event,
      enabledForm: false,
    });
  }

  ngOnDestroy(): void {
    this.ppM001FichasSubs.unsubscribe();
  }
}
