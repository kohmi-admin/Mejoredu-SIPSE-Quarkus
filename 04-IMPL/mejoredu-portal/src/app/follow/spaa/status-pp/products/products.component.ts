import { Component, EventEmitter, Output } from '@angular/core';
import { TableActionsI, TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TabsControlService } from '../services/tabs-control.service';
import { TableColumn } from '@common/models/tableColumn';
import { ProductResumeI } from './interfaces/product-resume';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { EstatusProgramaticoService } from '@common/services/seguimiento/avances/estatus.programatico.service';
import { getCveProducto, getGlobalStatus } from '@common/utils/Utils';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  data: ProductResumeI[] = [];
  columns: TableColumn[] = [
    { columnDef: 'product', header: 'Producto', alignLeft: true },
    { columnDef: 'categoria', header: 'Categoría', width: '80px' },
    { columnDef: 'tipo', header: 'Tipo', width: '180px' },
    { columnDef: 'noDeEntregablesProgramados', header: 'No. de Entregables<br />Programados', width: '130px' },
    { columnDef: 'noDeEntregablesAlcanzados', header: 'No. de Entregables<br />Alcanzados', width: '130px' },
    { columnDef: 'estatusDelProducto', header: 'Estatus del Producto', width: '130px', alignRight: true },
    { columnDef: 'revisadoPorLa3de', header: 'Revisado por la JD', width: '100px' },
    { columnDef: 'aprobadoPorLa3de', header: 'Aprobado por la JD', width: '100px' },
    { columnDef: 'fechaDeAprobacion', header: 'Fecha de Aprobación', width: '120px' },
    { columnDef: 'publicacion', header: 'Publicación', width: '100px' },
    { columnDef: 'tipoDePublicacion', header: 'Tipo de Publicación', width: '120px' },
    { columnDef: 'difusion', header: 'Difusión', width: '100px' },
  ];
  actions: TableActionsI = {
    view: true,
  };
  loading = true;
  activeProduct: number = 0;
  activeActivity: number = 0;
  currentQuarter: number = 2;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _estatusProgramatico: EstatusProgramaticoService
  ) {
    this.buildForm();
    this._tabsControlService.updateProgect.subscribe((value: number) => {
      this.form.get('project')?.setValue(value);
    });
    this._tabsControlService.updateActivity.subscribe((value: number) => {
      this.form.get('activity')?.setValue(value);
    });
    this.activeActivity = this._tabsControlService.activity;
    this.getAll();
    this.activeProduct = this._tabsControlService.product;
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'project',
        label: 'Clave y Nombre del Proyecto',
        disabled: true,
        value: this._tabsControlService.projectName
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'activity',
        label: 'Clave y Nombre de la Actividad',
        disabled: true,
        value: this._tabsControlService.activityName
      }),
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this._estatusProgramatico.consultarProductosByIdActividad(this.activeActivity, this.currentQuarter).
      subscribe(response => {
        this.data = this.mapTableProducts(response.respuesta);
      })
    /* this.data = [
      {
        productId: 1,
        product: '001-01-1-IR Informe de la reunión nacional',
        categoria: 'Final',
        tipo: 'Informe de Resultados Agencia',
        noDeEntregablesProgramados: 1,
        noDeEntregablesAlcanzados: 1,
        estatusDelProducto: 'Cumplido',
        revisadoPorLa3de: 'Sí',
        fechaDeSesion: '01/01/2021',
        aprobadoPorLa3de: 'Sí',
        fechaDeAprobacion: '01/01/2021',
        publicacion: 'Sí',
        tipoDePublicacion: 'Web Mejoredu',
        difusion: 'Redes Sociales',
      },
      {
        productId: 2,
        product: '001-02-2-AE Agenda estratégica para el desarrollo de visitas o encuentros en las entidades 2023',
        categoria: 'Intermedio',
        tipo: 'Agenda Estratégica',
        noDeEntregablesProgramados: 3,
        noDeEntregablesAlcanzados: 1,
        estatusDelProducto: 'En Proceso',
        revisadoPorLa3de: 'No',
        fechaDeSesion: 'NA',
        aprobadoPorLa3de: 'NA',
        fechaDeAprobacion: 'NA',
        publicacion: 'NA',
        tipoDePublicacion: 'NA',
        difusion: 'NA',
      },
      {
        productId: 3,
        product: '001-03-2-MS Minuta de acuerdos',
        categoria: 'Intermedio',
        tipo: 'Mecanismo de Seguimiento',
        noDeEntregablesProgramados: 2,
        noDeEntregablesAlcanzados: 0,
        estatusDelProducto: 'Cancelado',
        revisadoPorLa3de: 'No',
        fechaDeSesion: 'NA',
        aprobadoPorLa3de: 'NA',
        fechaDeAprobacion: 'NA',
        publicacion: 'NA',
        tipoDePublicacion: 'NA',
        difusion: 'NA',
      },
    ]; */
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.activeProduct = event.value.productId;
        this._tabsControlService.product = this.activeProduct;
        break;
    }
  }

  private mapTableProducts(products) {
    return products.map(product => {
      return {
        productId: product.idProducto,
        product: product.cveProducto + ' ' + product.nombreProducto,
        categoria: product.categoria,
        tipo: product.tipoProducto,
        noDeEntregablesProgramados: product.entregablesProgramados,
        noDeEntregablesAlcanzados: product.entregablesFinalizados,
        estatusDelProducto: getGlobalStatus(product.estatus),
        revisadoPorLa3de: product.revisado,
        aprobadoPorLa3de: product.aprobado,
        fechaDeAprobacion: product.fechaAprobacion,
        publicacion: product.publicado,
        tipoDePublicacion: product.tipoPublicacion,
        difusion: product.medioDifusion,
      }
    });
  }
}
