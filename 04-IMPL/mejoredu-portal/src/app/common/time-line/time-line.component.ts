import { Component, Input } from '@angular/core';
import { TimeLineI } from './interfaces/time-line.interface';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent {
  @Input() items: TimeLineI[] = [
    {
      id: 1,
      title: 'Pre-registro',
      date: '12/12/2020',
      icon: 'edit',
      color: 'green',
      active: true,
    },
    {
      id: 2,
      title: 'Registrado',
      date: '12/12/2020',
      icon: 'edit_square',
      color: 'green',
      active: true,
    },
    {
      id: 3,
      title: 'Por Revisar',
      date: '12/12/2020',
      icon: 'schedule',
      color: 'green'
    },
    {
      id: 4,
      title: 'En Revisión',
      date: '12/12/2020',
      icon: 'search',
      color: 'green'
    },
    {
      id: 5,
      title: 'Rechasada',
      date: '12/12/2020',
      icon: 'close',
      color: 'green'
    },
    {
      id: 6,
      title: 'Revisada',
      date: '12/12/2020',
      icon: 'check',
      color: 'green'
    },
    {
      id: 7,
      title: 'Formalizado',
      date: '12/12/2020',
      icon: 'check_circle',
      color: 'green'
    },
    {
      id: 8,
      title: 'Rubricado',
      date: '12/12/2020',
      icon: 'check_circle_outline',
      color: 'green'
    },
    {
      id: 9,
      title: 'Aprobada',
      date: '12/12/2020',
      icon: 'check_circle_outline',
      color: 'green'
    },
    {
      id: 10,
      title: 'Aprobación Cambio de MIR',
      date: '12/12/2020',
      icon: 'check_circle_outline',
      color: 'green'
    },
  ];
  @Input() status = 0;
}
