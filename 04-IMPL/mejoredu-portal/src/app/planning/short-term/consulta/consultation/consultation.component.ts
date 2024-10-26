import { Component } from '@angular/core';
import { StateViewService } from '../../services/state-view.service';

@Component({
  selector: 'app-consultation',
  template: '<router-outlet></router-outlet>',
})
export class ConsultationComponent {
  constructor(
    private _stateViewService: StateViewService
  ) {
    this._stateViewService.editable = false;
    this._stateViewService.validation = false;
  }
}
