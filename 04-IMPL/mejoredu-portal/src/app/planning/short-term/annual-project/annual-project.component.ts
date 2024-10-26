import { Component } from '@angular/core';

@Component({
  selector: 'app-annual-project',
  templateUrl: './annual-project.component.html',
  styleUrls: ['./annual-project.component.scss']
})
export class AnnualProjectComponent {
  options = [
    {
      title: 'Formularios',
      icon: 'assignment',
      route: 'Formularios',
      enable: true,
      description: ``
    },
    {
      title: 'Enviar a Revision',
      icon: 'fact_check',
      route: 'more',
      enable: true,
      description: ``
    },
    {
      title: 'Descarga de Reporte',
      icon: 'cloud_download',
      route: 'more',
      enable: true,
      description: ``
    },
  ]
}
