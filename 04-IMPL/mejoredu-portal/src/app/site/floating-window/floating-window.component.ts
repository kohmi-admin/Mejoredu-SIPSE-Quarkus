import { AfterViewInit, Component, Input } from '@angular/core';
import { Notifications } from './classes/notifications.class';
import { NotificationService } from './nitification/notification.service';

export interface DocumentI {
  name: string;
  type: string;
  uuid: string;
}

@Component({
  selector: 'app-floating-window',
  templateUrl: './floating-window.component.html',
  styleUrls: ['./floating-window.component.scss'],
})
export class FloatingWindowComponent
  extends Notifications
  implements AfterViewInit {
  @Input() title: string = 'Normatividad';

  constructor(public notificationsService: NotificationService) {
    super(notificationsService);
  }
  ngAfterViewInit(): void {
    if (this.title == 'Notificaciones') {
      this.getNotifications();
    }
  }
}
