import { Component } from '@angular/core';
import { getOptions } from '@common/utils/Utils';

@Component({
  selector: 'app-adecuaciones',
  templateUrl: './adecuaciones.component.html',
  styleUrls: ['./adecuaciones.component.scss']
})
export class AdecuacionesComponent {
  options: any[] = [
    {
      title: 'Solicitudes',
      icon: 'today',
      imgIcon: 'Formulacion',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'ENLACE'],
      route: 'Solicitudes',
      description: `Inicia el proceso de ajustes en Programación y Presupuestación mediante la presentación formal de cambios.`
    },
    {
      title: 'Revisión de Solicitudes',
      icon: 'event_upcoming',
      imgIcon: 'Validacion',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'],
      route: 'Revisión de Solicitudes',
      description: `Facilita el análisis de las solicitudes de ajustes presentadas.`
    },
  ];

  constructor() {
    this.options = getOptions(this.options);
  }
}
