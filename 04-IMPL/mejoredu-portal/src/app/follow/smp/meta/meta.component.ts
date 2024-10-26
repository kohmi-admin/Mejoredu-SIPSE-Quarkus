import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TableActionsI, TableConsts } from '@common/mat-custom-table/consts/table';
import { TableColumn } from '@common/models/tableColumn';
import { TabsControlService } from '../services/tabs-control.service';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  data: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'avance', header: 'Avance de las Metas para el Bienestar y Parámetros', alignLeft: true },
  ];
  @Input() currentQuarter: number = 1;
  actions: TableActionsI = {
    custom: [
      {
        id: 'view',
        icon: 'visibility',
        name: 'Ver Indicadores',
      }
    ],
  };
  loading = true;
  activeMeta: number = 0;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
  ) {
    this.getAll();
    this.buildForm();
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'project',
        label: 'Nombre del Programa Institucional',
        value: 'Programa Institucional de la MEJOREDU',
        readonly: true,
      }),
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.data = [
      {
        activityId: 1,
        avance: '001 Desarrollar acciones de coordinación y seguimiento del Sistema Nacional de Mejora Continua de la Educación',
      },
      {
        activityId: 2,
        avance: '002 Gestionar las políticas y procesos de MEJOREDU',
      },
      {
        activityId: 3,
        avance: '003 Desarrollar la Estrategia de comunicación institucional',
      },
    ];
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.activeMeta = event.value.activityId;
        this._tabsControlService.meta = this.activeMeta;
        this._tabsControlService.avance = event.value.avance;
        break;
    }
  }

  submit() {

  }
}
