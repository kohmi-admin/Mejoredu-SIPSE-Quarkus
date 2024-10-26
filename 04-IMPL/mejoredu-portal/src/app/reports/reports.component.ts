import { Component, OnInit } from '@angular/core';
import { ChartBase } from '@common/chart/classes/chart-base.class';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  options = [
    {
      title: 'Numeralia',
      icon: 'today',
      imgIcon: 'Numeralia',
      enable: true,
      finish: false,
      route: 'Numeralia',
      description: `Representación gráfica de datos cuantitativos sobre el logro de Metas y el Gasto Anual de la Comisión y sus áreas.`
    },
    {
      title: 'Reportes',
      icon: 'event_upcoming',
      imgIcon: 'Reportes',
      enable: true,
      finish: false,
      route: 'Reportes',
      description: `Consulta y descarga de reportes preestablecidos sobre el desempeño de la Comisión.`
    },
    {
      title: 'Extractor de Datos',
      icon: 'monetization_on',
      imgIcon: 'ExtractorDeDatos',
      enable: true,
      finish: false,
      route: 'Extractor de Datos',
      description: `Extracción de datos a selección sobre el logro de metas a Corto y Mediano Plazo, así como el Presupuesto ejercido para su logro.`
    }
  ]

  ngOnInit() {
  }
}
