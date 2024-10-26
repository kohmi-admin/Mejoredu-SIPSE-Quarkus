import { Component } from '@angular/core';

@Component({
  selector: 'app-analytical-document',
  templateUrl: './analytical-document.component.html',
  styleUrls: ['./analytical-document.component.scss']
})
export class AnalyticalDocumentComponent {
  options = [
    {
      title: 'Carga de Archivo',
      icon: 'upload',
      route: 'Cargar Archivo',
      enable: true,
      description: ``
    },
    {
      title: 'Espacio de Trabajo',
      icon: 'library_books',
      route: 'Espacio de Trabajo',
      enable: true,
      description: ``
    },
    {
      title: 'Formulario',
      icon: 'assignment',
      route: 'Formulario',
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
