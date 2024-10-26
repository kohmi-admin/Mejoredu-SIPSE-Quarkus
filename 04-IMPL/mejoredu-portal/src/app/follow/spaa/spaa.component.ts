import { Component, OnDestroy, OnInit } from '@angular/core';
import { getOptions } from '@common/utils/Utils';

@Component({
  selector: 'app-spaa',
  templateUrl: './spaa.component.html',
  styleUrls: ['./spaa.component.scss']
})
export class SpaaComponent implements OnInit, OnDestroy {

  body = document.querySelector('body');
  options: any[] = [
    {
      title: 'Adecuaciones',
      icon: 'today',
      imgIcon: 'Adecuaciones',
      enable: false,
      finish: false,
      route: 'Adecuaciones',
      roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'], //COMMENT: Cambio CSR solicitud Dalia
      description: `Gestiona el registro de ajustes en la Planificación, Presupuestal y su combinación. Implica la solicitud, revisión y formalización de cambios en elementos previamente especificados.`
    },
    {
      title: 'Avances Programáticos',
      icon: 'event_upcoming',
      imgIcon: 'AvancesProgramaticos',
      enable: false,
      finish: false,
      route: 'Avances Programáticos',
      roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'], //COMMENT: Cambio CSR solicitud Dalia
      description: `Registra el progreso de Actividades mensuales y trimestrales, facilitando la revisión de informes entre roles para generar resúmenes trimestrales de gestión.`
    },
    {
      title: 'Estatus Programático-Presupuestal',
      icon: 'monetization_on',
      imgIcon: 'EstatusProgramatico',
      enable: false,
      finish: false,
      route: 'Estatus Programático-Presupuestal',
      description: `Emplea un reporteador para monitorear el Avance de Proyectos PAA, evaluando el estado de las Actividades y Productos. Proporciona resúmenes que resaltan logros y elementos pendientes, identificando posibles riesgos en el cumplimiento de Objetivos.`
    }
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
