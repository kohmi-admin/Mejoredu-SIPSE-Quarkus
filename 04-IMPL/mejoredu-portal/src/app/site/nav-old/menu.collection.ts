import { faChartBar, faFileLines, faFileText, faListAlt } from '@fortawesome/free-regular-svg-icons';
import { MENUI } from './interfaces/menu.interrface';
export { MENUI };

export const menu: MENUI[] = [
  {
    id: 1,
    link: '/planning',
    name: 'Planeación',
    icon: faListAlt,
  },
  {
    id: 2,
    link: '/tracking',
    name: 'Seguimiento',
    icon: faFileText,
  },
  {
    id: 3,
    link: '/evaluation',
    name: 'Evaluación y Mejora Contínua',
    icon: faChartBar,
  },
  {
    id: 4,
    link: '/reports',
    name: 'Reportes y Numeralía',
    icon: faFileLines,
  }
];
