import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ReportesService } from '@common/services/reportes/reportes.service';
import { ChartCardI } from 'src/app/reports/chart-board/interfaces/chart-card.interface';
import { IProyectosUnidadResponse } from '@common/interfaces/reportes/reportesPAA.interface';
import { getPorcentaje, getRandomNumber } from '@common/utils/Utils';
import { ReportActions } from '../../class/report-actions.class';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent extends ReportActions {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  totalProjects: IProyectosUnidadResponse[] = [];
  resumes: ResumeI[] = [
    {
      key: 'totalProyectos',
      name: 'Proyectos',
      value: 0,
      color: 'rgb(0, 172, 0)',
    },
    {
      key: 'totalActividades',
      name: 'Actividades',
      value: 0,
      color: 'rgb(1, 112, 192)',
    },
    {
      key: 'totalProductos',
      name: 'Productos',
      value: 0,
      color: 'rgb(101, 40, 165)',
    },
    {
      key: 'totalEntregables',
      name: 'Entregables',
      value: 0,
      color: 'rgb(204, 51, 0)',
    },
  ];
  charts: ChartCardI[] = [];
  listColors = [
    COLORS.blue,
    COLORS.golden,
    COLORS.green,
    COLORS.orange,
    COLORS.purple,
    COLORS.red,
    COLORS.yellow,
  ];
  override reportName: string = 'PAA';

  constructor(
    private _dialog: MatDialog,
    private reportesService: ReportesService
  ) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.charts.push({
      title: 'Estado de Proyectos',
      show: false,
      chart: {
        id: '1',
        isPercent: true,
        title: 'Estado de Proyectos',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'Periodico',
            value: 40,
            color: COLORS.red,
          },
          {
            name: 'Final',
            value: 43,
            color: COLORS.green,
          },
          {
            name: 'Intermedio',
            value: 17,
            color: COLORS.blue,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Estado de Proyectos',
      show: false,
      chart: {
        id: '2',
        isPercent: true,
        title: 'Estado de Proyectos',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Informe de Seguimiento',
            value: 17.3,
            color: COLORS.green,
          },
          {
            name: 'Informe de resultados',
            value: 10.61,
            color: COLORS.green,
          },
          {
            name: 'Intervención Formitiva',
            value: 10.61,
            color: COLORS.green,
          },
          {
            name: 'Informe de Actividades',
            value: 8.38,
            color: COLORS.green,
          },
          {
            name: 'Nota Técnica',
            value: 7.26,
            color: COLORS.green,
          },
          {
            name: 'Instrumentos',
            value: 5.03,
            color: COLORS.green,
          },
          {
            name: 'Programa de Trabajo',
            value: 3.91,
            color: COLORS.green,
          },
          {
            name: 'Estudio',
            value: 2.79,
            color: COLORS.green,
          },
          {
            name: 'Marco Conceptual',
            value: 2.79,
            color: COLORS.green,
          },
          {
            name: 'Reporte de Capacitación',
            value: 2.79,
            color: COLORS.green,
          },
          {
            name: 'Base de Datos',
            value: 2.23,
            color: COLORS.green,
          },
          {
            name: 'Evaluación',
            value: 2.23,
            color: COLORS.green,
          },
          {
            name: 'Informe de Trabajo',
            value: 2.23,
            color: COLORS.green,
          },
          {
            name: 'Carpeta de Materiales',
            value: 1.68,
            color: COLORS.green,
          },
          {
            name: 'Lineamientos',
            value: 1.68,
            color: COLORS.green,
          },
          {
            name: 'Acta de Sesión',
            value: 1.12,
            color: COLORS.green,
          },
        ],
      },
    });
    this.getReportesPAA();
  }

  getReportesPAA() {
    this.reportesService
      .consultaReportesPAA(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const respuesta = value.respuesta;

            for (const item of this.resumes) {
              if (item.key) {
                item.value = respuesta[item.key];
              }
            }
            this.totalProjects = value.respuesta.proyectosUnidad;

            this.charts[0].chart.data = respuesta.productosCategoria.map(
              (value0) => {
                const finded = this.charts[0].chart.data.filter(
                  (item) => item.name === value0.categoria
                );
                let name = '';
                let color = '';
                if (finded.length) {
                  name = finded[0].name;
                  color = finded[0].color;
                } else {
                  const numberRandom = getRandomNumber(this.listColors.length);
                  const colorRandom = this.listColors[numberRandom];
                  name = value0.categoria;
                  color = colorRandom;
                }
                return {
                  name,
                  value: getPorcentaje(
                    respuesta.productosCategoria,
                    'totalProductos',
                    value0.totalProductos ?? 0
                  ),
                  color,
                };
              }
            );
            this.charts[0].show = true;

            this.charts[1].chart.data = respuesta.productosTipo?.map((item) => {
              return {
                name: item.tipo,
                value: getPorcentaje(
                  respuesta.productosTipo,
                  'cantidad',
                  item.cantidad
                ),
                color: COLORS.green,
              };
            });
            this.charts[1].show = true;
          }
        },
      });
  }

  deleteOne(item: string) {
    this.charts = this.charts.filter((chart) => chart.chart.id !== item);
  }
}
