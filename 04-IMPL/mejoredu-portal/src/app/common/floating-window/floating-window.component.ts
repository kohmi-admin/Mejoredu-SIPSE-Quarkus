import { Component, Input } from '@angular/core';

export interface DocumentI {
  name: string;
  type: string;
}

@Component({
  selector: 'app-floating-window',
  templateUrl: './floating-window.component.html',
  styleUrls: ['./floating-window.component.scss'],
})
export class FloatingWindowComponent {
  @Input() title: string = 'Normatividad';
  @Input() documents!: DocumentI[];

  constructor(
  ) {
  }

}
