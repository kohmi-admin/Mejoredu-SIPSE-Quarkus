import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableMirService } from '@common/services/short-term/mir.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { ViewMirComponent } from './view-mir/view-mir.component';
import { ViewFichaIdentificadorComponent } from './view-ficha-identificador/view-ficha-identificador.component';
import { ViewProductComponent } from './view-product/view-product.component';

@Component({
  selector: 'app-mir',
  templateUrl: './mir.component.html',
  styleUrls: ['./mir.component.scss'],
})
export class MirComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  dataProducts: any[] = [];
  dataTableMir: any[] = [];
  columns = [
    { columnDef: 'nivel', header: 'Nivel', width: '100px' },
    {
      columnDef: 'claveNombreProducto',
      header: 'Clave y Nombre del Producto',
      alignLeft: true,
    },
  ];
  actions = {
    view: true,
  };
  loading = true;
  private _body = document.querySelector('body');
  yearNav: string = '';
  dataUser: IDatosUsuario;

  constructor(
    public dialog: MatDialog,
    private tableMirService: TableMirService
  ) {
    this._body?.classList.add('hideW');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getAll();
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.getProducts();
    this.getTableDataMir();
    this.loading = false;
  }

  getTableDataMir() {
    this.tableMirService
      .getTableDataMir(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.dataTableMir = value.respuesta;
          }
        },
      });
  }

  getProducts() {
    this.tableMirService
      .getTableProducts(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          let tmpTable: any[] = [];
          if (value.codigo === '200') {
            value.respuesta?.map((item) => {
              tmpTable.push({
                nivel: item.nivel,
                claveNombreProducto: `${item.clave} ${item.nombreProducto}`,
                ...item,
              });
            });
            this.dataProducts = tmpTable;
          }
        },
      });
  }

  calcularPorcentajeMIR(item: any) {
    let totalProductos: number | string = 0,
      totalPorcentaje: number | string = 0;
    let primerPorcentaje: number | string = 0;
    let segundoPorcentaje: number | string = 0;
    let tercerPorcentaje: number | string = 0;
    let cuartoPorcentaje: number | string = 0;

    totalProductos =
      parseInt(item.primerTrimestre) +
      parseInt(item.segundoTrimestre) +
      parseInt(item.tercerTrimestre) +
      parseInt(item.cuartoTrimestre);
    if (totalProductos) {
      totalPorcentaje = 100;
      primerPorcentaje = (
        (parseInt(item.primerTrimestre) / totalProductos) *
        totalPorcentaje
      ).toFixed(2);
      segundoPorcentaje = (
        (parseInt(item.segundoTrimestre) / totalProductos) *
        totalPorcentaje
      ).toFixed(2);
      tercerPorcentaje = (
        (parseInt(item.tercerTrimestre) / totalProductos) *
        totalPorcentaje
      ).toFixed(2);
      cuartoPorcentaje = (
        (parseInt(item.cuartoTrimestre) / totalProductos) *
        totalPorcentaje
      ).toFixed(2);
    }

    return {
      totalProductos,
      totalPorcentaje,
      primerPorcentaje,
      segundoPorcentaje,
      tercerPorcentaje,
      cuartoPorcentaje,
    };
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
    this.notifier.complete();
  }

  openDialog(data?: any) {
    const dialogRef = this.dialog.open(ViewMirComponent, {
      data: {
        data,
        canEdit: false,
      },
    });
  }

  openDialogFichaMir(data?: any) {
    const dialogRef = this.dialog.open(ViewFichaIdentificadorComponent, {
      data: {
        data,
      },
      width: '800px',
    });
  }

  openDialogProduct(data?: any) {
    const dialogRef = this.dialog.open(ViewProductComponent, {
      data: {
        data,
      },
      width: '1200px',
    });
  }
}
