import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { ReportesService } from '@common/services/reportes/reportes.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { getPorcentaje, getRandomNumber } from '@common/utils/Utils';
import { ReportActions } from '../class/report-actions.class';

@Component({
  selector: 'app-mir-pi',
  templateUrl: './mir-pi.component.html',
  styleUrls: ['./mir-pi.component.scss'],
})
export class MirPiComponent extends ReportActions {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  resumes: ResumeI[] = [
    {
      name: 'Total de Productos Alineados a la MIR',
      color: 'rgb(1, 112, 192)',
      value: 0,
    },
    {
      name: 'Porcentaje de Productos Alineados a la MIR',
      color: 'rgb(0, 172, 0)',
      value: 0,
      isPercentage: true,
    },
  ];
  resumes2: ResumeI[] = [
    {
      name: 'Total de Productos Alineados al PI',
      color: 'rgb(1, 112, 192)',
      value: 179,
    },
    {
      name: 'Porcentaje de Productos Alineados al PI',
      color: 'rgb(0, 172, 0)',
      value: 100,
      isPercentage: true,
    },
  ];
  charts: ChartCardI[] = [];
  charts2: ChartCardI[] = [];
  listColors = [
    COLORS.blue,
    COLORS.golden,
    COLORS.green,
    COLORS.orange,
    COLORS.purple,
    COLORS.red,
    COLORS.yellow,
  ];
  override reportName: string = 'Alineación_MIR-PI';

  constructor(private reportesService: ReportesService) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getAlineacion();

    this.charts.push({
      title: 'Estatus de Productos Programados Alineados a la MIR',
      class: 'dbl',
      chart: {
        id: '1-mipi',
        isPercent: true,
        title: 'Estatus de Productos Programados Alineados a la MIR',
        type: CHART_TYPE.Bar,
        data: [],
      },
    });

