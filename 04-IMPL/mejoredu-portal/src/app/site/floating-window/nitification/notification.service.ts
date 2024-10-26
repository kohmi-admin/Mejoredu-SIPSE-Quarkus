import { Injectable } from '@angular/core';
import {
  NotificationI,
  NotificationTypes,
} from '../classes/notifications.class';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications: NotificationI[] = []

  constructor() {
    moment.locale('es');
    this.notifications = [
      // {
      //   notificationType: NotificationTypes.AlertFile,
      //   seen: false,
      //   text: 'Ejemplo de notificación 1',
      //   date: moment(),
      // },
      // {
      //   notificationType: NotificationTypes.Missing,
      //   seen: false,
      //   text: 'Ejemplo de notificación 2',
      //   date: moment().subtract(5, 'minutes'),
      // },
      // {
      //   notificationType: NotificationTypes.Missing,
      //   seen: false,
      //   text: 'Ejemplo de notificación 3',
      //   date: moment().subtract(2, 'days'),
      // },
      // {
      //   notificationType: NotificationTypes.Missing,
      //   seen: false,
      //   text: 'Ejemplo de notificación 4',
      //   date: moment().subtract(5, 'days'),
      // },
      // {
      //   notificationType: NotificationTypes.Missing,
      //   seen: false,
      //   text: 'Ejemplo de notificación 5',
      //   date: moment().subtract(6, 'days'),
      // },
      // {
      //   notificationType: NotificationTypes.Missing,
      //   seen: false,
      //   text: 'Ejemplo de notificación 6',
      //   date: moment().subtract(12, 'days'),
      // },
      // {
      //   notificationType: NotificationTypes.Missing,
      //   seen: false,
      //   text: 'Ejemplo de notificación 7',
      //   date: moment().subtract(13, 'days'),
      // },
      // {
      //   notificationType: NotificationTypes.Missing,
      //   seen: false,
      //   text: 'Ejemplo de notificación 8',
      //   date: moment().subtract(4, 'week'),
      // },
    ];
  }
}
