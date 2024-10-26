import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ReportesService } from '@common/services/reportes/reportes.service';
import { getPorcentaje } from '@common/utils/Utils';
import { ReportActions } from '../class/report-actions.class';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: [
    '../mir-pi/mir-pi.component.scss',
    './seguimiento.component.scss',
  ],
})
export class SeguimientoComponent extends ReportActions {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  resumes: ResumeI[] = [
    {
      name: 'Total de Productos Cumplidos a la Fecha de Consulta',
      color: 'rgb(1, 112, 192)',
      value: 0,
    },
    {
      name: 'Total de Productos Cancelados a la Fecha de Consulta',
      color: 'rgb(0, 172, 0)',
      value: 0,
    },
  ];
  charts: ChartCardI[] = [];
  override reportName: string = 'Seguimiento';

  constructor(private reportesService: ReportesService) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.charts.push({
      title: 'Cumplimiento al Primer Trimestre',
      class: 'mid',
      show: false,
      chart: {
        id: '1-seg',
        isPercent: true,
        title: 'Cumplimiento al Primer Trimestre',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Cancelado',
            value: 4,
            color: COLORS.red,
          },
          {
            name: 'Cumplido',
            value: 88,
            color: COLORS.green,
          },
          {
            name: 'Parcialmente Cumplido',
            value: 6,
            color: COLORS.yellow,
          },
          {
            name: 'Superado',
            value: 6,
            color: COLORS.golden,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Cumplimiento al Segundo Trimestre',
      class: 'mid',
      show: false,
      chart: {
        id: '2-seg',
        isPercent: true,
        title: 'Cumplimiento al Segundo Trimestre',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Cancelado',
            value: 8,
            color: COLORS.red,
          },
          {
            name: 'Cumplido',
            value: 60,
            color: COLORS.green,
          },
          {
            name: 'No Cumplido',
            value: 20,
            color: COLORS.red,
          },
          {
            name: 'Previamente Cumplido',
            value: 4,
            color: COLORS.yellow,
          },
          {
            name: 'Superado',
            value: 12,
            color: COLORS.golden,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Cumplimiento al Tercer Trimestre',
      class: 'mid',
      show: false,
      chart: {
        id: '3-seg',
        isPercent: true,
        title: 'Cumplimiento al Tercer Trimestre',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Cancelado',
            value: 8,
            color: COLORS.red,
          },
          {
            name: 'Cumplido',
            value: 40,
            color: COLORS.green,
          },
          {
            name: 'No Cumplido',
            value: 4,
            color: COLORS.red,
          },
          {
            name: 'Previamente Cumplido',
            value: 14,
            color: COLORS.yellow,
          },
          {
            name: 'Superado',
            value: 12,
            color: COLORS.golden,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Cumplimiento al Cuarto Trimestre',
      class: 'mid',
      show: false,
      chart: {
        id: '4-seg',
        isPercent: true,
        title: 'Cumplimiento al Cuarto Trimestre',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Cancelado',
            value: 8,
            color: COLORS.red,
          },
          {
            name: 'Cumplido',
            value: 88,
            color: COLORS.green,
          },
          {
            name: 'No Cumplido',
            value: 4,
            color: COLORS.red,
          },
          {
            name: 'Previamente Cumplido',
            value: 4,
            color: COLORS.yellow,
          },
          {
            name: 'Superado',
            value: 12,
            color: COLORS.golden,
          },
        ],
      },
    });
    this.getSeguimiento();
  }

  getSeguimiento() {
    this.reportesService
      .consultaSeguimiento(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const respuesta = value.respuesta;
            this.resumes[0].value = respuesta.totalProductosCumplidos ?? 0;
            this.resumes[1].value = respuesta.totalProductosCancelados ?? 0;

            this.charts[0].chart.data = this.charts[0].chart.data.map(
              (value0) => {
                const finded = respuesta.primerTrimestre.filter(
                  (item) => item.categoria === value0.name
                );
                let valueFinded = 0;
                if (finded.length) {
                  valueFinded = finded[0].total;
                }
                return {
                  color: value0.color,
                  name: value0.name,
                  value: getPorcentaje(
                    respuesta.primerTrimestre,
                    'total',
                    valueFinded
                  ),
                };
              }
            );
            this.charts[0].show = true;

            this.charts[1].chart.data = this.charts[1].chart.data.map(
              (value0) => {
                const finded = respuesta.segundoTrimestre.filter(
                  (item) => item.categoria === value0.name
                );
                let valueFinded = 0;
                if (finded.length) {
                  valueFinded = finded[0].total;
                }
                return {
                  color: value0.color,
                  name: value0.name,
                  value: getPorcentaje(
                    respuesta.segundoTrimestre,
                    'total',
                    valueFinded
                  ),
                };
              }
            );
            this.charts[1].show = true;

            this.charts[2].chart.data = this.charts[2].chart.data.map(
              (value0) => {
                const finded = respuesta.tercerTrimestre.filter(
                  (item) => item.categoria === value0.name
                );
                let valueFinded = 0;
                if (finded.length) {
                  valueFinded = finded[0].total;
                }
                return {
                  color: value0.color,
                  name: value0.name,
                  value: getPorcentaje(
                    respuesta.tercerTrimestre,
                    'total',
                    valueFinded
                  ),
                };
              }
            );
            this.charts[2].show = true;

            this.charts[3].chart.data = this.charts[3].chart.data.map(
              (value0) => {
                const finded = respuesta.cuartoTrimestre.filter(
                  (item) => item.categoria === value0.name
                );
                let valueFinded = 0;
                if (finded.length) {
                  valueFinded = finded[0].total;
                }
                return {
                  color: value0.color,
                  name: value0.name,
                  value: getPorcentaje(
                    respuesta.cuartoTrimestre,
                    'total',
                    valueFinded
                  ),
                };
              }
            );
            this.charts[3].show = true;
          }
        },
        error: (err) => { },
      });
  }
}
