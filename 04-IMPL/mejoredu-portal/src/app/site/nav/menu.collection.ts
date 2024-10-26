import { IMenu } from './interfaces/menu.interface';

export const menu: IMenu[] = [
  {
    name: 'Planeación',
    icon: 'assignment',
    active: false,
    facultad: "ROL_MOD_PLANEACION",
    children: [
      {
        id: 3,
        name: 'Planeación a Corto Plazo',
        icon: 'today',
        path: '/Planeación/Planeación a Corto Plazo',
        children: [
          {
            id: 3,
            name: 'Formulación',
            path: '/Formulación',
            roles: ['ADMINISTRADOR', 'ENLACE'],
            children: [
              {
                id: 3,
                name: 'Carga de Proyectos',
                path: '/Carga de Proyectos',
                width: 180,
              },
              {
                id: 3,
                name: 'Registro de Proyectos',
                path: '/Registro de Proyectos',
              },
            ],
          },
          {
            id: 3,
            name: 'Ajustes',
            path: '/Ajustes',
            roles: ['ADMINISTRADOR', 'ENLACE'],
          },
          {
            id: 3,
            name: 'Revisión y Validación',
            path: '/Revisión y Validación',
            roles: ['ADMINISTRADOR', 'PRESUPUESTO', 'PLANEACION', 'SUPERVISOR'],
          },
          {
            id: 3,
            name: 'Consulta',
            path: '/Consulta',
            width: 130,
          },
        ],
      },
      {
        id: 1,
        name: 'Planeación de Mediano Plazo',
        icon: 'event_note',
        path: '/Planeación/Planeación de Mediano Plazo',
        children: [
          {
            id: 1,
            name: 'Registro',
            path: '/Registro',
            roles: ['ADMINISTRADOR', 'ENLACE'],
            children: [],
          },
          {
            id: 1,
            name: 'Ajustes',
            path: '/Ajustes',
            roles: ['ADMINISTRADOR', 'ENLACE'],
            children: [
            ],
          },
          {
            id: 3,
            name: 'Validación',
            path: '/Validación',
            roles: ['ADMINISTRADOR', 'SUPERVISOR'],
          },
          {
            id: 1,
            name: 'Consulta',
            path: '/Consulta',
            width: 135,
            children: [],
          },
        ],
      },
      {
        id: 2,
        name: 'Programas Presupuestarios',
        icon: 'monetization_on',
        path: '/Planeación/Programas Presupuestarios',
        children: [
          {
            id: 2,
            name: 'Registro',
            path: '/Registro',
            roles: ['ADMINISTRADOR', 'ENLACE'],
            children: [
              {
                id: 2,
                name: 'P016',
                path: '/P016',
                width: 65,
                children: [],
              },
              {
                id: 2,
                name: 'M001',
                path: '/M001',
                children: [],
              },
              {
                id: 2,
                name: 'O001',
                path: '/O001',
                children: [],
              },
            ],
          },
          {
            id: 2,
            name: 'Actualización',
            path: '/Actualización',
            roles: ['ADMINISTRADOR', 'ENLACE'],
            children: [
            ],
          },
          {
            id: 3,
            name: 'Validación',
            path: '/Validación',
            roles: ['ADMINISTRADOR', 'SUPERVISOR'],
          },
          {
            id: 2,
            name: 'Consulta',
            path: '/Consulta',
            width: 135,
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Seguimiento',
    icon: 'fact_check',
    active: false,
    facultad: "ROL_MOD_SEGUIMIENTO",
    children: [
      {
        id: 4,
        name: 'Seguimiento del Programa Anual de Actividades',
        icon: 'trending_up',
        path: '/Seguimiento/Seguimiento del Programa Anual de Actividades',
        children: [
          {
            id: 4,
            name: 'Adecuaciones',
            path: '/Adecuaciones',
            roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'], //COMMENT: Cambio CSR solicitud Dalia
            children: [
              {
                id: 4,
                name: 'Solicitudes',
                path: '/Solicitudes',
                roles: ['ADMINISTRADOR', 'ENLACE', 'CONSULTOR'],
              },
              {
                id: 4,
                name: 'Revisión de Solicitudes',
                path: '/Revisión de Solicitudes',
                roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'],
                width: 235,
              },
            ],
          },
          {
            id: 4,
            name: 'Avances Programáticos',
            path: '/Avances Programáticos',
            roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'], //COMMENT: Cambio CSR solicitud Dalia
            children: [
              {
                id: 4,
                name: 'Registro de Avances Programáticos',
                path: '/Registro de Avances Programáticos',
              },
              {
                id: 4,
                name: 'Revisión Trimestral',
                path: '/Revisión Trimestral',
                width: 235,
              },
            ],
          },
          {
            id: 4,
            name: 'Estatus Programático-Presupuestal',
            path: '/Estatus Programático-Presupuestal',
            width: 235,
          },
        ],
      },
      {
        id: 5,
        name: 'Seguimiento MIR/FID',
        icon: 'area_chart',
        path: '/Seguimiento/Seguimiento MIR|FID',
        roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'], //COMMENT: Cambio CSR solicitud Dalia
        children: [
          {
            id: 2,
            name: 'P016',
            path: '/P016',
            width: 65,
            children: [],
          },
          {
            id: 2,
            name: 'M001',
            path: '/M001',
            children: [],
          },
          {
            id: 2,
            name: 'O001',
            path: '/O001',
            children: [],
          },
        ],
      },
      {
        id: 6,
        name: 'Seguimiento al Mediano Plazo',
        icon: 'query_stats',
        path: '/Seguimiento/Seguimiento al Mediano Plazo',
        roles: ['ADMINISTRADOR', 'ENLACE', "PLANEACION", 'PRESUPUESTO', 'SUPERVISOR'], //COMMENT: Cambio CSR solicitud Dalia
      },
    ],
  },
  {
    name: 'Evaluación y Mejora Continua',
    icon: 'assessment',
    active: false,
    facultad: "ROL_MOD_EVALUACION",
    children: [
      {
        id: 7,
        name: 'Evaluación Interna',
        icon: 'task',
        path: '/Evaluación y Mejora Continua/Evaluación Interna',
        children: [
          {
            id: 7,
            name: 'Informe de Autoevaluacion',
            path: '/Informe de Autoevaluacion',
            width: 215,
          },
          {
            id: 7,
            name: 'Evaluación Interna del Desempeño',
            path: '/Evaluación Interna del Desempeño',
          },
        ],
      },
      {
        id: 8,
        name: 'Evaluación Externa',
        icon: 'rate_review',
        path: '/Evaluación y Mejora Continua/Evaluación Externa',
      },
      {
        id: 9,
        name: 'Encuestas y Consultas',
        icon: 'comment',
        path: '/Evaluación y Mejora Continua/Encuestas y Consultas',
      },
    ],
  },
  {
    name: 'Reportes y Numeralia',
    icon: 'library_books',
    active: false,
    facultad: "ROL_MOD_REPORTES",
    children: [
      {
        id: 10,
        name: 'Numeralia',
        icon: 'pie_chart',
        path: 'Reportes y Numeralia/Numeralia',
      },
      {
        id: 10,
        name: 'Reportes',
        icon: 'description',
        path: 'Reportes y Numeralia/Reportes',
      },
      {
        id: 10,
        name: 'Extractor de Datos',
        icon: 'storage',
        path: 'Reportes y Numeralia/Extractor de Datos',
      },
    ],
  },
];
