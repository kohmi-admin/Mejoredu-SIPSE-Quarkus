import { Component, ElementRef, ViewChild } from '@angular/core';
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
  selector: 'app-adecuaciones',
  templateUrl: './adecuaciones.component.html',
  styleUrls: ['./adecuaciones.component.scss']
})
export class AdecuacionesComponent extends ReportActions {
  resumes: ResumeI[] = [
    {
      name: 'Total de Adecuaciones',
      color: 'rgb(0, 172, 0)',
      value: 256,
    },
  ];
  charts: ChartCardI[] = [];
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  @ViewChild('TABLE') override table!: ElementRef;
  override reportName: string = 'Adeciaciones Programáticas';

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
        nane: 'Folio',
        value: 0,
        label: 'Folio',
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
        nane: 'Tipo de Adecuación',
        value: 0,
        label: 'Tipo de Adecuación',
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

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  buildCharts(): void {
    this.charts.push({
      title: 'Cantidades por Tipo de Adecuación',
      chart: {
        id: 'ade-1',
        // isPercent: true,
        title: 'Cantidades por Tipo de Adecuación',
        type: CHART_TYPE.Pie,
        calculatePercent: true,
        data: [
          {
            name: 'Programática-Presupuestal',
            value: 118,
            color: COLORS.green,
          },
          {
            name: 'Programática',
            value: 120,
            color: COLORS.yellow,
          },
          {
            name: 'Presupuestal',
            value: 18,
            color: COLORS.blue,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Total de Adecuaciones 2020',
      chart: {
        id: 'ade-2',
        title: 'Programática',
        title2: 'Programática-Presupuestal',
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
      },
    });
    this.charts.push({
      title: 'Total de Adecuaciones 2021',
      chart: {
        id: 'ade-3',
        title: 'Programática',
        title2: 'Programática-Presupuestal',
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
      },
    });
    this.charts.push({
      title: 'Total de Adecuaciones 2022',
      chart: {
        id: 'ade-4',
        title: 'Programática',
        title2: 'Programática-Presupuestal',
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
      },
    });
    this.charts.push({
      title: 'Total de Adecuaciones 2023',
      chart: {
        id: 'ade-5',
        title: 'Programática',
        title2: 'Programática-Presupuestal',
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
      },
    });
  }

  exportTOExcel()
  {
    this.exportExcel([
      {
        name: 'Objetivo',
        item: this.table.nativeElement
      }
    ]);
  }
}
