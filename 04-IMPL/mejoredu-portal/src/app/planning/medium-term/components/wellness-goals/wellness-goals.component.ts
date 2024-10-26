import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-wellness-goals',
  templateUrl: './wellness-goals.component.html',
  styleUrls: ['./wellness-goals.component.scss']
})
export class WellnessGoalsComponent {
  @Input() title = 'Metas Para el Bienestar';
  body = document.getElementsByTagName('body')[0];
  step: number = 0;

  constructor() {
    this.body.classList.add('hideW');
  }

  changeStep(add: number) {
    this.step += add;
  }

  ngOnDestroy(): void {
    this.body.classList.remove('hideW');
  }
}
