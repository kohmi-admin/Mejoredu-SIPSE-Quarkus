import { Component } from '@angular/core';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss'],
})
export class FollowComponent {
  options: any[] = [
    {
      title: 'Seguimiento del Programa Anual de Actividades',
      icon: 'today',
      imgIcon: 'SPAA',
      enable: true,
      finish: false,
      route: 'Seguimiento del Programa Anual de Actividades',
      description: `Submódulo de registro de modificaciones Programáticos y Programáticos Presupuestales, así como avances en las Metas del PAA.`
    },
    {
      title: 'Seguimiento MIR/FID',
      icon: 'event_upcoming',
      imgIcon: 'SeguimientoMIR',
      enable: true,
      finish: false,
      route: 'Seguimiento MIR|FID',
      description: `Submódulo de monitoreo del avance en las Metas Anuales a través de los Indicadores MIR y FID de los Programas Presupuestarios.`
    },
    {
      title: 'Seguimiento al Mediano Plazo',
      icon: 'monetization_on',
      imgIcon: 'SeguimientoMP',
      enable: true,
      finish: false,
      route: 'Seguimiento al Mediano Plazo',
      description: `Submódulo de monitoreo del logro de los Objetivos Prioritarios del PI, así como de los Parámetros y Metas para el Bienestar.`
    }
  ];
}
