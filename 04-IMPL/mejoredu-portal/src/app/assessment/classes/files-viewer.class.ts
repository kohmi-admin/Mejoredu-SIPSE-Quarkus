import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { FileI } from './file.interface';

export class FilesViewer {
  title = 'Archivos';
  data: FileI[] = [];
  columns: TableColumn[] = [
    { columnDef: 'document', header: 'Documento', alignLeft: true },
  ];
  actions: TableActionsI = {
    view: true,
    delete: true,
    custom: [
      {
        id: 'Descargar',
        name: 'Descargar',
        icon: 'download',
      },
    ],
  };
  loading = true;

  constructor(private _alertService: AlertService) { }

  async getAll(): Promise<void> {
    this.loading = true;
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        break;
      case TableConsts.actionButton.edit:
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation(
            { message: '¿Está Seguro de Eliminar el Proyecto?' });
          if (confirm) {
            this.data = [
              ...this.data.filter((item) => item.id !== event.value.id),
            ];
          }
        }
        break;
    }
  }
}
