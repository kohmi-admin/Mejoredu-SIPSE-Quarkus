import { Component, OnDestroy, OnInit } from '@angular/core';
import { getOptions } from '@common/utils/Utils';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit, OnDestroy {
  body = document.querySelector('body');
  options = [
    {
      title: 'Planeación a Corto Plazo',
      icon: 'today',
      imgIcon: 'CortoPlazo',
      enable: false,
      finish: false,
      route: 'Planeación a Corto Plazo',
      description: `Submódulo de registro, validación y consulta del Programa Anual de Actividades.`
    },
    {
      title: 'Planeación de Mediano Plazo',
      icon: 'event_upcoming',
      imgIcon: 'MedianoPlazo',
      enable: false,
      finish: false,
      route: 'Planeación de Mediano Plazo',
      description: `Submódulo de registro, validación y consulta del Programa Institucional.`
    },
    {
      title: 'Programas Presupuestarios',
      icon: 'monetization_on',
      imgIcon: 'ProgramasPresupuestarios',
      enable: false,
      finish: false,
      route: 'Programas Presupuestarios',
      description: `Submódulo de registro, validación y consulta de los Programas Presupuestarios de la Comisión.`
    }
  ]

  constructor() {
    this.options = getOptions(this.options);
  }

  ngOnInit(): void {
    this.body?.classList.add('hideW');
  }

  ngOnDestroy(): void {
    this.body?.classList.remove('hideW');
  }
}
