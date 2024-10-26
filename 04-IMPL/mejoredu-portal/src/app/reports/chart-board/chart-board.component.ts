import { Component } from '@angular/core';
import { ChartCardI } from './interfaces/chart-card.interface';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chart-board',
  templateUrl: './chart-board.component.html',
  styleUrls: ['./chart-board.component.scss'],
})
export class ChartBoardComponent {
  charts: ChartCardI[] = [];

  constructor(
    private _dialog: MatDialog,
  ) {
    this.charts.push({
      title: 'Estado de Proyectos',
      chart: {
        id: '1',
        title: 'Estado de Proyectos',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'Registrados',
            value: 10,
            color: COLORS.blue,
          },
          {
            name: 'Modificados',
            value: 2,
            color: COLORS.yellow,
          },
          {
            name: 'Eliminados',
            value: 8,
            color: COLORS.red,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Presupuesto Anual por Actividad del Proyecto 1',
      chart: {
        id: '2',
        type: CHART_TYPE.Line,
        title: 'Presupuesto Anual por Actividad del Proyecto 1',
        data: [
          {
            name: 'Actividad 1',
            value: 10000,
            color: COLORS.green,
          },
          {
            name: 'Actividad 2',
            value: 6000,
            color: COLORS.yellow,
          },
          {
            name: 'Actividad 3',
            value: 2000,
            color: COLORS.blue,
          },
          {
            name: 'Actividad 4',
            value: 4000,
            color: COLORS.purple,
          },
          {
            name: 'Actividad 5',
            value: 8000,
            color: COLORS.orange,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Proyectos por Objetivo',
      chart: {
        id: '3',
        type: CHART_TYPE.Doughnut,
        title: 'Proyectos por Objetivo',
        data: [
          {
            name: 'Objetivo Prioritario 1',
            value: 20,
            color: COLORS.blue,
          },
          {
            name: 'Objetivo Prioritario 1',
            value: 5,
            color: COLORS.yellow,
          },
          {
            name: 'Objetivo Prioritario 3',
            value: 2,
            color: COLORS.red,
          },
          {
            name: 'Objetivo Prioritario 4',
            value: 3,
            color: COLORS.golden,
          },
          {
            name: 'Objetivo Prioritario 5',
            value: 4,
            color: COLORS.orange,
          },
          {
            name: 'Objetivo Prioritario 6',
            value: 6,
            color: COLORS.purple,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Actividades por Proyecto',
      chart: {
        id: '4',
        type: CHART_TYPE.Bar,
        title: 'Actividades por Proyecto',
        data: [
          {
            name: 'Proyecto 001',
            value: 25,
            color: COLORS.blue,
          },
          {
            name: 'Proyecto 002',
            value: 14,
            color: COLORS.yellow,
          },
          {
            name: 'Proyecto 003',
            value: 10,
            color: COLORS.red,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Actividades por Objetivo',
      chart: {
        id: '5',
        type: CHART_TYPE.Doughnut,
        title: 'Actividades por Objetivo',
        data: [
          {
            name: 'Objetivo Prioritario 1',
            value: 10,
            color: COLORS.blue,
          },
          {
            name: 'Objetivo Prioritario 1',
            value: 2,
            color: COLORS.yellow,
          },
          {
            name: 'Objetivo Prioritario 3',
            value: 2,
            color: COLORS.red,
          },
          {
            name: 'Objetivo Prioritario 4',
            value: 3,
            color: COLORS.golden,
          },
          {
            name: 'Objetivo Prioritario 5',
            value: 7,
            color: COLORS.orange,
          },
          {
            name: 'Objetivo Prioritario 6',
            value: 5,
            color: COLORS.purple,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Productos por Proyecto',
      chart: {
        id: '6',
        type: CHART_TYPE.Bar,
        title: 'Productos por Proyecto',
        data: [
          {
            name: 'Proyecto 001',
            value: 5,
            color: COLORS.blue,
          },
          {
            name: 'Proyecto 002',
            value: 2,
            color: COLORS.yellow,
          },
          {
            name: 'Proyecto 003',
            value: 3,
            color: COLORS.red,
          },
          {
            name: 'Proyecto 004',
            value: 3,
            color: COLORS.green,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Productos por Actividad',
      chart: {
        id: '7',
        type: CHART_TYPE.Pie,
        title: 'Productos por Actividad',
        data: [
          {
            name: 'Actividad 001',
            value: 3,
            color: COLORS.blue,
          },
          {
            name: 'Actividad 002',
            value: 1,
            color: COLORS.yellow,
          },
          {
            name: 'Actividad 003',
            value: 2,
            color: COLORS.red,
          },
          {
            name: 'Actividad 004',
            value: 2,
            color: COLORS.green,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Estatus de los Productos',
      chart: {
        id: '8',
        type: CHART_TYPE.Doughnut,
        title: 'Estatus de los Productos',
        data: [
          {
            name: 'Registrado',
            value: 3,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 1,
            color: COLORS.yellow,
          },
          {
            name: 'Eliminado',
            value: 2,
            color: COLORS.red,
          },
          {
            name: 'Iniciado',
            value: 2,
            color: COLORS.green,
          },
          {
            name: 'No Iniciado',
            value: 2,
            color: COLORS.orange,
          },
          {
            name: 'En Proceso',
            value: 2,
            color: COLORS.golden,
          },
        ],
      }
    });

    this.charts.push({
      title: 'Presupuesto Total por Proyecto',
      chart: {
        id: '9',
        type: CHART_TYPE.Line,
        title: 'Presupuesto Total por Proyecto',
        data: [
          {
            name: 'Proyecto 1',
            value: 20000,
            color: COLORS.green,
          },
          {
            name: 'Proyecto 2',
            value: 25000,
            color: COLORS.yellow,
          },
          {
            name: 'Proyecto 3',
            value: 30000,
            color: COLORS.blue,
          },
          {
            name: 'Proyecto 4',
            value: 16000,
            color: COLORS.purple,
          },
        ],
      }
    });

    // this.charts.push({
    //   title: 'Estado de Proyectos',
    //   chart: {
    //     id: '6',
    //     type: CHART_TYPE.Bar,
    //     title: 'Estado de Proyectos',
    //     data: [
    //       {
    //         name: 'Completos',
    //         value: 30,
    //         color: COLORS.green,
    //       },
    //       {
    //         name: 'Incompletos',
    //         value: 10,
    //         color: COLORS.yellow,
    //       },
    //       {
    //         name: 'Cancelados',
    //         value: 5,
    //         color: COLORS.red,
    //       },
    //     ],
    //   }
    // });

  }

  deleteOne(item: string) {
    this.charts = this.charts.filter((chart) => chart.chart.id !== item);
  }
}
