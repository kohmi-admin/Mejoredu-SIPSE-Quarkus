import { Component } from '@angular/core';

@Component({
  selector: 'app-paa-project',
  templateUrl: './paa-project.component.html',
  styleUrls: ['./paa-project.component.scss']
})
export class PaaProjectComponent {
  options = [
    {
      title: 'PAA Formulado',
      icon: 'assignment',
      route: 'PAA Formulado',
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
