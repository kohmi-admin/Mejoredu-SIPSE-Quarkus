import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faLineChart,
  faListAlt,
  faMoneyBillAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getOptions } from '@common/utils/Utils';

@Component({
  selector: 'app-short-term',
  templateUrl: './short-term.component.html',
  styleUrls: ['./short-term.component.scss'],
})
export class ShortTermComponent implements OnInit, OnDestroy {
  body = document.querySelector('body');
  options = [
    {
      title: 'Formulación',
      icon: 'assignment',
      route: 'Formulación',
      imgIcon: 'Formulacion',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'ENLACE'],
      description: `Permite realizar la carga, registro, consulta y revisión de información.`,
    },
    {
      title: 'Ajustes',
      icon: 'edit_note',
      route: 'Ajustes',
      imgIcon: 'Ajustes',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'ENLACE'],
      description: `Permite ajustar la información previamente registrada en formulación.`,
    },
    {
      title: 'Revisión y Validación',
      icon: 'fact_check',
      route: 'Revisión y Validación',
      imgIcon: 'Validacion',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'PRESUPUESTO', 'PLANEACION', 'SUPERVISOR'],
      description: `Permite validar la información registrada en el módulo de formulación.`,
    },
    {
      title: 'Consulta',
      icon: 'manage_search',
      imgIcon: 'Consulta',
      route: 'Consulta',
      enable: false,
      finish: false,
      description: `Permitir consultar y descargar la información de los proyectos.`,
    },
  ];

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
