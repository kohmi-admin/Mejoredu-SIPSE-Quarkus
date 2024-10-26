import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableActionsI, TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TabsControlService } from '../services/tabs-control.service';
import { TableColumn } from '@common/models/tableColumn';
import { ProductResumeI } from './interfaces/product-resume';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { getCveActividad, getGlobalStatus } from '@common/utils/Utils';
import * as SecureLS from 'secure-ls';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  validateQuestions: QuestionBase<any>[] = [];
  data: any[] = [];
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser = this.ls.get('dUaStEaR');
  canEdit: boolean = true;
  idAnhio = this.ls.get('yearNav');
  columns: TableColumn[] = [
    { columnDef: 'product', header: 'Producto', alignLeft: true },
    { columnDef: 'estatus', header: 'Estatus', width: '140px',   },
    { columnDef: 'observaciones', header: 'Observaciones', width: '180px' },
  ];
  actions: TableActionsI = {
    custom: [
      {
        id: 'view',
        icon: 'visibility',
        name: 'Revisar',
      }
    ],
  };
  observaciones: any;
  value;
  calendars: any[] = [
    [
      {
        name: 'Calendarización del Producto Programado',
        items: [
          { name: 'Enero', value: 1 },
          { name: 'Febrero', value: 3 },
          { name: 'Marzo', value: 3 },
          { name: 'Abril', value: 4 },
          { name: 'Mayo', value: 2 },
          { name: 'Junio', value: 2 },
          { name: 'Julio', value: 2 },
          { name: 'Agosto', value: 2 },
          { name: 'Septiembre', value: 2 },
          { name: 'Octubre', value: 2 },
          { name: 'Noviembre', value: 2 },
          { name: 'Diciembre', value: 2 },
        ],
      },
    ],
    [
      {
        name: 'Calendarización del Producto Alcanzado',
        items: [
          { name: 'Enero', value: 1 },
          { name: 'Febrero', value: 3 },
          { name: 'Marzo', value: 1 },
          { name: 'Abril', value: 2 },
          { name: 'Mayo', value: 2 },
          { name: 'Junio', value: 1 },
          { name: 'Julio', value: 2 },
          { name: 'Agosto', value: 3 },
          { name: 'Septiembre', value: 1 },
          { name: 'Octubre', value: 2 },
          { name: 'Noviembre', value: 3 },
          { name: 'Diciembre', value: 2 },
        ],
      },
    ],
  ];
  loading = true;
  activeProduct: number = 0;
  activeActivityId: number = 0;
  activeActivity;
  @Input() currentQuarter: number = 2;

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private avancesService: AvancesService
  ) {
    const idUser = this.dataUser.idTipoUsuario
    if(idUser == 'ENLACE' || idUser == 'PRESUPUESTO' || idUser == 'SUPERVISOR'){
      this.canEdit = false;
    }
    this.getAll();
    this.buildForm();
    this.buildValidateQuestions();
    
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'project',
        label: 'Clave y Nombre del Proyecto',
        disabled: true,
        value: this._tabsControlService.projectNombreCve
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'activity',
        label: 'Clave y Nombre de la Actividad',
        disabled: true,
        value:this._tabsControlService.activityNombreCve
      }),
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  buildValidateQuestions(): void {
    const questions: QuestionBase<any>[] = [];
    let questStrings = [
      'Sin observaciones',
    ];
    questions.push(
      new TextboxQuestion({
        onlyLabel: true,
        label: 'Observaciones',
        value: '',
      }),
    );
    questStrings.forEach((str, index) => {
      questions.push(
        new TextboxQuestion({
          idElement: 247,
          nane: `${index}`,
          label: str,
          disabled: true
        }),
      );
    });
    
    questStrings = [
      /* '¿La denominación del producto entregado es congruente con el nombre programado?',
      '¿Se presenta como producto terminado? (A primera vista contiene los elementos que señala y no incluye leyendas del tipo "borrador", "preliminar", etc.)', */
    ];
    questStrings.forEach((str, index) => {
      questions.push(
        new TextboxQuestion({
          nane: `${str}-${index}`,
          label: str,
        }),
      );
    });
    this.validateQuestions = questions;
    /* questions.push(
      new TextboxQuestion({
        nane: `observaciones`,
        label: 'Observaciones',
      }),
    ); */
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.activeActivityId = this._tabsControlService.activity;
    this.submit();
    /* this.data = [
      {
        productId: 1,
        product: '001-01-1-IR Informe de la reunión nacional',
        estatus: 'Revisado',
        observaciones: 'Con Observaciones',
      },
      {
        productId: 2,
        product: '001-02-2-AE Agenda estratégica para el desarrollo de visitas o encuentros en las entidades 2023',
        estatus: 'Revisado',
        observaciones: 'Con Observaciones',
      },
      {
        productId: 3,
        product: '001-03-2-MS Minuta de acuerdos',
        estatus: 'Revisado',
        observaciones: 'Con Observaciones',
      },
    ]; */
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        if (this.activeProduct) {
          await new Promise((resolve) => {
            this.activeProduct = 0;
            setTimeout(() => {
              resolve(true);
            }, 2);
          });
        }
        this.activeProduct = event.value.productId;
        if(event.value.productId) {
          this.avancesService.consultarAvance(event.value.productId).subscribe(response =>
            {
              this.mapTableProductosProgramados(response.respuesta.productosProgramados);
            }
          )
        }
        break;
    }
  }

  submit() {
    this.avancesService.consultarProductos(this.activeActivityId, this.currentQuarter).subscribe(response => {
      this.data = this.mapDataTableProductByIdAction(response.respuesta);
    });
  }

  private mapDataTableProductByIdAction(products) {
    return products.map(product => {
      return {
        productId: product.idProducto,
        product: product.cveProducto + ' ' + product.cxNombre,
        estatus: getGlobalStatus(product.csEstatus),
        observaciones: product.observaciones
      }
    })
  }


  private mapTableProductosProgramados(productosProgramados) {
    let count = 0;
    productosProgramados.map(producto => {
      this.calendars[0][0].items[count].value = producto.productosProgramados;
      this.calendars[1][0].items[count].value = producto.productosEntregados;
      count++;
    })
  }
}
