import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inform',
  templateUrl: './inform.component.html',
  styleUrls: ['./inform.component.scss']
})
export class InformComponent {
  @Input() onlyView = false;
}
