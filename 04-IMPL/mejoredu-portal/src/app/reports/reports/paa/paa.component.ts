import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { MatDialog } from '@angular/material/dialog';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { ReportActions } from '../../numeralia/class/report-actions.class';

@Component({
  selector: 'app-paa',
  templateUrl: './paa.component.html',
  styleUrls: ['./paa.component.scss'],
})
export class PaaComponent extends ReportActions {
  resumes: ResumeI[] = [
    {
      name: 'Proyectos',
      color: 'rgb(0, 172, 0)',
      value: 60,
    },
    {
      name: 'Actividades',
      color: 'rgb(1, 112, 192)',
      value: 549,
    },
    {
      name: 'Productos',
      color: 'rgb(101, 40, 165)',
      value: 901,
    },
  ];
  charts: ChartCardI[] = [];
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  @ViewChild('TABLE') override table!: ElementRef;
  override reportName: string = 'PAA';

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
        nane: 'Acción',
        value: 0,
        label: 'Acción',
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
        ],
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  buildCharts(): void {
    this.charts.push({
      title: 'Entregables Programados',
      chart: {
        id: 'r-paa1',
        title: 'Entregables Programados',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Enero',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Febrero',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Marzo',
            value: 15,
            color: COLORS.green,
          },
          {
            name: 'Abril',
            value: 18,
            color: COLORS.green,
          },
          {
            name: 'Mayo',
            value: 7,
            color: COLORS.green,
          },
          {
            name: 'Junio',
            value: 32,
            color: COLORS.green,
          },
          {
            name: 'Julio',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Agosto',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Septiembre',
            value: 15,
            color: COLORS.green,
          },
          {
            name: 'Octubre',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Noviembre',
            value: 10,
            color: COLORS.green,
          },
          {
            name: 'Diciembre',
            value: 28,
            color: COLORS.green,
          },

          {
            name: 'Enero',
            value: 3,
            color: COLORS.green,
          },
          {
            name: 'Febrero',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Marzo',
            value: 17,
            color: COLORS.green,
          },
          {
            name: 'Abril',
            value: 34,
            color: COLORS.green,
          },
          {
            name: 'Mayo',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Junio',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Julio',
            value: 16,
            color: COLORS.green,
          },
          {
            name: 'Agosto',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Septiembre',
            value: 3,
            color: COLORS.green,
          },
          {
            name: 'Octubre',
            value: 12,
            color: COLORS.green,
          },
          {
            name: 'Noviembre',
            value: 4,
            color: COLORS.green,
          },
          {
            name: 'Diciembre',
            value: 40,
            color: COLORS.green,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Estado de Proyectos',
      chart: {
        id: 'r-paa2',
        // isPercent: true,
        title: 'Estado de Proyectos',
        type: CHART_TYPE.HorizontalBar,
        data: [
          {
            name: 'Acta de Sesión',
            value: 44,
            color: COLORS.green,
          },
          {
            name: 'Informe de Actividades',
            value: 39,
            color: COLORS.blue,
          },
          {
            name: 'Informe de Seguimiento',
            value: 20,
            color: COLORS.golden,
          },
          {
            name: 'Revista y Síntesis',
            value: 12,
            color: COLORS.orange,
          },
          {
            name: 'Informe de Resultados',
            value: 8,
            color: COLORS.purple,
          },
          {
            name: 'Informe de Reuniones',
            value: 8,
            color: COLORS.red,
          },
          {
            name: 'Informe de Trabajo',
            value: 5,
            color: COLORS.yellow,
          },
          {
            name: 'Memoria',
            value: 5,
            color: COLORS.green,
          },
          {
            name: 'Nota Técnica',
            value: 2,
            color: COLORS.purple,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Categoría',
      chart: {
        id: 'r-paa3',
        // isPercent: true,
        title: 'Categoría',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'Periodico',
            value: 129,
            color: COLORS.green,
          },
          {
            name: 'Final',
            value: 20,
            color: COLORS.yellow,
          },
          {
            name: 'Intermedio',
            value: 17,
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
        name: 'Producto',
        item: this.table.nativeElement
      }
    ]);
  }
}
