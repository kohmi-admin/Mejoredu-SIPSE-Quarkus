import { Injectable } from '@angular/core';
import { OptionI } from '@common/form/interfaces/option.interface';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  constructor() { }

  async getAllModules(): Promise<OptionI[]> {
    return [
      {
        id: '1',
        value: 'Planeación',
      },
      {
        id: '2',
        value: 'Seguimiento',
      },
      {
        id: '3',
        value: 'Evaluación y Mejora Continua',
      },
      {
        id: '4',
        value: 'Reportes y Numeralia',
      },
    ];
  }

  async getAllSubmodules(module?: string): Promise<OptionI[]> {
    const subModules = [
      {
        id: '1',
        optional: '1',
        value: 'Planeación a Corto Plazo',
      },
      {
        id: '2',
        optional: '1',
        value: 'Planeación a Mediano Plazo',
      },
      {
        id: '3',
        optional: '1',
        value: 'Programas Presupuestarios',
      },
      {
        id: '4',
        optional: '2',
        value: 'Seguimiento del Programa Anual de Actividades',
      },
      {
        id: '5',
        optional: '2',
        value: 'Seguimiento MIR/FID',
      },
      {
        id: '6',
        optional: '2',
        value: 'Seguimiento al Mediano Plazo',
      },
      {
        id: '7',
        optional: '3',
        value: 'Evaluación Interna',
      },
      {
        id: '8',
        optional: '3',
        value: 'Evaluación Externa',
      },
      {
        id: '9',
        optional: '3',
        value: 'Encuestas',
      },
      {
        id: '10',
        optional: '4',
        value: 'Reportes',
      },
    ];
    if (module) {
      return subModules.filter((subModule) => subModule.optional === module);
    }
    return subModules;
  }

  async getAllOptions(submodule?: number): Promise<OptionI[]> {
    const options: OptionI[] = [
      {
        id: '1',
        optional: '1',
        value: 'Formulación',
      },
      {
        id: '2',
        optional: '1',
        value: 'Ajustes',
      },
      {
        id: '3',
        optional: '1',
        value: 'Revisión y Validación',
      },
      {
        id: '4',
        optional: '1',
        value: 'Consulta',
      },
      {
        id: '5',
        optional: '2',
        value: 'Registro',
      },
      {
        id: '6',
        optional: '2',
        value: 'Actualización',
      },
      {
        id: '7',
        optional: '2',
        value: 'Consulta',
      },
      {
        id: '8',
        optional: '3',
        value: 'Registro',
      },
      {
        id: '9',
        optional: '3',
        value: 'Actualización',
      },
      {
        id: '10',
        optional: '3',
        value: 'Consulta',
      },
      {
        id: '11',
        optional: '4',
        value: 'Adecuaciones',
      },
      {
        id: '12',
        optional: '4',
        value: 'Avances Programáticos',
      },
      {
        id: '13',
        optional: '4',
        value: 'Estatus programático-presupuestal',
      },
    ];
    if (submodule) {
      return options.filter((option) => option.optional === submodule);
    }
    return options;
  }
}
