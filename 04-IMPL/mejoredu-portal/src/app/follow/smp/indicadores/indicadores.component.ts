import { Component, EventEmitter, Output } from '@angular/core';
import { IndicatorDataI } from './interfaces/indicator-data.interface';
import { TabsControlService } from '../services/tabs-control.service';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.scss'],
})
export class IndicadoresComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  activeIndicator: number = 0;

  data: IndicatorDataI[] = [
    {
      id: 1,
      meta: 'Meta para el bienestar',
      indicador:
        'Nivel de satisfacción de los actores clave con las herramientas, recursos y materiales educativos que genere la Comisión para la mejora de las escuelas de educación básica y media superior',
      linea: '0%<br>2018',
      metaBienestar: '100%',
      resultado1: 'na',
      resultado2: '60%',
      resultado3: 'na',
      resultado4: '40%',
      resultado5: '',
      resultado6: '',
      periodo: '53%',
    },
    {
      id: 2,
      meta: 'Parámetro 1',
      indicador:
        'Porcentaje de estudios e investigaciones especializadas y evaluaciones diagnósticas sobre procesos escolares elaborados por la Comisión en el año',
      linea: '0%<br>2018',
      metaBienestar: '100%',
      resultado1: 'na',
      resultado2: '100%',
      resultado3: 'na',
      resultado4: '100%',
      resultado5: '',
      resultado6: '',
      periodo: '100%',
    },
    {
      id: 3,
      meta: 'Parámetro 2',
      indicador:
        'Porcentaje de lineamientos y orientaciones emitidos por la Comisión para la mejora de las escuelas de educación básica y media superior en el año',
      linea: '0%<br>2018',
      metaBienestar: '100%',
      resultado1: 'na',
      resultado2: '60%',
      resultado3: 'na',
      resultado4: '40%',
      resultado5: '',
      resultado6: '',
      periodo: '53%',
    },
  ];

  constructor(private _tabsControlService: TabsControlService) { }

  async onTableAction(value: IndicatorDataI) {
    this.activeIndicator = value.id;
    this._tabsControlService.indicator = this.activeIndicator;
    this._tabsControlService.metaParametros = value.meta;
    this._tabsControlService.indicador = value.indicador;
  }
}
