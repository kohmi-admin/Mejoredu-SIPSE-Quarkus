import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { ResumeI } from '@common/resume/interfaces/resume.interface';
import { ChartCardI } from '../../chart-board/interfaces/chart-card.interface';
import { CHART_TYPE } from '@common/chart/enums/chart.enum';
import { COLORS } from '@common/chart/enums/colors.enum';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ReportesService } from '@common/services/reportes/reportes.service';
import { getPorcentaje, getRandomNumber } from '@common/utils/Utils';
import { ReportActions } from '../class/report-actions.class';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: [
    '../mir-pi/mir-pi.component.scss',
    './presupuesto.component.scss',
  ],
})
export class PresupuestoComponent extends ReportActions {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  resumes: ResumeI[] = [
    {
      name: 'Presupuesto Asignado',
      color: 'rgb(0, 172, 0)',
      value: '223,541.8 mdp',
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
  override reportName: string = 'Presupuesto';

  constructor(private reportesService: ReportesService) {
    super();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    if (
      this.dataUser.idTipoUsuario === 'ADMINISTRADOR' ||
      this.dataUser.idTipoUsuario === 'CONSULTOR' ||
      this.dataUser.idTipoUsuario === 'SUPERVISOR'
    ) {
      this.charts.push({
        title: 'Porcentaje de Presupuesto Asignado por Unidad',
        class: 'full',
        show: false,
        chart: {
          id: '1-pre',
          height: 600,
          isPercent: true,
          title: 'Porcentaje de Presupuesto Asignado por Unidad',
          type: CHART_TYPE.Pie,
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
    }

    this.charts.push({
      title: 'Presupuesto Asignado por Proyecto',
      class: 'full',
      show: false,
      chart: {
        id: '2-pre',
        isCurrency: true,
        title: 'Presupuesto Asignado por Proyecto',
        type: CHART_TYPE.HorizontalBar,
        data: [
          {
            name: '2311. Conducir las acciones para el cumplimiento de los objetivos de MEJOREDU',
            value: 7745684.0,
            color: COLORS.green,
          },
          {
            name: '2321 Estudios, investigaciones especializadas y evaluaciones diagnósticas, formativas e integrales.',
            value: 19324668.0,
            color: COLORS.green,
          },
          {
            name: '2331 Desarrollo de sugerencias, lineamientos y materiales para apoyar la mejora de las escuelas',
            value: 4550700.0,
            color: COLORS.green,
          },
          {
            name: '2332 Información y productos de seguimiento a los resultados de la mejora educativa',
            value: 1530500.0,
            color: COLORS.green,
          },
          {
            name: '2333 Difusión de productos institucionales que contribuyan a la mejora educativa',
            value: 12350490.0,
            color: COLORS.green,
          },
          {
            name: '2341. Fortalecimiento de criterios, lineamientos y programas de formación continua',
            value: 16909409.0,
            color: COLORS.green,
          },

          {
            name: '2342. Colaboración con autoridades educativas, instituciones y actores clave.',
            value: 0,
            color: COLORS.green,
          },
          {
            name: '2312. Defensa jurídica y representación legal de la Comisión',
            value: 4205581.0,
            color: COLORS.green,
          },
          {
            name: '2313. Gestión institucional para impulsar la mejora continua de la educación',
            value: 13446583.0,
            color: COLORS.green,
          },
          {
            name: '2314. Provisión de servicios en materia de recursos humanos, materiales y financieros',
            value: 114835672.0,
            color: COLORS.green,
          },
          {
            name: '2315. Servicios de tecnologías de información y comunicación',
            value: 27720113.0,
            color: COLORS.green,
          },
        ],
      },
    });

    // chats 2

    this.charts2.push({
      title:
        '2311. Conducir las acciones para el cumplimiento de los objetivos de MEJOREDU',
      class: 'mid',
      chart: {
        id: '3-pre',
        isCurrency: true,
        title: '73.66%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 7745684.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 7867684.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 5745684.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2321 Estudios, investigaciones especializadas y evaluaciones diagnósticas, formativas e integrales.',
      class: 'mid',
      chart: {
        id: '4-pre',
        isCurrency: true,
        title: '63.78%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 7745684.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 19324668.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 4550700.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2331 Desarrollo de sugerencias, lineamientos y materiales para apoyar la mejora de las escuelas.',
      class: 'mid',
      chart: {
        id: '5-pre',
        isCurrency: true,
        title: '56.17%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 7745684.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 19324668.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 4550700.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2332 Información y productos de seguimiento a los resultados de la mejora educativa',
      class: 'mid',
      chart: {
        id: '6-pre',
        isCurrency: true,
        title: '67.11%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 7745684.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 19324668.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 4550700.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2333 Difusión de productos institucionales que contribuyan a la mejora educativa',
      class: 'mid',
      chart: {
        id: '7-pre',
        isCurrency: true,
        title: '67.61%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 7745684.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 19324668.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 4550700.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2341. Fortalecimiento de criterios, lineamientos y programas de formación continua',
      class: 'mid',
      chart: {
        id: '8-pre',
        isCurrency: true,
        title: '64.51%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 7745684.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 19324668.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 4550700.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2342. Colaboración con autoridades educativas, instituciones y actores clave.',
      class: 'mid',
      chart: {
        id: '9-pre',
        isCurrency: true,
        title: '0%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title: '2312. Defensa jurídica y representación legal de la Comisión',
      class: 'mid',
      chart: {
        id: '10-pre',
        isCurrency: true,
        title: '48.11%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 7745684.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 19324668.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 4550700.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2313. Gestión institucional para impulsar la mejora continua de la educación',
      class: 'mid',
      chart: {
        id: '11-pre',
        isCurrency: true,
        title: '77.68%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 13442583.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 13443583.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 10446583.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title:
        '2314. Provisión de servicios en materia de recursos humanos, materiales y financieros',
      class: 'mid',
      chart: {
        id: '12-pre',
        isCurrency: true,
        title: '87.80%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 114835672.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 114835672.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 100835672.0,
            color: COLORS.green,
          },
        ],
      },
    });

    this.charts2.push({
      title: '2315. Servicios de tecnologías de información y comunicación',
      class: 'mid',
      chart: {
        id: '13-pre',
        isCurrency: true,
        title: '74.74%',
        type: CHART_TYPE.Bar,
        data: [
          {
            name: 'Aprobado',
            value: 27720113.0,
            color: COLORS.blue,
          },
          {
            name: 'Modificado',
            value: 27720113.0,
            color: COLORS.red,
          },
          {
            name: 'Ejerccido',
            value: 20720113.0,
            color: COLORS.green,
          },
        ],
      },
    });
    this.getPresupuesto();
  }

  getPresupuesto() {
    this.reportesService
      .consultaPresupuesto(this.yearNav, this.dataUser.cveUsuario)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const respuesta = value.respuesta;

            const showFirstTable: boolean =
              this.dataUser.idTipoUsuario === 'ADMINISTRADOR' ||
              this.dataUser.idTipoUsuario === 'CONSULTOR' ||
              this.dataUser.idTipoUsuario === 'SUPERVISOR';

            if (showFirstTable) {
              this.resumes[0].value = `${respuesta.presupuestoAsignado ?? 0
                } mdp`;

              let tmpColors = [...this.listColors];
              this.charts[0].chart.data = respuesta.presupuestoUnidad?.map(
                (item) => {
                  const numberRandom = getRandomNumber(tmpColors.length);
                  const colorRandom = tmpColors[numberRandom];
                  tmpColors.splice(numberRandom, 1);
                  return {
                    name: item.ccExternaDos,
                    value: getPorcentaje(
                      respuesta.presupuestoAsignado,
                      'totalAnualAsignado',
                      item.totalAnualAsignado
                    ),
                    color: colorRandom,
                  };
                }
              );
              this.charts[0].show = true;
            }

            this.charts[showFirstTable ? 1 : 0].chart.height = 500;
            this.charts[showFirstTable ? 1 : 0].chart.data =
              respuesta.presupuestoProyectos?.map((value0) => {
                return {
                  name: value0.cxNombreProyecto,
                  value: value0.totalAnualASignado,
                  color: COLORS.green,
                };
              });
            this.charts[showFirstTable ? 1 : 0].show = true;
          }
        },
      });
  }
}
