import { Component, OnDestroy, OnInit } from '@angular/core';
import { getOptions } from '@common/utils/Utils';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit, OnDestroy {
  body = document.querySelector('body');
  options = [
    {
      title: 'Registro',
      icon: 'assignment',
      imgIcon: 'Formulacion',
      route: 'Registro',
      roles: ['ADMINISTRADOR', 'ENLACE'],
      enable: false,
      finish: false,
      description: `Permite el registro de Programas Presupuestarios.`
    },
    {
      title: 'Actualización',
      icon: 'edit_note',
      imgIcon: 'Ajustes',
      route: 'Actualización',
      roles: ['ADMINISTRADOR', 'ENLACE'],
      enable: false,
      finish: false,
      description: `Permite la actualización de Programas Presupuestarios.`
    },
    {
      title: 'Validación',
      icon: 'fact_check',
      route: 'Validación',
      imgIcon: 'Validacion',
      roles: ['ADMINISTRADOR', 'SUPERVISOR'],
      enable: false,
      finish: false,
      description: `Permite validar la información registrada.`
    },
    {
      title: 'Consulta',
      icon: 'manage_search',
      imgIcon: 'Consulta',
      route: 'Consulta',
      enable: false,
      finish: false,
      description: `Permite la consulta de Programas Presupuestarios.`
    },
  ]

  constructor() {
    this.options = getOptions(this.options);
  }

  ngOnDestroy(): void {
    this.body?.classList.remove('hideW');
  }

  ngOnInit(): void {
    this.body?.classList.add('hideW');
  }
}
