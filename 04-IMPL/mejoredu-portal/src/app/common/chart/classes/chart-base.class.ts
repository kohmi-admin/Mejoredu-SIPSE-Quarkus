import Chart from 'chart.js/auto';
import { CHART_TYPE } from '../enums/chart.enum';
import { ChartDataI } from '../interfaces/chart.interface';
import { options } from '../utils/ontions';
import { ChartParamsI } from '../interfaces/chart-params.interface';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartLabelI } from '../interfaces/chart-label.interface';

export class ChartBase {
  type: CHART_TYPE | any;
  data: ChartDataI[];
  isDataset?: boolean;
  datasets: any[];
  labels: any[];
  data2: ChartDataI[];
  data3: ChartDataI[];
  title: string;
  title2: string;
  title3: string;
  id: string;
  chart: Chart;
  isPercent: boolean;
  isCurrency: boolean;
  calculatePercent: boolean;
  suffix: string = '';
  options = options;

  constructor(params: ChartParamsI) {
    Chart.register(ChartDataLabels);
    this.type = params.type || CHART_TYPE.Bar;
    this.data = params.data || [];
    this.isDataset = params.isDataset || false;
    this.datasets = params.datasets || [];
    this.labels = params.labels || [];
    this.data2 = params.data2 || [];
    this.data3 = params.data3 || [];
    this.title = params.title || '';
    this.title2 = params.title2 || '';
    this.title3 = params.title3 || '';
    this.isPercent = params.isPercent || false;
    this.isCurrency = params.isCurrency || false;
    this.calculatePercent = params.calculatePercent || false;
    this.suffix = params.suffix ? ' ' + params.suffix : '';
    this.id = params.id || new Date().getTime().toString();
    this.chart = this.generateChart();
  }

