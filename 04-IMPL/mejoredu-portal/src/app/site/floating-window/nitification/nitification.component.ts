import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationI } from '../classes/notifications.class';

@Component({
  selector: 'app-nitification',
  templateUrl: './nitification.component.html',
  styleUrls: ['./nitification.component.scss']
})
export class NitificationComponent {
  @Input() notification!: NotificationI;
  @Output() clicked = new EventEmitter<boolean>();
  typeString: string = 'Notificación';

  openNotification() {
    this.notification.seen = true;
  }

  toggleSeen() {
    this.notification.seen = !this.notification.seen;
  }

  getTimeString(): string {
    return this.notification.date.fromNow();
  }
}