    this.charts.push({
      title: 'Porcentaje de Productos Alineados por Nivel de la MIR',
      chart: {
        id: '2-mipi',
        title: 'Porcentaje de Productos Alineados por Nivel de la MIR',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'Cancelado',
            value: 0,
            color: COLORS.red,
          },
          {
            name: 'Cumplido',
            value: 0,
            color: COLORS.green,
          },
          {
            name: 'En Proceso',
            value: 0,
            color: COLORS.blue,
          },
        ],
      },
    });

    this.charts.push({
      title:
        'Porcentaje de Productos Alcanzados Programados por Indicador a la Fecha de Consulta',
      class: 'full',
      show: false,
      chart: {
        id: '3-mipi',
        isPercent: true,
        title:
          'Porcentaje de Productos Alcanzados Programados por Indicador a la Fecha de Consulta',
        type: CHART_TYPE.Bar,
        data: [],
      },
    });

    this.charts2.push({
      title: 'Porcentaje de Productos Alineados a Objetivos Prioritarias',
      class: 'full',
      chart: {
        id: '4-mipi',
        isPercent: true,
        title: 'Porcentaje de Productos Alineados a Objetivos Prioritarias',
        type: CHART_TYPE.Line,
        data: [
          {
            name: 'Objetivo PI 1',
            value: 34,
            color: COLORS.green,
          },
          {
            name: 'Objetivo PI 2',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo PI 3',
            value: 12,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo PI 4',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo PI 5',
            value: 15,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo PI 6',
            value: 20,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title: 'Porcentaje de Productos Alineados a Objetivos del PI',
      class: 'mid',
      chart: {
        id: '5-mipi',
        isPercent: true,
        title: 'Porcentaje de Productos Alineados a Objetivos del PI',
        type: CHART_TYPE.Line,
        data: [
          {
            name: 'Objetivo 1',
            value: 43,
            color: COLORS.green,
          },
          {
            name: 'Objetivo 2',
            value: 3,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo 3',
            value: 8,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo 4',
            value: 19,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo 5',
            value: 6,
            color: COLORS.green,
          },
          {
            name: 'En Objetivo 6',
            value: 13,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title: 'Porcentaje de Productos Alineados a Estrategias Prioritarias',
      class: 'mid',
      chart: {
        id: '6-mipi',
        isPercent: true,
        title: 'Porcentaje de Productos Alineados a Estrategias Prioritarias',
        type: CHART_TYPE.Line,
        data: [
          {
            name: '1.1',
            value: 43,
            color: COLORS.green,
          },
          {
            name: '1.2',
            value: 3,
            color: COLORS.green,
          },
          {
            name: '1.3',
            value: 8,
            color: COLORS.green,
          },
          {
            name: '1.4',
            value: 19,
            color: COLORS.green,
          },
          {
            name: '1.5',
            value: 6,
            color: COLORS.green,
          },
          {
            name: '2.1',
            value: 13,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title: 'Porcentaje de Productos Alineados a Acciones Puntuales',
      class: 'full',
      chart: {
        id: '7-mipi',
        isPercent: true,
        title: 'Porcentaje de Productos Alineados a Acciones Puntuales',
        type: CHART_TYPE.Line,
        data: [
          {
            name: '1.1.1',
            value: 43,
            color: COLORS.green,
          },
          {
            name: '1.1.2',
            value: 3,
            color: COLORS.green,
          },
          {
            name: '1.1.3',
            value: 8,
            color: COLORS.green,
          },
          {
            name: '1.1.4',
            value: 19,
            color: COLORS.green,
          },
          {
            name: '1.2.1',
            value: 6,
            color: COLORS.green,
          },
          {
            name: '1.2.2',
            value: 13,
            color: COLORS.green,
          },

          {
            name: '1.2.3',
            value: 43,
            color: COLORS.green,
          },
          {
            name: '1.2.4',
            value: 3,
            color: COLORS.green,
          },
          {
            name: '1.3.1',
            value: 8,
            color: COLORS.green,
          },
          {
            name: '1.3.2',
            value: 19,
            color: COLORS.green,
          },
          {
            name: '1.3.3',
            value: 6,
            color: COLORS.green,
          },
          {
            name: '1.3.4',
            value: 13,
            color: COLORS.green,
          },
          {
            name: '2.1.1',
            value: 43,
            color: COLORS.green,
          },
          {
            name: '2.1.2',
            value: 3,
            color: COLORS.green,
          },
          {
            name: '2.1.3',
            value: 8,
            color: COLORS.green,
          },
          {
            name: '2.1.4',
            value: 19,
            color: COLORS.green,
          },
          {
            name: '3.1.1',
            value: 43,
            color: COLORS.green,
          },
          {
            name: '3.1.2',
            value: 3,
            color: COLORS.green,
          },
          {
            name: '3.1.3',
            value: 8,
            color: COLORS.green,
          },
          {
            name: '3.1.4',
            value: 19,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title: 'Estatus de Productos Programados Alineados al PI',
      chart: {
        id: '8-mipi',
        title: 'Estatus de Productos Programados Alineados al PI',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'Cancelado',
            value: 4,
            color: COLORS.red,
          },
          {
            name: 'Cumplido',
            value: 22,
            color: COLORS.green,
          },
          {
            name: 'En Proceso',
            value: 37,
            color: COLORS.blue,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        'Numero de Productos Alcanzados Programados por Acción Puntual a la Fecha de Consulta',
      class: 'dbl',
      chart: {
        id: '9-mipi',
        isPercent: true,
        title:
          'Numero de Productos Alcanzados Programados por Acción Puntual a la Fecha de Consulta',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: '1.1.1',
            value: 43,
            color: COLORS.red,
          },
          {
            name: '1.1.2',
            value: 3,
            color: COLORS.red,
          },
          {
            name: '1.1.3',
            value: 8,
            color: COLORS.red,
          },
          {
            name: '1.1.4',
            value: 19,
            color: COLORS.green,
          },
          {
            name: '1.2.1',
            value: 6,
            color: COLORS.green,
          },
          {
            name: '1.2.2',
            value: 13,
            color: COLORS.green,
          },

          {
            name: '1.2.3',
            value: 43,
            color: COLORS.green,
          },
          {
            name: '1.2.4',
            value: 3,
            color: COLORS.green,
          },
          {
            name: '1.3.1',
            value: 8,
            color: COLORS.green,
          },
          {
            name: '1.3.2',
            value: 19,
            color: COLORS.green,
          },
          {
            name: '1.3.3',
            value: 6,
            color: COLORS.green,
          },
          {
            name: '1.3.4',
            value: 13,
            color: COLORS.green,
          },
          {
            name: '2.1.1',
            value: 43,
            color: COLORS.green,
          },
          {
            name: '2.1.2',
            value: 3,
            color: COLORS.green,
          },
          {
            name: '2.1.3',
            value: 8,
            color: COLORS.green,
          },
          {
            name: '2.1.4',
            value: 19,
            color: COLORS.blue,
          },
          {
            name: '3.1.1',
            value: 43,
            color: COLORS.blue,
          },
          {
            name: '3.1.2',
            value: 3,
            color: COLORS.blue,
          },
          {
            name: '3.1.3',
            value: 8,
            color: COLORS.blue,
          },
          {
            name: '3.1.4',
            value: 19,
            color: COLORS.blue,
          },
        ],
      },
    });
  }

  getAlineacion() {
    this.reportesService
      .consultaAlineacion(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const respuesta = value.respuesta;
            this.resumes[0].value = respuesta.productosAlineadosMIR ?? 0;
            this.resumes[1].value = respuesta.porcentajeAlineadosMIR ?? 0;

            this.charts[0].chart.data =
              respuesta.productosAlineadosEstatusMIRDTOS?.map((value0) => {
                return {
                  name: value0.categoria,
                  value: getPorcentaje(
                    respuesta.productosAlineadosEstatusMIRDTOS,
                    'porcentaje',
                    value0.porcentaje
                  ),
                  color: COLORS.green,
                };
              });
            this.charts[0].show = true;

            this.charts[1].chart.data =
              respuesta.productosAlineadosNivelMIR.map((value0) => {
                const finded = this.charts[1].chart.data.filter(
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
                    respuesta.productosAlineadosNivelMIR,
                    'porcentaje',
                    value0.porcentaje ?? 0
                  ),
                  color,
                };
              });
            this.charts[1].show = true;

            this.charts[2].chart.data =
              respuesta.productosAlineadosPorIndicadorMIRDTOS?.map((value0) => {
                const numberRandom = getRandomNumber(this.listColors.length);
                const colorRandom = this.listColors[numberRandom];
                return {
                  name: value0.categoria,
                  value: getPorcentaje(
                    respuesta.productosAlineadosPorIndicadorMIRDTOS,
                    'porcentaje',
                    value0.porcentaje
                  ),
                  color: colorRandom,
                };
              });

            this.charts[2].show = true;
          }
        },
      });
  }
}
