import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit, OnDestroy {
  body = document.querySelector('body') as HTMLBodyElement;
  options = [
    {
      title: 'PAA Aprobados',
      icon: 'description',
      imgIcon: 'Aprobado',
      finish: false,
      route: 'PAA Aprobados',
      enable: true,
      canDownload: false,
      description: `"Descripción de módulo en proceso"`
    },
    {
      title: 'Proyecto PAA',
      icon: 'pending_actions',
      imgIcon: 'CheckTime',
      finish: false,
      route: 'Proyecto PAA',
      enable: true,
      canDownload: false,
      description: `"Descripción de módulo en proceso"`
    },
  ]

  ngOnInit(): void {
    this.body.classList.add('hideW');
  }

  ngOnDestroy(): void {
    this.body.classList.remove('hideW');
  }
}
