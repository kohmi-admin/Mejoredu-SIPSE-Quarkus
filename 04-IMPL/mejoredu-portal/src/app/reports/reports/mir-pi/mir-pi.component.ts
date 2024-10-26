import { Component } from '@angular/core';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { MatDialog } from '@angular/material/dialog';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { ReportActions } from '../../numeralia/class/report-actions.class';

@Component({
  selector: 'app-mir-pi',
  templateUrl: './mir-pi.component.html',
  styleUrls: ['./mir-pi.component.scss']
})
export class MirPiComponent extends ReportActions {
  resumes: ResumeI[] = [
    {
      name: 'Total de Productos para la Meta Programada',
      color: 'rgb(0, 172, 0)',
      value: 190,
    },
    {
      name: 'Total de Productos para la  Metas Alcanzada',
      color: 'rgb(1, 112, 192)',
      value: 188,
    },
  ];
  charts: ChartCardI[] = [];
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  override reportName: string = 'Alineación MIR-PI';

  constructor(
    private _dialog: MatDialog,
    private _formBuilder: QuestionControlService
  ) {
    super();
    this.buildForm();
    this.buildCharts();
  }

  buildForm(): void {
    const questions: any = [];

    questions.push(
      new DropdownQuestion({
        nane: 'Nivel',
        value: 1,
        label: 'Nivel',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
          {
            id: 1,
            value: 'Actividad',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'anio',
        value: '2023',
        label: 'Año',
        filter: true,
        options: [
          {
            id: '2023',
            value: '2023',
          },
          {
            id: '2022',
            value: '2022',
          },
          {
            id: '2021',
            value: '2021',
          },
          {
            id: '2020',
            value: '2020',
          },
          {
            id: '2019',
            value: '2019',
          },
          {
            id: '2018',
            value: '2018',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'Área Administrativa',
        value: 0,
        label: 'Área Administrativa',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'Programa Institucional',
        value: 1,
        label: 'Programa Institucional',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
          {
            id: 1,
            value: 'PI 2020-2024',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'Objetivo Prioritario',
        value: 1,
        label: 'Objetivo Prioritario',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
          {
            id: 1,
            value: 'Todos',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'Indicador MIR',
        value: 0,
        label: 'Indicador MIR',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'Estrategia Prioritaria',
        value: 1,
        label: 'Estrategia Prioritaria',
        filter: true,
        options: [
          {
            id: 0,
            value: '2.3 Apoyar la impkementación de la política de desarrollo social',
          },
          {
            id: 1,
            value: 'Todos',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'Acción Puntual',
        value: 0,
        label: 'Acción Puntual',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'Meta para el Bienestar o Parámetro',
        value: 0,
        label: 'Meta para el Bienestar o Parámetro',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
        ],
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  buildCharts(): void {
    this.charts.push({
      title: 'Suma de Meta Alcanzada',
      chart: {
        id: 'mor-1',
        title: 'Suma de Meta Alcanzada',
        title2: 'Suma de Meta Programada',
        type: CHART_TYPE.Mixed,
        data: [
          {
            name: 'Trim 1',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Trim 2',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Trim 3',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Trim 4',
            value: 18,
            color: COLORS.green,
          },
        ],
        data2: [
          {
            name: 'Trim 1',
            value: 5,
            color: COLORS.blue,
          },
          {
            name: 'Trim 2',
            value: 10,
            color: COLORS.blue,
          },
          {
            name: 'Trim 3',
            value: 5,
            color: COLORS.blue,
          },
          {
            name: 'Trim 4',
            value: 18,
            color: COLORS.blue,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Suma de Meta Alcanzada',
      chart: {
        id: 'mor-2',
        title: 'Suma de Meta Alcanzada',
        title2: 'Suma de Meta Programada',
        type: CHART_TYPE.Mixed,
        isPercent: true,
        data: [
          {
            name: '2021',
            value: 110,
            color: COLORS.green,
          },
          {
            name: '2022',
            value: 100,
            color: COLORS.green,
          },
          {
            name: '2023',
            value: 120,
            color: COLORS.green,
          },
        ],
        data2: [
          {
            name: '2021',
            value: 100,
            color: COLORS.blue,
          },
          {
            name: '2022',
            value: 100,
            color: COLORS.blue,
          },
          {
            name: '2023',
            value: 100,
            color: COLORS.blue,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Cumplimiento',
      chart: {
        id: 'mor-3',
        // isPercent: true,
        title: 'Cumplimiento',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'Cumplido',
            value: 28,
            color: COLORS.green,
          },
          {
            name: 'Superado',
            value: 3,
            color: COLORS.yellow,
          },
          {
            name: 'Parcialmente Cumplido',
            value: 2,
            color: COLORS.blue,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Acción Puntual',
      chart: {
        id: 'mor-4',
        title: 'Actividades Cumplidas',
        title2: 'Actividades Programadas',
        type: CHART_TYPE.MixedBarsHorizontal,
        data: [
          {
            name: '2.3.1 Establecer mecanismos d...',
            value: 19,
            color: COLORS.green,
          },
          {
            name: '2.3.2 Desarrollar evaluaciones...',
            value: 7,
            color: COLORS.green,
          },
          {
            name: '2.3.3 Proponer estrategias de...',
            value: 3,
            color: COLORS.green,
          },
        ],
        data2: [
          {
            name: '2.3.1 Establecer mecanismos d...',
            value: 19,
            color: COLORS.blue,
          },
          {
            name: '2.3.2 Desarrollar evaluaciones...',
            value: 3,
            color: COLORS.blue,
          },
          {
            name: '2.3.3 Proponer estrategias de...',
            value: 3,
            color: COLORS.blue,
          },
        ],
      },
    });
  }
}
