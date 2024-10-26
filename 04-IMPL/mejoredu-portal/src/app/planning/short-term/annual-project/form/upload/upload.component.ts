import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { SaveUpdateFileComponent } from './save-update/save-update.component';
import { AlertService } from '@common/services/alert.service';
import { Router } from '@angular/router';
import { FormsStateService } from '../services/forms-state.service.ts.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  data: any[] = [];
  columns = [
    { columnDef: 'name', header: 'Nombre' },
    { columnDef: 'clave', header: 'Clave' },
    { columnDef: 'status', header: 'Estatus' },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
    custom: [{ name: 'Descargar', icon: 'download', color: '' }],
  };
  loading = true;

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _formsState: FormsStateService,
    private _alertService: AlertService
  ) {
    this._formsState.unactiveAll();
    this.getAll();
  }

  openForm(value?: any): void {
    const dialogRef = this._dialog.open(SaveUpdateFileComponent, {
      data: value,
      width: '2000px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAll();
      }
    });
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.data = [
      {
        id: 1,
        name: 'Proyecto 1',
        clave: 'ASDT0001',
        objetivo: '',
        objPrioritario: '',
        status: 'Pendiente',
      },
      {
        id: 2,
        name: 'Proyecto 2',
        clave: 'ASDT0002',
        objetivo: '',
        objPrioritario: '',
        status: 'Pendiente',
      },
      {
        id: 3,
        name: 'Proyecto 3',
        clave: 'ASDT0003',
        objetivo: '',
        objPrioritario: '',
        status: 'Pendiente',
      },
    ];
    this.loading = false;
  }

  addNew(): void {
    this._router.navigateByUrl(
      'Planeación/Planeación a Corto Plazo/Proyecto Anual/Proyectos'
    );
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._formsState.setReadonly(true);
        this._formsState.setProduct(event.value);
        this._router.navigateByUrl(
          'Planeación/Planeación a Corto Plazo/Proyecto Anual/Proyectos'
        );
        break;
      case TableConsts.actionButton.edit:
        this._formsState.setReadonly(false);
        this._formsState.setProduct(event.value);
        this._router.navigateByUrl(
          'Planeación/Planeación a Corto Plazo/Proyecto Anual/Proyectos'
        );
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
