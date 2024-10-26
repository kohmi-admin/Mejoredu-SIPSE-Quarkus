import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { TableColumn } from '@common/models/tableColumn';
import { EstatusProgramaticoService } from '@common/services/seguimiento/avances/estatus.programatico.service';
import { getCveActividad, getCveProducto, getCveProyecto } from '@common/utils/Utils';
import * as SecureLS from 'secure-ls';
import { TabsControlService } from '../services/tabs-control.service';
import { GeneralDataI } from './interfaces/general-data.interface';

@Component({
  selector: 'app-general-data',
  templateUrl: './general-data.component.html',
  styleUrls: ['./general-data.component.scss']
})
export class GeneralDataComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  ls = new SecureLS({ encodingType: 'aes' });
  questions: QuestionBase<any>[] = [];
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
        name: 'Calendarización del Producto Modificado',
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
    [
      {
        name: 'Calendarización del Producto Alcanzado',
        items: [
          { name: 'Enero', value: 0 },
          { name: 'Febrero', value: 0 },
          { name: 'Marzo', value: 0 },
          { name: 'Abril', value: 0 },
          { name: 'Mayo', value: 0 },
          { name: 'Junio', value: 0 },
          { name: 'Julio', value: 0 },
          { name: 'Agosto', value: 0 },
          { name: 'Septiembre', value: 0 },
          { name: 'Octubre', value: 0 },
          { name: 'Noviembre', value: 0 },
          { name: 'Diciembre', value: 0 },
        ],
      },
    ]
  ];
  data: any;
  columns: TableColumn[] = [
    { columnDef: 'folioSolicitud', header: 'Folio de Solicitud' },
    { columnDef: 'folioSIF', header: 'Folio SIF', width: '80px' },
    { columnDef: 'fechaSolicitud', header: 'Fecha de Solicitud' },
    { columnDef: 'fechaAutorizacion', header: 'Fecha de Autorización' },
    { columnDef: 'unidad', header: 'Unidad' },
    { columnDef: 'anio', header: 'Año' },
    { columnDef: 'tipoDeAdecuacion', header: 'Tipo de Adecuación' },
    { columnDef: 'tipoModificacion', header: 'Tipo de Modificación' },
    { columnDef: 'montoAplicacion', header: 'Monto de Aplicación' },
    { columnDef: 'estatus', header: 'Estatus' },

  ];
  actions: TableActionsI = {
    view: true,
  };
  loading = true;
  activeProduct: number = 0;
  yearNav

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _estatusProgramatico: EstatusProgramaticoService
  ) {
    this.yearNav = this.ls.get('yearNav');
    this.activeProduct = this._tabsControlService.product;
    this.getAll();
  }

  submit() { }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'clave',
        disabled: true,
        label: 'Clave y Nombre de la Unidad',
        value: '1100 Secretaría Ejecutiva',
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'Clave Proyecto',
        label: 'Clave Proyecto',
        disabled: true,
        value: this.data.cveProyecto
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'Nombre del Proyecto',
        label: 'Nombre del Proyecto',
        disabled: true,
        value: this.data.nombreProyecto
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'Clave',
        label: 'Clave Actividad',
        disabled: true,
        value: this.data.cveActividad
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'Nombre de la Actividad',
        label: 'Nombre de la Actividad',
        disabled: true,
        value: this.data.nombreActividad
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'ClaveProducto',
        label: 'Clave del Producto',
        disabled: true,
        value: this.data.cveProducto
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'NumProducto',
        label: 'Número del Producto',
        disabled: true,
        value: this.data.numeroProducto
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'NombreProducto',
        label: 'Nombre del Producto',
        disabled: true,
        value: this.data.nombreProducto
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'Categorización del Producto',
        label: 'Categorización del Producto',
        disabled: true,
        value: this.data.categorizacion
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'Tipo del Producto',
        label: 'Tipo del Producto',
        disabled: true,
        value: this.data.tipoProducto
      }),
    );

    questions.push(
      new TextboxQuestion({
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        disabled: true,
        value: this.data.nombreProyectoModificado
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'nombreActividad',
        label: 'Nombre de la Actividad',
        disabled: true,
        value: this.data.nombreActividadModificado
      }),
    );
    questions.push(
      new TextboxQuestion({
        nane: 'Nombre del Producto',
        label: 'Nombre del Producto',
        disabled: true,
        value: this.data.nombreProductoModificado
      }),
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this._estatusProgramatico.consultarDatosGenerales(this.activeProduct).subscribe(response => {
      this.data = response.respuesta;
      this.mapDatosGenerales();
      this.buildForm();
      this.mapCalendars();
      this.loading = false;
    })
    /* this.data = [
      {
        folioSolicitud: '001',
        folioSIF: '001',
        fechaSolicitud: '01/01/2021',
        fechaAutorizacion: '01/01/2021',
        unidad: '1100 Secretaría Ejecutiva',
        anio: '2021',
        tipoDeAdecuacion: 'Programática',
        tipoModificacion: 'Incremento',
        montoAplicacion: 1000000,
        estatus: 'En Proceso',
      },
    ]; */
  }

  private mapCalendars() {
    let count = 0;
    this.data.calendarizacion.map(mes => {
      this.calendars[0][0].items[count].value = mes.programado == null ? 0 : mes.programado;
      this.calendars[1][0].items[count].value = mes.modificado == null ? 0 : mes.modificado;
      this.calendars[2][0].items[count].value = mes.entregado == null ? 0 : mes.entregado;
      count++;
    })
  }

  private mapDatosGenerales() {
    this.data.cveActividad = getCveActividad(
      {
        numeroActividad: this.data.cveActividad,
        cveProyecto: this.data.cveProyecto,
        cveUnidad: this.data.cveUnidad
      }
    );
    this.data.cveProyecto = getCveProyecto({
      yearNav: this.yearNav,
      /* cveUnidad: ' ', */
      cveProyecto: this.data.cveProyecto
    });
    
    /* this.data.cveProducto = 
    getCveProducto(
      {
        cveProyecto: this.data.cveProyecto,
        catCategoria: [this.data.categorizacion],
        catTipoProducto: [this.data.tipoProducto],
        idCategorizacion: this.data.idCategorizacion,
        idTipoProducto: this.data.idTipoProducto,
        cveProducto: this.data.cveProducto,
      }
    ) */
  }
}
