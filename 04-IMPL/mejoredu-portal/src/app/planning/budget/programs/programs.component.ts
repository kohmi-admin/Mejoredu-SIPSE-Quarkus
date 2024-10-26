import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit, OnDestroy {
  body = document.querySelector('body');
  options = [
    {
      title: 'P016',
      icon: 'price_change',
      imgIcon: 'P016',
      route: 'P016',
      color: '#FFC150',
      enable: true,
      finish: false,
      description: `Planeación, diseño, ejecución y evaluación del Sistema Nacional de Mejora Continua de la Educación.`
    },
    {
      title: 'M001',
      icon: 'price_change',
      imgIcon: 'M001',
      route: 'M001',
      color: '#FFC150',
      enable: true,
      finish: false,
      description: `Actividades de apoyo administrativo.`
    },
    {
      title: 'O001',
      icon: 'price_change',
      imgIcon: 'O001',
      route: 'O001',
      color: '#FFC150',
      enable: true,
      finish: false,
      description: `Actividades de apoyo a la función pública y buen gobierno.`
    },
  ]

  ngOnDestroy(): void {
    this.body?.classList.remove('hideW');
  }

  ngOnInit(): void {
    this.body?.classList.add('hideW');
  }
}
