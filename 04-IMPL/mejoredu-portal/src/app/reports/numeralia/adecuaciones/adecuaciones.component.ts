import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ReportesService } from '@common/services/reportes/reportes.service';
import {
  getListColors,
  getPorcentaje,
  getRandomNumber,
} from '@common/utils/Utils';
import { ReportActions } from '../class/report-actions.class';

@Component({
  selector: 'app-adecuaciones',
  templateUrl: './adecuaciones.component.html',
  styleUrls: [
    '../mir-pi/mir-pi.component.scss',
    './adecuaciones.component.scss',
  ],
})
export class AdecuacionesComponent extends ReportActions {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  resumes: ResumeI[] = [
    {
      name: 'Total de Adecuaciones',
      color: 'rgb(1, 112, 192)',
      value: 0,
    },
  ];
  charts: ChartCardI[] = [];
  override reportName: string = 'Adecuaciones_Programáticas';

  constructor(private reportesService: ReportesService) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.charts.push({
      title: 'Porcentaje de Adecuaciones por Tipo',
      show: false,
      chart: {
        id: '1-adec',
        isPercent: true,
        title: 'Porcentaje de Adecuaciones por Tipo',
        type: CHART_TYPE.Pie,
        data: [
          {
            name: 'Programática',
            value: 0,
            color: COLORS.green,
          },
          {
            name: 'Programática Presupuestal',
            value: 0,
            color: COLORS.golden,
          },
          {
            name: 'Presupuestal',
            value: 0,
            color: COLORS.yellow,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Porcentaje de Adecuaciones por Unidad/Dirección General',
      class: 'dbl',
      show: false,
      chart: {
        id: '2-adec',
        title: 'Porcentaje de Adecuaciones por Unidad/Dirección General',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'DGAL',
            value: 3.23,
            color: COLORS.orange,
          },
          {
            name: 'DGPP',
            value: 16.13,
            color: COLORS.blue,
          },
          {
            name: 'SE / JD',
            value: 12.9,
            color: COLORS.orange,
          },
          {
            name: 'DGPP',
            value: 16.13,
            color: COLORS.purple,
          },
          {
            name: 'UASMCIE',
            value: 12.9,
            color: COLORS.yellow,
          },
          {
            name: 'UVIA',
            value: 54.84,
            color: COLORS.green,
          },
        ],
      },
    });
    this.charts.push({
      title: 'Porcentaje de Adecuaciones por Proyecto',
      class: 'full',
      show: false,
      chart: {
        id: '3-adec',
        title: 'Porcentaje de Adecuaciones por Proyecto',
        type: CHART_TYPE.Doughnut,
        data: [
          {
            name: 'Conducir las acciones para el cumplimiento de los objetivos de MEJOREDU',
            value: 12,
            color: COLORS.orange,
          },
          {
            name: 'Defensa jurídica y representación legal de la Comisión',
            value: 3,
            color: COLORS.blue,
          },
          {
            name: 'Desarrollo de sugerencias, lineamientos y materiales para apoyar la mejora de las escuelas',
            value: 6,
            color: COLORS.red,
          },
          {
            name: 'Difusión de productos institucionales que contribuyan a la mejora educativa',
            value: 3,
            color: COLORS.purple,
          },
          {
            name: 'Fortalecimiento de criterios, lineamientos y programas de formación continua',
            value: 54,
            color: COLORS.yellow,
          },
          {
            name: 'Gestión institucional para impulsar la mejora continua de la educación',
            value: 16,
            color: COLORS.green,
          },
          {
            name: 'Información y productos de seguimiento a los resultados de la mejora educativa',
            value: 3,
            color: COLORS.golden,
          },
        ],
      },
    });
    this.getAdecuaciones();
  }

  getAdecuaciones() {
    this.reportesService
      .consultaAdecuaciones(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const respuesta = value.respuesta;
            this.resumes[0].value = respuesta.totalAdecuados ?? 0;

            let tmpColors = [
              COLORS.blue,
              COLORS.orange,
              COLORS.purple,
              COLORS.red,
            ];

            this.charts[0].chart.data = respuesta.adecuacionTipos.map(
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
                  if (tmpColors.length === 0) tmpColors = getListColors();
                  const numberRandom = getRandomNumber(tmpColors.length);
                  const colorRandom = tmpColors[numberRandom];
                  tmpColors.splice(numberRandom, 1);
                  name = value0.categoria;
                  color = colorRandom;
                }
                return {
                  name,
                  value: getPorcentaje(
                    respuesta.adecuacionTipos,
                    'porcentaje',
                    value0.porcentaje ?? 0
                  ),
                  color,
                };
              }
            );
            this.charts[0].show = true;

            tmpColors = getListColors();
            this.charts[1].chart.data = respuesta.adecuacionUnidades.map(
              (value0) => {
                const finded = this.charts[1].chart.data.filter(
                  (item) => item.name === value0.categoria
                );
                let name = '';
                let color = '';
                if (finded.length) {
                  name = finded[0].name;
                  color = finded[0].color;
                } else {
                  if (tmpColors.length === 0) tmpColors = getListColors();
                  const numberRandom = getRandomNumber(tmpColors.length);
                  const colorRandom = tmpColors[numberRandom];
                  tmpColors.splice(numberRandom, 1);
                  name = value0.categoria;
                  color = colorRandom;
                }
                return {
                  name,
                  value: getPorcentaje(
                    respuesta.adecuacionUnidades,
                    'porcentaje',
                    value0.porcentaje ?? 0
                  ),
                  color,
                };
              }
            );
            this.charts[1].show = true;

            tmpColors = getListColors();
            this.charts[2].chart.data = respuesta.adecuacionProyectos.map(
              (value0) => {
                const finded = this.charts[2].chart.data.filter(
                  (item) => item.name === value0.categoria
                );
                let name = '';
                let color = '';
                if (finded.length) {
                  name = finded[0].name;
                  color = finded[0].color;
                } else {
                  if (tmpColors.length === 0) tmpColors = getListColors();
                  const numberRandom = getRandomNumber(tmpColors.length);
                  const colorRandom = tmpColors[numberRandom];
                  tmpColors.splice(numberRandom, 1);
                  name = value0.categoria;
                  color = colorRandom;
                }
                return {
                  name,
                  value: getPorcentaje(
                    respuesta.adecuacionProyectos,
                    'porcentaje',
                    value0.porcentaje ?? 0
                  ),
                  color,
                };
              }
            );
            this.charts[2].show = true;
          }
        },
        error: (err) => { },
      });
  }
}
