import { Component, OnDestroy } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';

interface IOptions {
  title: string;
  icon: string;
  enable: boolean;
  finish: boolean;
  imgIcon: string;
  route: string;
  facultad: string;
  description: string;
}

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  options: IOptions[] = [
    {
      title: 'Planeación',
      icon: 'assignment',
      enable: false,
      finish: false,
      imgIcon: 'book',
      route: 'Planeación',
      facultad: 'ROL_MOD_PLANEACION',
      description: `Módulo de registro de Objetivos y Metas Institucionales de Mediano y Corto Plazo: Programa Institucional, Programas Presupuestarios y Programa Anual de Actividades.`,
      // description: `Módulo que integra espacios para el registro de los objetivos y metas de mediano y corto plazo,
      // incluyendo los elementos del Programa Institucional de la MEJOREDU, de los programas presupuestarios
      // y de los proyectos del PAA.`,
    },
    {
      title: `Seguimiento`,
      icon: `fact_check`,
      enable: false,
      finish: false,
      imgIcon: 'check',
      route: `Seguimiento`,
      facultad: 'ROL_MOD_SEGUIMIENTO',
      description: `Módulo de registro de las modificaciones a la Planeación, así como del logro de Metas de Mediano y Corto Plazo.`,
      // description: ` Módulo que incorpora el registro puntual de las actividades realizadas y los
      // productos entregados para dar cuenta de los avances en la operación de los
      // proyectos del PAA registrados en el módulo de Planeación, de la
      // participación que la MEJOREDU tiene en el sistema educativo, de la gestión
      // con autoridades educativas, así como del avance en las metas de desempeño y
      // las metas de mediano plazo. Este módulo considera los apartados para el
      // registro de adecuaciones programáticas y/o presupuestales que permitan tener
      // actualizado el PAA.`,
    },
    {
      title: `Evaluación y Mejora Continua`,
      icon: `assessment`,
      enable: false,
      finish: false,
      imgIcon: 'check-list',
      route: `Evaluación y Mejora Continua`,
      facultad: 'ROL_MOD_EVALUACION',
      description: `En este Módulo se integrará información de los mecanismos que el Grupo Directivo haya definido para la evaluación de los Objetivos Institucionales.`,
      // description: `Módulo que abarca tanto el proceso interno (autoevaluación) como el externo (instancias fiscalizadoras),
      // donde se sistematizarán las recomendaciones emitidas, además, se alojarán los resultados de las encuestas
      // y consultas de mejora a cargo de la Dirección General de Planeación y Presupuesto.`,
    },
    {
      title: `Reportes y Numeralia`,
      icon: `library_books`,
      enable: false,
      finish: false,
      imgIcon: 'data-analytics',
      route: `Reportes y Numeralia`,
      facultad: 'ROL_MOD_REPORTES',
      description: `Módulo para la consulta de datos generales sobre las Actividades y Productos de MEJOREDU.`,
      // description: `Módulo en el cual se habilitará la función de consulta de datos y generación de reportes.`,
    },
  ];
  body = document.querySelector(`body`);

  constructor() {
    this.body?.classList.add(`hideW`);
    this.dataUser = this.ls.get('dUaStEaR');
    const idsRole: string[] = [];
    for (const item of this.dataUser.roles) {
      idsRole.push(item.cveFacultad);
    }
    for (const item of this.options) {
      if (idsRole.includes(item.facultad)) {
        item.enable = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.body?.classList.remove('hideW');
  }
}
