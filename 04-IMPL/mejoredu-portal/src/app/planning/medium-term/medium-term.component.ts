import { Component, OnDestroy, OnInit } from '@angular/core';
import { getOptions } from '@common/utils/Utils';

@Component({
  selector: 'app-medium-term',
  templateUrl: './medium-term.component.html',
  styleUrls: ['./medium-term.component.scss']
})
export class MediumTermComponent implements OnInit, OnDestroy {
  body = document.querySelector('body');
  options = [
    {
      title: 'Registro',
      icon: 'assignment',
      imgIcon: 'Formulacion',
      route: 'Registro/Programa Institucional',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'ENLACE'],
      description: `Registro de los elementos que integran el Programa Institucional.`
    },
    {
      title: 'Ajustes',
      icon: 'edit_note',
      imgIcon: 'Ajustes',
      route: 'Ajustes',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'ENLACE'],
      description: `Ajuste de uno o más elementos del Programa Institucional vigente.`
    },
    {
      title: 'Validación',
      icon: 'fact_check',
      route: 'Validación',
      imgIcon: 'Validacion',
      enable: false,
      finish: false,
      roles: ['ADMINISTRADOR', 'SUPERVISOR'],
      description: `Confirmar el adecuado registro y/o actualización de los elementos que integran el Programa Institucional.`
    },
    {
      title: 'Consulta',
      icon: 'manage_search',
      imgIcon: 'Consulta',
      route: 'Consulta/Programa Institucional',
      enable: false,
      finish: false,
      description: `Revisión y descarga del Programa Institucional.`
    },
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