  formatearComoDinero(numero: number): string {
    const redondeado = numero.toFixed(2);
    const resultado = `$ ${redondeado.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return resultado;
  }

  parseValue(value: any, params?: ChartLabelI): any {
    let finalValue = value;
    if (this.isPercent) {
      finalValue = value + ' %';
    }
    if (this.isCurrency) {
      finalValue = this.formatearComoDinero(value) + this.suffix;
    }
    if (params && this.calculatePercent) {
      const dataset = params.dataset;
      const dataIndex = params.dataIndex;
      const value = dataset.data[dataIndex];
      // get percent of value of all data
      const percent = (
        (value / dataset.data.reduce((a, b) => a + b, 0)) *
        100
      ).toFixed(2);
      return `${finalValue} (${percent}%)`;
    }
    // add percent of quantity number
    return finalValue;
  }

  getLineChart(): Chart {
    let datasets: any = [];
    let labels: any = [];
    if (!this.isDataset) {
      datasets = [
        {
          label: 'gráfico',
          tension: 0.4,
          fill: false,
          borderColor: 'rgba( 1, 1, 1, 0.2)',
          data: this.data.map((item) => item.value),
          backgroundColor: this.data.map((item) => item.color),
          borderWidth: 2,
        },
      ];
      labels = this.data.map((item) => item.name);
    } else {
      datasets = this.datasets;
      labels = this.labels;
    }
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false,
          },
          datalabels: {
            color: 'white',
            anchor: 'end',
            align: 'end',
            offset: 2,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: 'rgba( 1, 1, 1, 0.5)',
            backgroundColor: 'rgba( 1, 1, 1, 0.5)',
            font: {
              weight: 'bold',
              size: '14px',
              family: 'Montserrat',
            },
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getPieChart(): Chart {
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels: this.data.map((item) => item.name),
        datasets: [
          {
            label: 'gráfico',
            data: this.data.map((item) => item.value),
            backgroundColor: this.data.map((item) => item.color),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false,
          },
          datalabels: {
            color: 'rgba( 255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'center',
            font: {
              weight: 'bold',
              size: this.calculatePercent ? '16px' : '20px',
              family: 'Montserrat',
            },
            backgroundColor: this.calculatePercent
              ? 'rgba( 1, 1, 1, 0.3)'
              : undefined,
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getDoughnutChart(): Chart {
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels: this.data.map((item) => item.name),
        datasets: [
          {
            label: 'gráfico',
            data: this.data.map((item) => item.value),
            backgroundColor: this.data.map((item) => item.color),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false,
          },
          datalabels: {
            color: 'rgba( 255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'center',
            font: {
              weight: 'bold',
              size: '22px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getPolarAreaChart(): Chart {
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels: this.data.map((item) => item.name),
        datasets: [
          {
            label: 'gráfico',
            data: this.data.map((item) => item.value),
            backgroundColor: this.data.map((item) => item.color),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false,
          },
          datalabels: {
            color: 'rgba( 255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'center',
            font: {
              weight: 'bold',
              size: '22px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getBarChart(): Chart {
    const datasets = this.data.map((item) => {
      return {
        label: item.name,
        data: [item.value],
        backgroundColor: item.color,
      };
    });
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels: ['Información'],
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
          xAxes: [
            {
              ticks: {
                maxRotation: 50,
                minRotation: 30,
                padding: 10,
                autoSkip: false,
                fontSize: 10,
              },
            },
          ],
        },
        plugins: {
          tooltip: {
            enabled: false,
          },
          datalabels: {
            color: 'rgba( 255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'center',
            font: {
              weight: 'bold',
              size: '14px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getBarChart2(): Chart {
    let datasets: any = [];
    let labels: any = [];
    if (!this.isDataset) {
      datasets = [
        {
          label: this.title,
          data: this.data.map((item) => item.value),
          backgroundColor: this.data.map((item) => item.color),
        },
      ];
      labels = this.data.map((item) => item.name);
    } else {
      datasets = this.datasets;
      labels = this.labels;
    }
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: 'rgba( 255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'center',
            font: {
              weight: 'bold',
              size: '12px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getBarChartHorizontal(): Chart {
    let datasets: any = [];
    let labels: any = [];
    if (!this.isDataset) {
      datasets = [
        {
          label: this.title,
          data: this.data.map((item) => item.value),
          backgroundColor: this.data.map((item) => item.color),
        },
      ];
      labels = this.data.map((item) => item.name);
    } else {
      datasets = this.datasets;
      labels = this.labels;
    }
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        layout: { padding: { left: 0, right: 73, top: 0, bottom: 0 } },
        plugins: {
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: 'rgba( 33, 37, 43, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'end',
            anchor: 'end',
            display: 'auto',
            clamp: true,
            font: {
              weight: 'bold',
              size: '12px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getMixedChart(): Chart {
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels: this.data.map((item) => item.name),
        datasets: [
          {
            type: 'line',
            label: this.title2,
            data: this.data2.map((item) => item.value),
            borderColor: this.data2.map((item) => item.color),
            backgroundColor: this.data2.map((item) => item.color),
            datalabels: {
              color: 'white',
              anchor: 'end',
              align: 'end',
              offset: 2,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: 'rgba( 1, 1, 1, 0.5)',
              backgroundColor: 'rgba( 1, 1, 1, 0.5)',
              font: {
                weight: 'bold',
                size: '14px',
                family: 'Montserrat',
              },
              formatter: (value: any, params: any) =>
                this.parseValue(value, params),
            },
          },
          {
            type: 'bar',
            label: this.title,
            data: this.data.map((item) => item.value),
            backgroundColor: this.data.map((item) => item.color),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: 'rgba( 255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'center',
            font: {
              weight: 'bold',
              size: '12px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getMixedBarsHorizontalChart(): Chart {
    const datasets = [
      {
        type: 'bar',
        label: this.title,
        data: this.data.map((item) => item.value),
        backgroundColor: this.data.map((item) => item.color),
      },
      {
        type: 'bar',
        label: this.title2,
        data: this.data2.map((item) => item.value),
        borderColor: this.data2.map((item) => item.color),
        backgroundColor: this.data2.map((item) => item.color),
      },
    ];
    if (this.data3.length) {
      datasets.push({
        type: 'bar',
        label: this.title3,
        data: this.data3.map((item) => item.value),
        borderColor: this.data3.map((item) => item.color),
        backgroundColor: this.data3.map((item) => item.color),
      });
    }
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels: this.data.map((item) => item.name),
        datasets,
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        layout: { padding: { left: 0, right: 73, top: 0, bottom: 0 } },
        plugins: {
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: 'rgba( 33, 37, 43, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'end',
            anchor: 'end',
            display: 'auto',
            clamp: true,
            font: {
              weight: 'bold',
              size: '12px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  getMixedBarsChart(): Chart {
    const datasets = [
      {
        type: 'bar',
        label: this.title,
        data: this.data.map((item) => item.value),
        backgroundColor: this.data.map((item) => item.color),
      },
      {
        type: 'bar',
        label: this.title2,
        data: this.data2.map((item) => item.value),
        borderColor: this.data2.map((item) => item.color),
        backgroundColor: this.data2.map((item) => item.color),
      },
    ];
    if (this.data3.length) {
      datasets.push({
        type: 'bar',
        label: this.title3,
        data: this.data3.map((item) => item.value),
        borderColor: this.data3.map((item) => item.color),
        backgroundColor: this.data3.map((item) => item.color),
      });
    }
    return new Chart(this.id, {
      type: this.type,
      data: {
        labels: this.data.map((item) => item.name),
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: 'rgba( 255, 255, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            align: 'center',
            font: {
              weight: 'bold',
              size: '12px',
              family: 'Montserrat',
            },
            textShadowBlur: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.04)',
            formatter: (value: any, params: any) =>
              this.parseValue(value, params),
          },
        },
      },
    });
  }

  generateChart(): Chart {
    switch (this.type) {
      case CHART_TYPE.Bar:
        return this.getBarChart2();
      case CHART_TYPE.HorizontalBar:
        this.type = CHART_TYPE.Bar;
        return this.getBarChartHorizontal();
      case CHART_TYPE.Pie:
        return this.getPieChart();
      case CHART_TYPE.Line:
        return this.getLineChart();
      case CHART_TYPE.Doughnut:
        return this.getDoughnutChart();
      case CHART_TYPE.PolarArea:
        return this.getPolarAreaChart();
      case CHART_TYPE.Mixed:
        return this.getMixedChart();
      case CHART_TYPE.MixedBars:
        return this.getMixedBarsChart();
      case CHART_TYPE.MixedBarsHorizontal:
        return this.getMixedBarsHorizontalChart();
      default:
        return this.getPieChart();
    }
  }
}
