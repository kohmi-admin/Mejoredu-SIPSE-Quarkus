import { Component } from '@angular/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { TabsControlService } from './services/tabs-control.service';
import { IProjectsAnhioStatus } from './proyects/proyects.component';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {
  project: IProjectsAnhioStatus;
  activity: any;
  product: any;
  advance: any;
  notifier: Subject<any> = new Subject<any>();
  tabIndex: number = 0;
  currentQuarter: number = 1;
  catCategoria: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];

  constructor(
    private _tabsControlService: TabsControlService,
    private catalogService: CatalogsService
  ) {
    this.project = this._tabsControlService.project;
    this.activity = this._tabsControlService.activity;
    this.product = this._tabsControlService.product;
    this.advance = this._tabsControlService.advance;

    this.getCatalogs();
    this._tabsControlService.updateProgect
      .pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        this.project = value;
        this.tabIndex = 1;
      });
    this._tabsControlService.updateActivity
      .pipe(takeUntil(this.notifier))
      .subscribe((value: any) => {
        this.activity = value;
        this.tabIndex = 2;
      });
    this._tabsControlService.updateProduct
      .pipe(takeUntil(this.notifier))
      .subscribe((value: any) => {
        this.product = value;
        this.tabIndex = 3;
      });
    this._tabsControlService.updateAdvance
      .pipe(takeUntil(this.notifier))
      .subscribe((value: any) => {
        this.advance = value;
        this.tabIndex = 3;
      });
    this.getCurrentQuarter();
  }

  updateTab(index: number): void {
    this.tabIndex = index;
  }

  getCurrentQuarter() {
    const today = new Date();
    const month = today.getMonth();
    if (month < 3) {
      this.currentQuarter = 1;
    } else if (month < 6) {
      this.currentQuarter = 2;
    } else if (month < 9) {
      this.currentQuarter = 3;
    } else {
      this.currentQuarter = 4;
    }
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['categoria']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoProducto']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataCategoria, dataTipoProducto]) => {
        this.catCategoria = dataCategoria.catalogo;
        this.catTipoProducto = dataTipoProducto.catalogo;
      });
  }

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
