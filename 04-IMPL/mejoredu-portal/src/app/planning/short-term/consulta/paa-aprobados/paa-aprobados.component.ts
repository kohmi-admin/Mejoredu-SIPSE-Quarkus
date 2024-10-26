import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableActionsI, TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';

@Component({
  selector: 'app-paa-aprobados',
  templateUrl: './paa-aprobados.component.html',
  styleUrls: ['./paa-aprobados.component.scss']
})
export class PaaAprobadosComponent {
  columns: TableColumn[] = [
    { columnDef: 'project', header: 'Nombre del Proyecto', alignLeft: true },
    { columnDef: 'registerDate', header: 'Fecha de Registro', width: '120px' },
    { columnDef: 'updateDate', header: 'Fecha de Actualización', width: '120px' },
    // { columnDef: 'status', header: 'Estatus', width: '145px' },
  ]
  data: any[] = [
    {
      project: 'Estudios, investigaciones especializadas y evaluaciones diagnósticas, formativas e integrales',
      registerDate: '01/10/2023',
      updateDate: '--',
      status: '1er Revisión',
    },
  ];
  actions: TableActionsI = {
    view: true,
    // custom: [
    //   {
    //     icon: 'download',
    //     name: 'Descargar',
    //   }
    // ]
  }

  constructor(
    private _router: Router,
  ) { }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._router.navigate(['/Planeación/Planeación a Corto Plazo/Formulación/Registro de Proyectos']);
        break;
    }
  }
}
