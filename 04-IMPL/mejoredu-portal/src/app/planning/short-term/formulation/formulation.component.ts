import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateViewService } from '../services/state-view.service';
import { getOptions } from '@common/utils/Utils';

@Component({
  selector: 'app-formulation',
  templateUrl: './formulation.component.html',
  styleUrls: ['./formulation.component.scss']
})
export class FormulationComponent implements OnInit, OnDestroy {
  body = document.querySelector('body') as HTMLBodyElement;
  options = [
    {
      title: 'Carga de Proyectos',
      icon: 'upload',
      imgIcon: 'SubirArchivo',
      finish: false,
      route: 'Carga de Proyectos',
      enable: false,
      canDownload: false,
      description: `Permite la carga de Proyectos desde un archivo Excel.`
    },
    {
      title: 'Registro de Proyectos',
      icon: 'description',
      imgIcon: 'Registro',
      finish: false,
      route: 'Registro de Proyectos',
      enable: false,
      canDownload: false,
      description: `Permite el registro de nuevos Proyectos.`
    },
  ]

  constructor(
    private _stateViewService: StateViewService,
  ) {
    this._stateViewService.editable = true;
    this._stateViewService.validation = false;
    this.options = getOptions(this.options);
  }

  ngOnInit(): void {
    this.body.classList.add('hideW');
  }

  ngOnDestroy(): void {
    this.body.classList.remove('hideW');
  }
}
