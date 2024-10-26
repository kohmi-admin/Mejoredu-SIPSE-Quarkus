import { Component, EventEmitter, Output } from '@angular/core';
import { ProductDataI } from './interfaces/product.interface';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TabsControlService } from '../services/tabs-control.service';
import { TableColumn } from '@common/models/tableColumn';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [
    './products.component.scss',
    '../indicadores/indicadores.component.scss',
  ],
})
export class ProductsComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  activeIndicator: number = 0;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  avance: string = '';
  metaParametros: string = '';
  indicador: string = '';
  dataTable: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'causa', header: 'Causa', alignLeft: true },
    { columnDef: 'efecto', header: 'Efecto', alignLeft: true },
    { columnDef: 'otros', header: 'Otros Motivos', alignLeft: true },
  ];
  actions: TableActionsI = {
    view: true,
    edit: true,
    delete: true,
  };

  data: ProductDataI[] = [
    {
      product:
        '001-01-2-IM Instrumentos para la evaluación diagnóstica y formativa del aprendizaje de Expresión escrita en educación básica',
      enero: 0,
      febrero: 0,
      marzo: 0,
      abril: 0,
      mayo: 0,
      junio: 0,
      julio: 0,
      agosto: 0,
      septiembre: 1,
      octubre: 0,
      noviembre: 0,
      diciembre: 0,
    },
    {
      product:
        '001-04-2-IM Instrumentos de entrevista y grupos focales para recopilar experiencias sobre la valoración del aprendizaje de los NNA en condición de vulnerabilidad',
      enero: 0,
      febrero: 0,
      marzo: 0,
      abril: 0,
      mayo: 0,
      junio: 0,
      julio: 1,
      agosto: 0,
      septiembre: 0,
      octubre: 0,
      noviembre: 0,
      diciembre: 0,
    },
    {
      product:
        '008-22-2-IM Instrumentos diseñados para la investigación sobre el acoso entre estudiantes de educación media superior',
      enero: 0,
      febrero: 0,
      marzo: 0,
      abril: 0,
      mayo: 0,
      junio: 0,
      julio: 0,
      agosto: 1,
      septiembre: 0,
      octubre: 0,
      noviembre: 0,
      diciembre: 0,
    },
  ];

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _alertService: AlertService
  ) {
    this.buildForm();
    this.avance = this._tabsControlService.avance;
    this.metaParametros = this._tabsControlService.metaParametros;
    this.indicador = this._tabsControlService.indicador;
    this.getAll();
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextareaQuestion({
        nane: 'Justificación (Adecuación)',
        label: 'Justificación (Adecuación)',
        value: 'Ejemplo de Justificación',
        readonly: true,
      })
    );
    questions.push(
      new TextareaQuestion({
        nane: 'Causa',
        label: 'Causa',
      })
    );
    questions.push(
      new TextareaQuestion({
        nane: 'Efectos',
        label: 'Efectos',
      })
    );
    questions.push(
      new TextareaQuestion({
        nane: 'Otros Motivos',
        label: 'Otros Motivos',
      })
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.dataTable = [
      {
        id: 1,
        causa: 'Causa 1',
        efecto: 'Efecto 1',
        otros: 'Motivo Adicional',
      },
    ];
  }

  submit() {
    this.dataTable.push({
      id: this.dataTable.length + 1,
      causa: this.form.getRawValue()['Causa'],
      efecto: this.form.getRawValue()['Efectos'],
      otros: this.form.getRawValue()['Otros Motivos'],
    });
    this.dataTable = [...this.dataTable];
  }

  async onTableAction(event: TableButtonAction) {
    this.form.disable();
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.form.setValue({
          'Justificación (Adecuación)': 'Ejemplo de Justificación',
          Causa: event.value.causa,
          Efectos: event.value.efecto,
          'Otros Motivos': event.value.otros,
        });
        break;
      case TableConsts.actionButton.edit:
        this.form.setValue({
          'Justificación (Adecuación)': 'Ejemplo de Justificación',
          Causa: event.value.causa,
          Efectos: event.value.efecto,
          'Otros Motivos': event.value.otros,
        });
        this.form.enable();
        break;
      case TableConsts.actionButton.delete:
        {
          const result = await this._alertService.showConfirmation({
            message: '¿Está seguro de eliminar el registro?',
          });
          if (!result) return;
          this.dataTable = this.dataTable.filter(
            (item) => item.id !== event.value.id
          );
          this.dataTable = [...this.dataTable];
          this.form.setValue({
            'Justificación (Adecuación)': 'Ejemplo de Justificación',
            Causa: '',
            Efectos: '',
            'Otros Motivos': '',
          });
          this.form.enable();
        }
        break;
    }
  }
}
