import * as moment from 'moment';
import { NotificationService } from '../nitification/notification.service';

export enum NotificationTypes {
    Missing = 1,
    AlertFile = 2,
}

export interface NotificationI {
  text: string;
  seen: boolean;
  date: moment.Moment;
  notificationType: NotificationTypes;
}

export class Notifications {
  notifications!: NotificationI[];

  constructor(
    public _notificationsService: NotificationService,
  ) {

  }

  getNotificationTime(date: moment.Moment): string {
    return date.fromNow();
  }

  getNotifications(): void {
    moment.locale('es');
    this.notifications = this._notificationsService.notifications;
  }

  markAllAsSeen(): void {
    this.notifications.forEach((n) => n.seen = true);
  }

}