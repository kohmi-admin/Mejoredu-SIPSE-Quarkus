import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { ReportActions } from '../../numeralia/class/report-actions.class';

interface ActivitiesI {
  activity: string;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  total: number;
}

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['../mir-pi/mir-pi.component.scss', './presupuesto.component.scss']
})
export class PresupuestoComponent extends ReportActions {
  resumes: ResumeI[] = [
    {
      name: 'Presupuesto Asignado',
      color: 'rgb(0, 172, 0)',
      value: '$2,069,095',
    },
    {
      name: 'Total Actividades',
      color: 'rgb(1, 112, 192)',
      value: '549',
    },
    {
      name: 'Total Productos',
      color: 'rgb(101, 40, 165)',
      value: '901',
    },
  ];
  charts: ChartCardI[] = [];
  activities: ActivitiesI[] = [
    {
      activity: `Impulsar la estrategia para avanzar en la coordinación del SNMCE y dar
        seguimiento a la Mejora Continua de la Educación en el SEN`,
      january: 0,
      february: 90875,
      march: 861900,
      april: 90875,
      may: 90875,
      june: 90875,
      july: 90875,
      august: 90875,
      september: 451170,
      october: 119900,
      november: 90875,
      december: 0,
      total: 2069095,
    },
    {
      activity: `Total`,
      january: 0,
      february: 90875,
      march: 861900,
      april: 90875,
      may: 90875,
      june: 90875,
      july: 90875,
      august: 90875,
      september: 451170,
      october: 119900,
      november: 90875,
      december: 0,
      total: 2069095,
    }
  ];
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  @ViewChild('TABLE') override table!: ElementRef;
  override reportName: string = 'Actividad PAA';

  constructor(
    private _formBuilder: QuestionControlService
  ) {
    super();
    this.buildForm();

    this.charts.push({
      title: 'Suma del Presupuesto Asignado por Partida',
      class: '',
      chart: {
        id: '1-r-pre',
        title: 'Partida',
        type: CHART_TYPE.Pie,
        isCurrency: true,
        calculatePercent: true,
        suffix: 'mill.',
        data: [
          {
            name: 'Congreso y Convenciones',
            value: 1.12,
            color: COLORS.green,
          },
          {
            name: 'Pasajes Aéreos Nacionales',
            value: 0.6,
            color: COLORS.orange,
          },
          {
            name: 'Viáticos Nacionales',
            value: 0.22,
            color: COLORS.blue,
          },
          {
            name: 'Pasajes Terrestres Nacionales',
            value: 0.13,
            color: COLORS.golden,
          },
        ],
      },
    });

    // chats 2
    this.charts.push({
      title: 'Suma de Presupuesto Asignado 2024',
      class: 'tbl',
      chart: {
        id: '2-r-pre',
        isPercent: false,
        isCurrency: true,
        calculatePercent: true,
        suffix: 'mill.',
        title: 'Suma de Presupuesto Asignado 2024',
        type: CHART_TYPE.HorizontalBar,
        data: [
          {
            name: 'Enero',
            value: 0,
            color: COLORS.green,
          },
          {
            name: 'Febrero',
            value: 0.1,
            color: COLORS.green,
          },
          {
            name: 'Marzo',
            value: 1.0,
            color: COLORS.green,
          },
          {
            name: 'Abril',
            value: 0.1,
            color: COLORS.green,
          },
          {
            name: 'Mayo',
            value: 0.1,
            color: COLORS.green,
          },
          {
            name: 'Junio',
            value: 0.1,
            color: COLORS.green,
          },
          {
            name: 'Julio',
            value: 0.1,
            color: COLORS.green,
          },
          {
            name: 'Agosto',
            value: 0.1,
            color: COLORS.green,
          },
          {
            name: 'Septiembre',
            value: 0.4,
            color: COLORS.green,
          },
          {
            name: 'Octubre',
            value: 0.2,
            color: COLORS.green,
          },
          {
            name: 'Noviembre',
            value: 0.1,
            color: COLORS.green,
          },
          {
            name: 'Dicembre',
            value: 0,
            color: COLORS.green,
          },
        ],
      },
    });
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
        nane: 'Partida',
        value: 0,
        label: 'Partida',
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
