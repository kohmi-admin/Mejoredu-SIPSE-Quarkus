import { Component, OnDestroy } from '@angular/core';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';

@Component({
  selector: 'app-paa-form',
  templateUrl: './paa-form.component.html',
  styleUrls: ['./paa-form.component.scss']
})
export class PaaFormComponent implements OnDestroy {
  data: any[] = [];
  columns = [
    { columnDef: 'area', header: 'Area' },
    { columnDef: 'name', header: 'Nombre' },
    { columnDef: 'clave', header: 'Clave' },
  ]
  actions = {
    // edit: true,
    // delete: true,
    view: true,
  };
  loading = true;
  private _body = document.querySelector('body');

  constructor(
  ) {
    this._body?.classList.add('hideW');
    this.getAll();
  }

  async getAll(): Promise<void> {
    this.loading = true;
    // this.data = await this.service.getAll();
    this.data = [
      { name: 'Proyecto 1', clave: 'ASDT0001', area: 'Area 1' },
      { name: 'Proyecto 2', clave: 'ASDT0002', area: 'Area 2' },
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

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }

}
