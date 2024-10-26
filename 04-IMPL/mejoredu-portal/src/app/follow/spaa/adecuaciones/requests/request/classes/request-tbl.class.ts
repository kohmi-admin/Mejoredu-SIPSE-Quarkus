import { TableActionsI, TableConsts } from "@common/mat-custom-table/consts/table";
import { TableButtonAction } from "@common/models/tableButtonAction";
import { TableColumn } from "@common/models/tableColumn";

export class RequestTbl {
  columns: TableColumn[] = [
    { columnDef: 'folioSolicitud', header: 'Folio de Solicitud', alignLeft: true, width: '155px' },
    { columnDef: 'fSolicitud', header: 'Fecha de Solicitud', width: '110px', },
    { columnDef: 'fAutorizacion', header: 'Fecha de Autorización', width: '100px', },
    { columnDef: 'unidad', header: 'Unidad', alignLeft: true },
    { columnDef: 'anhioId', header: 'Año', alignLeft: true, width: '55px' },
    { columnDef: 'tipoAdecuacion', header: 'Tipo de Adecuación', alignLeft: true },
    { columnDef: 'tipoModificacion', header: 'Tipo de Modificación', alignLeft: true },
    { columnDef: 'montoAplicacion', header: 'Monto de Aplicación', alignLeft: true },
    { columnDef: 'status', header: 'Estatus', alignRight: true },
  ]
  data: any[] = [];
  actions: TableActionsI = {
    view: true,
    edit: true,
    custom: [
      {
        icon: 'download',
        name: 'Descargar',
      },
    ]
  }
}
