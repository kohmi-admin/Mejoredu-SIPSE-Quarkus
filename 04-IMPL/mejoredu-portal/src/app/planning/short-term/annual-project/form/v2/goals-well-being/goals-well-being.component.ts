import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { TableGoalsWellBeingService } from '@common/services/short-term/goals-well-being.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { ViewParamsComponent } from './view-params/view-params.component';
import { ViewProductComponent } from '../mir/view-product/view-product.component';

@Component({
  selector: 'app-goals-well-being',
  templateUrl: './goals-well-being.component.html',
  styleUrls: ['./goals-well-being.component.scss'],
})
export class GoalsWellBeingComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  dataMetasParametros: any[] = [];
  dataTableMetasParametros: any[] = [];
  columns: TableColumn[] = [
    {
      columnDef: 'claveObjetivoPrioritario',
      header: 'Clave de<br />Objetivo Prioritario',
      width: '200px',
    },
    {
      columnDef: 'claveMetaParametro',
      header: 'Clave de<br />Meta o Parámetro',
      width: '200px',
    },
    { columnDef: 'name', header: 'Nombre del Producto', alignLeft: true },
  ];
  actions = {
    view: true,
  };
  loading = true;
  private _body = document.querySelector('body');
  yearNav: string = '';
  dataUser: IDatosUsuario;

  secuencia: number = 1;

  constructor(
    public dialog: MatDialog,
    private tableGoalsWellBeingService: TableGoalsWellBeingService
  ) {
    this._body?.classList.add('hideW');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getAll();
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.getTableMetasParametros();
    this.getMetasParametrosList();
    this.loading = false;
  }

  async getSecuncia() {
    this.secuencia += 1;
  }

  getTableMetasParametros() {
    this.tableGoalsWellBeingService
      .getTableDataGoalsWellBeing(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.dataTableMetasParametros = value.respuesta;
          }
        },
      });
  }

  getMetasParametrosList() {
    this.tableGoalsWellBeingService
      .getTableConsultarPorIdCatalogoIndicadorPI(
        this.yearNav,
        this.dataUser.cveUsuario
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            let tmpTable: any[] = [];
            value.respuesta?.map((item, index) => {
              tmpTable.push({
                claveObjetivoPrioritario: '1',
                claveMetaParametro: `1.${index + 1}`,
                name: item.nombre,
                ...item
              });
            });
            this.dataMetasParametros = tmpTable;
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: any = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.openDialogProduct(dataAction);
        break;
      case TableConsts.actionButton.delete:
        break;
    }
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }

  openDialog(data?: any) {
    const dialogRef = this.dialog.open(ViewParamsComponent, {
      data: {
        data,
        canEdit: false,
      },
      width: '1200px'
    });
  }

  openDialogProduct(data?: any) {
    const dialogRef = this.dialog.open(ViewProductComponent, {
      data: {
        data
      },
      width: '1200px',
    });
  }
}
