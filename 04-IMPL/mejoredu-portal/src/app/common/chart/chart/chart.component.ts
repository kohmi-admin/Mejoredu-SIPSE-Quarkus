import { AfterViewInit, Component, Input } from '@angular/core';
import { ChartBase } from '../classes/chart-base.class';
import { ChartParamsI } from '../interfaces/chart-params.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  @Input() chart!: ChartParamsI;
  chartBase!: ChartBase;

  ngAfterViewInit(): void {
    this.chartBase = new ChartBase(this.chart);
    this.chartBase.chart.update();
    // setTimeout(() => {
    //   this.chartBase.chart.data.datasets[0].data = [10, 20, 30];
    //   this.chartBase.chart.update();
    // }, 3000);
  }
}
