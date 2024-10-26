import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TabsControlService } from '../services/tabs-control.service';
import { TableColumn } from '@common/models/tableColumn';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { Subject, lastValueFrom, takeUntil, forkJoin } from 'rxjs';
import { getCveProducto, getGlobalStatus } from '@common/utils/Utils';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { IResponseConsultarProductos } from '@common/interfaces/seguimiento/avances.interface';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import * as moment from 'moment';
import * as SecureLS from 'secure-ls';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  data: any[] = [];
  ls = new SecureLS({ encodingType: 'aes' });
  canEdit: boolean = this.ls.get('canEdit');
  columns: TableColumn[] = [
    { columnDef: 'product', header: 'Producto', alignLeft: true },
    {
      columnDef: 'estatus',
      header: 'Estatus',
      width: '140px',
    },
  ];
  actions: TableActionsI = {
    custom: [
      {
        id: 'add',
        icon: 'add',
        name: 'Registrar Avances',
      },
    ],
  };
  loading = false;
  activeProduct: number = 0;
  @Input() currentQuarter: number = 2;
  @Input() catCategoria: IItemCatalogoResponse[] = [];
  @Input() catTipoProducto: IItemCatalogoResponse[] = [];
  selectedActividad: any = null;
  notifier = new Subject();
  selectedProject!: any;

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _avancesService: AvancesService,
    private catalogService: CatalogsService
  ) {
    this.currentQuarter = moment().quarter();
    if (this.canEdit)
      this.actions.custom?.push({
        id: 'edit',
        icon: 'edit',
        name: 'Editar Avances',
      });
    this.getCatalogs();
    this.buildForm();
    this.formEvents();
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
        {
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
        }
      });
  }
  async formEvents(): Promise<void> {
    this._tabsControlService.updateProgect.subscribe((value) => {
      this.selectedProject = value;
    });
    this._tabsControlService.updateProgectName.subscribe((value: string) => {
      this.form.controls['project'].setValue(value);
    });
    this._tabsControlService.updateActivityName.subscribe((value: string) => {
      this.form.controls['activity'].setValue(value);
    });
    this._tabsControlService.updateActivity.subscribe((value) => {
      this.selectedActividad = value;
      this.getProducts(value.idActividad);
    });
  }

  async getProducts(idActividad: number): Promise<void> {
    const data2 = await this.getProductsByActivity(
      idActividad,
      this.currentQuarter
    );
    this.data = data2;
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'project',
        label: 'Clave y Nombre del Proyecto',
        readonly: true,
      })
    );
    questions.push(
      new TextboxQuestion({
        nane: 'activity',
        label: 'Clave y Nombre de la Actividad',
        readonly: true,
      })
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.data = [
      {
        productId: 1,
        product: '001-01-1-IR Informe de la reunión nacional',
        estatus: 'Revisado',
      },
      {
        productId: 2,
        product:
          '001-02-2-AE Agenda estratégica para el desarrollo de visitas o encuentros en las entidades 2023',
        estatus: 'Sin Revisar',
      },
      {
        productId: 3,
        product: '001-03-2-MS Minuta de acuerdos',
        estatus: 'En Revisión',
      },
    ];
    this.loading = false;
  }

  async getProductsByIdActividad(
    idActividad: number
  ): Promise<IItemProductResponse[]> {
    let data: any[] = [];
    const value = await lastValueFrom(
      this._avancesService.consultarProductos(idActividad, this.currentQuarter)
    );
    data = value.respuesta.map((item) => {
      return {
        ...item,
        product: ` ${item.cxNombre}`,
        estatus: 'Sin Revisar',
      };
    });
    return data;
  }

  async getProductsByActivity(
    idActividad: number,
    mes: number
  ): Promise<IResponseConsultarProductos[]> {
    let products: IResponseConsultarProductos[] = [];
    const value = await lastValueFrom(
      this._avancesService.consultarProductos(idActividad, mes)
    );
    products = value.respuesta.reverse();
    products = products.map((item, index) => {
      return {
        ...item,
        product: `${getCveProducto({
          catTipoProducto: this.catTipoProducto,
          catCategoria: this.catCategoria,
          cveProyecto: this.selectedProject.cveProyecto,
          cveUnidad: this.selectedProject.cveUnidad,
          activitySelected: this._tabsControlService.activity,
          cveProducto: index + 1,
          //cveProducto: parseInt(item.cveProducto),
          idCategorizacion: item.idCategorizacion,
          idTipoProducto: item.idTipoProducto,
        })} ${item.cxNombre}`,
        //estatus: getGlobalStatus(item.csEstatus), FIX: Se cambio csEstatus =>>  csEstatusMensual
        estatus: getGlobalStatus(item.csEstatusMensual),
      };
    });
    return products;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case 'add':
      case 'edit':
        if (this.activeProduct) {
          await new Promise((resolve) => {
            this.activeProduct = 0;
            setTimeout(() => {
              resolve(true);
            }, 2);
          });
        }
        this.activeProduct = event.value.idProducto;
        this._tabsControlService.product = event.value;
        this._tabsControlService.productName = event.value.product;
        this.navigate.emit(3);
        break;
    }
  }

  showActionIf = (action: string, value: any): boolean => {
    let idTipoUsuario = this.ls.get('dUaStEaR').idTipoUsuario;
    if (action === 'add') {
      if (idTipoUsuario == 'PLANEACION') {
        return false;
      }
    }
    if (action === 'edit') {
      if (value.idEvidenciaTrimestral) return true;
      else return false;
    }
    return true;
  };

  ngOnDestroy() {
    this.notifier.complete();
  }
}
