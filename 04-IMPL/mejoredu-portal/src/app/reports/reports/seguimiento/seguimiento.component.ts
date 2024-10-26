import { Component } from '@angular/core';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { MatDialog } from '@angular/material/dialog';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { ReportActions } from '../../numeralia/class/report-actions.class';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoComponent extends ReportActions {
  resumes: ResumeI[] = [
    {
      name: 'Total de Productos',
      color: 'rgb(1, 112, 192)',
      value: 901,
    },
    {
      name: 'Suma de Entregables',
      color: 'rgb(0, 172, 0)',
      value: 57,
    },
  ];
  charts: ChartCardI[] = [];
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];

  constructor(
    private _dialog: MatDialog,
    private _formBuilder: QuestionControlService
  ) {
    super();
    this.buildForm();
    this.charts.push({
      title: 'Cumplimiento al Primer Trimestre',
      chart: {
        id: '1-segi',
        calculatePercent: true,
        title: 'Cumplimiento al Primer Trimestre',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'En Proceso',
            value: 12,
            color: COLORS.red,
          },
          {
            name: 'Cumplido',
            value: 11,
            color: COLORS.green,
          },
          {
            name: 'Cancelado',
            value: 1,
            color: COLORS.yellow,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Suma de Entregables Programados 2023',
      class: 'tbl',
      chart: {
        id: '2-segi',
        isPercent: false,
        title: 'Suma de Entregables Programados',
        title2: 'Suma de Entregables Ajustados',
        title3: 'Suma de Entregables Cumplidos',
        type: CHART_TYPE.MixedBars,
        data: [
          {
            name: 'Enero',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Febrero',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Marzo',
            value: 12,
            color: COLORS.green,
          },
          {
            name: 'Abril',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Mayo',
            value: 6,
            color: COLORS.green,
          },
          {
            name: 'Junio',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Julio',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Agosto',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Septiembre',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Octubre',
            value: 6,
            color: COLORS.green,
          },
          {
            name: 'Noviembre',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Dicembre',
            value: 5,
            color: COLORS.green,
          },
        ],
        data2: [
          {
            name: 'Enero',
            value: 9,
            color: COLORS.blue,
          },
          {
            name: 'Febrero',
            value: 2,
            color: COLORS.blue,
          },
          {
            name: 'Marzo',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Abril',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Mayo',
            value: 4,
            color: COLORS.blue,
          },
          {
            name: 'Junio',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Julio',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Agosto',
            value: 4,
            color: COLORS.blue,
          },
          {
            name: 'Septiembre',
            value: 5,
            color: COLORS.blue,
          },
          {
            name: 'Octubre',
            value: 4,
            color: COLORS.blue,
          },
          {
            name: 'Noviembre',
            value: 8,
            color: COLORS.blue,
          },
          {
            name: 'Dicembre',
            value: 3,
            color: COLORS.blue,
          },
        ],
        data3: [
          {
            name: 'Enero',
            value: 9,
            color: COLORS.orange,
          },
          {
            name: 'Febrero',
            value: 2,
            color: COLORS.orange,
          },
          {
            name: 'Marzo',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Abril',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Mayo',
            value: 4,
            color: COLORS.orange,
          },
          {
            name: 'Junio',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Julio',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Agosto',
            value: 4,
            color: COLORS.orange,
          },
          {
            name: 'Septiembre',
            value: 5,
            color: COLORS.orange,
          },
          {
            name: 'Octubre',
            value: 4,
            color: COLORS.orange,
          },
          {
            name: 'Noviembre',
            value: 8,
            color: COLORS.orange,
          },
          {
            name: 'Dicembre',
            value: 3,
            color: COLORS.orange,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Suma de Entregables Programados 2024',
      class: 'full',
      chart: {
        id: '3-segi',
        isPercent: false,
        title: 'Suma de Entregables Programados',
        title2: 'Suma de Entregables Ajustados',
        title3: 'Suma de Entregables Cumplidos',
        type: CHART_TYPE.MixedBars,
        data: [
          {
            name: 'Enero',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Febrero',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Marzo',
            value: 12,
            color: COLORS.green,
          },
          {
            name: 'Abril',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Mayo',
            value: 6,
            color: COLORS.green,
          },
          {
            name: 'Junio',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Julio',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Agosto',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Septiembre',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'Octubre',
            value: 6,
            color: COLORS.green,
          },
          {
            name: 'Noviembre',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Dicembre',
            value: 5,
            color: COLORS.green,
          },
        ],
        data2: [
          {
            name: 'Enero',
            value: 9,
            color: COLORS.blue,
          },
          {
            name: 'Febrero',
            value: 2,
            color: COLORS.blue,
          },
          {
            name: 'Marzo',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Abril',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Mayo',
            value: 4,
            color: COLORS.blue,
          },
          {
            name: 'Junio',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Julio',
            value: 6,
            color: COLORS.blue,
          },
          {
            name: 'Agosto',
            value: 4,
            color: COLORS.blue,
          },
          {
            name: 'Septiembre',
            value: 5,
            color: COLORS.blue,
          },
          {
            name: 'Octubre',
            value: 4,
            color: COLORS.blue,
          },
          {
            name: 'Noviembre',
            value: 8,
            color: COLORS.blue,
          },
          {
            name: 'Dicembre',
            value: 3,
            color: COLORS.blue,
          },
        ],
        data3: [
          {
            name: 'Enero',
            value: 9,
            color: COLORS.orange,
          },
          {
            name: 'Febrero',
            value: 2,
            color: COLORS.orange,
          },
          {
            name: 'Marzo',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Abril',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Mayo',
            value: 4,
            color: COLORS.orange,
          },
          {
            name: 'Junio',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Julio',
            value: 6,
            color: COLORS.orange,
          },
          {
            name: 'Agosto',
            value: 4,
            color: COLORS.orange,
          },
          {
            name: 'Septiembre',
            value: 5,
            color: COLORS.orange,
          },
          {
            name: 'Octubre',
            value: 4,
            color: COLORS.orange,
          },
          {
            name: 'Noviembre',
            value: 8,
            color: COLORS.orange,
          },
          {
            name: 'Dicembre',
            value: 3,
            color: COLORS.orange,
          },
        ],
      },
    });
  }

  buildForm(): void {
    const questions: any = [];

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
        nane: 'Proyecto',
        value: 0,
        label: 'Proyecto',
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
        nane: 'Actividad PAA',
        value: 0,
        label: 'Actividad PAA',
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
        nane: 'Producto',
        value: 0,
        label: 'Producto',
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
        nane: 'Categoría',
        value: 0,
        label: 'Categoría',
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
        nane: 'Tipo de Producto',
        value: 0,
        label: 'Tipo de Producto',
        filter: true,
        options: [
          {
            id: 0,
            value: 'Todos',
          },
          {
            id: 1,
            value: 'Investigación',
          },
          {
            id: 2,
            value: 'Criterios',
          },
          {
            id: 3,
            value: 'Evalución',
          },
          {
            id: 4,
            value: 'Intervención Formativa',
          },
          {
            id: 5,
            value: 'Programa de Formación',
          },
          {
            id: 6,
            value: 'Convenio',
          },
          {
            id: 7,
            value: 'Estudio',
          },
          {
            id: 8,
            value: 'Indicadores',
          },
          {
            id: 9,
            value: 'Lineamientos',
          },
          {
            id: 10,
            value: 'Sugerencias',
          }
        ],
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }
}
