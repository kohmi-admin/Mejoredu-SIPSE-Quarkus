import { Injectable } from '@angular/core';
import { OptionI } from '@common/form/interfaces/option.interface';
import { TableColumn } from '@common/models/tableColumn';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {

  constructor() { }

  async getAllModules(): Promise<OptionI[]> {
    return [
      {
        id: 1,
        value: 'Planeación',
      },
      {
        id: 2,
        value: 'Seguimiento',
      },
      {
        id: 3,
        value: 'Evaluación y Mejora Continua',
      },
      {
        id: 4,
        value: 'Reportes y Numeralia',
      },
    ];
  }

  async getAllSubmodules(module?: number): Promise<OptionI[]> {
    const subModules = [
      {
        id: 1,
        optional: 1,
        value: 'Planeación a Corto Plazo',
      },
      {
        id: 2,
        optional: 1,
        value: 'Planeación a Mediano Plazo',
      },
      {
        id: 3,
        optional: 1,
        value: 'Programas Presupuestarios',
      },
      {
        id: 4,
        optional: 2,
        value: 'Seguimiento del Programa Anual de Actividades',
      },
      {
        id: 5,
        optional: 2,
        value: 'Seguimiento MIR/FID',
      },
      {
        id: 6,
        optional: 2,
        value: 'Seguimiento al Mediano Plazo',
      },
      {
        id: 7,
        optional: 3,
        value: 'Evaluación Interna',
      },
      {
        id: 8,
        optional: 3,
        value: 'Evaluación Externa',
      },
      {
        id: 9,
        optional: 3,
        value: 'Encuestas',
      },
      {
        id: 10,
        optional: 4,
        value: 'Reportes',
      },
    ];
    if (module) {
      return subModules.filter((subModule) => subModule.optional === module);
    }
    return subModules;
  }

  async getAllTypes(submodule?: number): Promise<OptionI[]> {
    const options: OptionI[] = [
      {
        id: 1,
        optional: 1,
        value: 'Proyectos',
      },
      {
        id: 2,
        optional: 1,
        value: 'Actividades',
      },
      {
        id: 3,
        optional: 1,
        value: 'Productos',
      },
      {
        id: 4,
        optional: 1,
        value: 'Presupuestos',
      },
      {
        id: 5,
        optional: 2,
        value: 'Objetivos',
      },
      {
        id: 6,
        optional: 2,
        value: 'Estrategias',
      },
      {
        id: 7,
        optional: 2,
        value: 'Acciones',
      },
      {
        id: 8,
        optional: 2,
        value: 'Métas Para el Bienestar',
      },
      {
        id: 9,
        optional: 2,
        value: 'Parámetros',
      },
    ];
    if (submodule) {
      return options.filter((option) => option.optional === submodule);
    }
    return options;
  }

  async getColumnsOfType(type: number): Promise<TableColumn[]> {
    switch (type) {
      case 1:
        return this.getProjectsColumns();
      case 2:
        return this.getActivitiesColumns();
      case 3:
        return this.getProductsColumns();
      case 4:
        return this.getBudgetColumns();
      default:
        return  [
          { columnDef: 'name', header: 'Nombre', display: true, alignLeft: true },
        ];
    }
  }

  getData(type: number, termn?: string): any[] {
    switch (type) {
      case 1:
        return this.getProjects();
      case 2:
        return this.getActivities();
      case 3:
        return this.getProducts();
      case 4:
        return this.getBudget(termn);
      default:
        return [];
    }
  }

  getProjectsColumns(): TableColumn[] {
    const columns: TableColumn[] = [
      { columnDef: 'claveDelProyecto', header: 'Clave del Proyecto', display: true, width: '180px' },
      { columnDef: 'nombreDelProyecto', header: 'Nombre del Proyecto', display: true, alignLeft: true },
      { columnDef: 'unidadAdministrativa', header: 'Clave y nombre de la Unidad Administrativa', display: true, alignLeft: true },
      { columnDef: 'objetivoPrioritario', header: 'Clave del Objetivo Prioritario', display: true },
      { columnDef: 'estatus', header: 'Estatus', display: true },
    ];
    return columns;
  }

  getProjects(): any[] {
    return [
      {
        claveDelProyecto: '2421',
        nombreDelProyecto: 'Estudios, investigaciones especializadas y evaluaciones diagnósticas, formativas e integrales',
        unidadAdministrativa: 'P2100 Unidad de Evaluación Diagnóstica',
        objetivoPrioritario: '1',
        estatus: 'Registrado',
      },
      {
        claveDelProyecto: '2422',
        nombreDelProyecto: 'Difusión de productos institucionales que contribuyan a la mejora educativa',
        unidadAdministrativa: '2100 Unidad de Evaluación Diagnóstica',
        objetivoPrioritario: '1',
        estatus: 'Modificado',
      },
      {
        claveDelProyecto: '2423',
        nombreDelProyecto: 'Colaboración con autoridades educativas, instituciones y actores clave',
        unidadAdministrativa: '2100 Unidad de Evaluación Diagnóstica',
        objetivoPrioritario: '1',
        estatus: 'Eliminado',
      },
    ];
  }

  getActivitiesColumns(): TableColumn[] {
    const columns: TableColumn[] = [
      { columnDef: 'claveDelProyecto', header: 'Clave del Proyecto', display: true, },
      { columnDef: 'claveDeLaActividad', header: 'Clave de la Actividad', display: true, },
      { columnDef: 'nombreDeLaActividad', header: 'Nombre de la Actividad', display: true, },
      { columnDef: 'reunionArealizarse', header: 'Reunión a Realizarse', display: true, },
      { columnDef: 'claveObjetivoPrioritario', header: 'Clave del Objetivo Prioritario', display: true, },
      { columnDef: 'claveEstrategiaPrioritaria', header: 'Clave de la Estrategia Prioritaria', display: true, },
      { columnDef: 'claveAccionPuntual', header: 'Clave de la Acción Puntual', display: true, },
      { columnDef: 'estatus', header: 'Estatus', display: true, },
    ];
    return columns;
  }

  getActivities(): any[] {
    return [
      {
        claveDelProyecto: '2421',
        claveDeLaActividad: '0001',
        nombreDeLaActividad: 'Actividad 001',
        reunionArealizarse: 'No Aplica',
        claveObjetivoPrioritario: '1',
        claveEstrategiaPrioritaria: '1.1',
        claveAccionPuntual: '1.1.1',
        estatus: 'Registrado',
      },
      {
        claveDelProyecto: '2421',
        claveDeLaActividad: '0002',
        nombreDeLaActividad: 'Actividad 002',
        reunionArealizarse: '14/11/2023',
        claveObjetivoPrioritario: '1',
        claveEstrategiaPrioritaria: '1.1',
        claveAccionPuntual: '1.1.1',
        estatus: 'Modificado',
      },
      {
        claveDelProyecto: '2421',
        claveDeLaActividad: '0003',
        nombreDeLaActividad: 'Actividad 003',
        reunionArealizarse: 'No Aplica',
        claveObjetivoPrioritario: '1',
        claveEstrategiaPrioritaria: '1.1',
        claveAccionPuntual: '1.1.1',
        estatus: 'Eliminado',
      },
      {
        claveDelProyecto: '2421',
        claveDeLaActividad: '0004',
        nombreDeLaActividad: 'Actividad 004',
        reunionArealizarse: '17/11/2023',
        claveObjetivoPrioritario: '1',
        claveEstrategiaPrioritaria: '1.1',
        claveAccionPuntual: '1.1.1',
        estatus: 'Cancelado',
      },
    ];
  }

  getProductsColumns(): TableColumn[] {
    const columns: TableColumn[] = [
      { columnDef: 'claveDelProyecto', header: 'Clave del Proyecto', display: true },
      { columnDef: 'claveDeLaActividad', header: 'Clave de la Actividad', display: true },
      { columnDef: 'claveDelProducto', header: 'Clave del Producto', display: true },
      { columnDef: 'nombreDelProducto', header: 'Nombre del Producto', display: true, alignLeft: true },
      { columnDef: 'calendarización', header: 'Calendarización', display: true, alignLeft: true },
      { columnDef: 'tipodeIndicador', header: 'Tipo de Indicador', display: true, alignLeft: true },
      { columnDef: 'categorizaciónDelProducto', header: 'Categorización del Producto', display: true, alignLeft: true },
      { columnDef: 'nivelEducativo', header: 'Nivel Educativo', display: true, alignLeft: true },
      { columnDef: 'porPublicar', header: 'Por Publicar', display: true, alignLeft: true },
      { columnDef: 'estatus', header: 'Estatus', display: true },
    ];
    return columns;
  }

  getProducts(): any[] {
    return [
      {
        claveDelProyecto: '2421',
        claveDeLaActividad: '0001',
        claveDelProducto: '0001',
        nombreDelProducto: 'Producto 001',
        calendarización: 'Marzo: 1, Octubre: 2',
        tipodeIndicador: 'MIR',
        categorizaciónDelProducto: 'Producto de Gestión',
        nivelEducativo: 'Educación Básica',
        porPublicar: 'No Aplica',
        estatus: 'Registrado',
      },
      {
        claveDelProyecto: '2422',
        claveDeLaActividad: '0002',
        claveDelProducto: '0002',
        nombreDelProducto: 'Producto 002',
        calendarización: 'Marzo: 1, Octubre: 2',
        tipodeIndicador: 'MIR',
        categorizaciónDelProducto: 'Producto de Gestión',
        nivelEducativo: 'Educación Básica',
        porPublicar: 'No Aplica',
        estatus: 'Modificado',
      },
      {
        claveDelProyecto: '2423',
        claveDeLaActividad: '0003',
        claveDelProducto: '0003',
        nombreDelProducto: 'Producto 003',
        calendarización: 'Marzo: 1, Octubre: 2',
        tipodeIndicador: 'PI',
        categorizaciónDelProducto: 'Producto de Gestión',
        nivelEducativo: 'Educación Básica',
        porPublicar: '20/11/2023',
        estatus: 'Eliminado',
      },
      {
        claveDelProyecto: '2424',
        claveDeLaActividad: '0004',
        claveDelProducto: '0004',
        nombreDelProducto: 'Producto 004',
        calendarización: 'Marzo: 1, Octubre: 2',
        tipodeIndicador: 'MIR',
        categorizaciónDelProducto: 'Producto de Gestión',
        nivelEducativo: 'Educación Básica',
        porPublicar: 'No Aplica',
        estatus: 'Iniciado',
      },
      {
        claveDelProyecto: '2425',
        claveDeLaActividad: '0005',
        claveDelProducto: '0005',
        nombreDelProducto: 'Producto 005',
        calendarización: 'Marzo: 1, Octubre: 2',
        tipodeIndicador: 'MIR',
        categorizaciónDelProducto: 'Producto de Gestión',
        nivelEducativo: 'Educación Básica',
        porPublicar: '27/11/2023',
        estatus: 'En proceso',
      },
      {
        claveDelProyecto: '2426',
        claveDeLaActividad: '0006',
        claveDelProducto: '0006',
        nombreDelProducto: 'Producto 006',
        calendarización: 'Marzo: 1, Octubre: 2',
        tipodeIndicador: 'MIR',
        categorizaciónDelProducto: 'Producto de Gestión',
        nivelEducativo: 'Educación Básica',
        porPublicar: 'No Aplica',
        estatus: 'No Iniciado',
      },
      {
        claveDelProyecto: '2427',
        claveDeLaActividad: '0007',
        claveDelProducto: '0007',
        nombreDelProducto: 'Producto 007',
        calendarización: 'Marzo: 1, Octubre: 2',
        tipodeIndicador: 'MIR',
        categorizaciónDelProducto: 'Producto de Gestión',
        nivelEducativo: 'Educación Básica',
        porPublicar: 'No Aplica',
        estatus: 'Cancelado',
      },
    ];
  }

  getBudgetColumns(): TableColumn[] {
    const columns: TableColumn[] = [
      { columnDef: 'claveDelProyecto', header: 'Clave del Proyecto', display: true },
      { columnDef: 'claveDelProducto', header: 'Clave del Producto', display: true },
      { columnDef: 'claveDeLaActividad', header: 'Clave de la Actividad', display: true },
      { columnDef: 'partidasDeGasto', header: 'Partidas de Gasto', display: true, alignLeft: true },
      { columnDef: 'presupuestoAnual', header: 'Presupuesto Anual', display: true, alignLeft: true },
    ];
    return columns;
  }

  getBudget(termn?: string): any[] {
    const data = [
      {
        claveDelProyecto: '2421',
        claveDelProducto: '0001',
        claveDeLaActividad: '0001',
        partidasDeGasto: `
          Honorarios <br />
          Gasto general
        `,
        presupuestoAnual: '1,000,000.00',
      },
      {
        claveDelProyecto: '2421',
        claveDelProducto: '0001',
        claveDeLaActividad: '0002',
        partidasDeGasto: `
          Honorarios <br />
          Gasto general
        `,
        presupuestoAnual: '1,500,000.00',
      },
      {
        claveDelProyecto: '2421',
        claveDelProducto: '0001',
        claveDeLaActividad: '0003',
        partidasDeGasto: `
          Honorarios <br />
          Gasto general
        `,
        presupuestoAnual: '1,200,000.00',
      },
      {
        claveDelProyecto: '2422',
        claveDelProducto: '0002',
        claveDeLaActividad: '0004',
        partidasDeGasto: `
          Honorarios <br />
          Gasto general
        `,
        presupuestoAnual: '1,200,000.00',
      },
      {
        claveDelProyecto: '2422',
        claveDelProducto: '0002',
        claveDeLaActividad: '0005',
        partidasDeGasto: `
          Honorarios <br />
          Gasto general
        `,
        presupuestoAnual: '1,200,000.00',
      },
      {
        claveDelProyecto: '2423',
        claveDelProducto: '0003',
        claveDeLaActividad: '0004',
        partidasDeGasto: `
          Honorarios <br />
          Gasto general
        `,
        presupuestoAnual: '1,200,000.00',
      },
    ];
    return data.filter(d => d.claveDelProyecto === termn);
  }

}
