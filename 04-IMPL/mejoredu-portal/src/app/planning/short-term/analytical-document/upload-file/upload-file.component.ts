import { Component } from '@angular/core';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  data: any[] = [];
  columns = [
    { columnDef: 'name', header: 'Nombre del Documento' },
    { columnDef: 'date', header: 'Fecha de Carga' },
  ]
  actions = {
    // edit: true,
    // delete: true,
    view: true,
  };
  loading = true;

  constructor() {
    this.getAll();
  }

  async getAll(): Promise<void> {
    this.loading = true;
    // this.data = await this.service.getAll();
    this.data = [
      { name: 'Documento 6', date: '06/08/2023' },
      { name: 'Documento 5', date: '05/08/2023' },
      { name: 'Documento 4', date: '04/08/2023' },
      { name: 'Documento 3', date: '03/08/2023' },
      { name: 'Documento 2', date: '02/08/2023' },
      { name: 'Documento 1', date: '01/08/2023' },
    ];
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.edit:
        break;
      case TableConsts.actionButton.delete:
        break;
    }
  }
}
