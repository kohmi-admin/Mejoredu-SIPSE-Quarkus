import { Component } from '@angular/core';
import { StateViewService } from '../../services/state-view.service';

@Component({
  selector: 'app-validate',
  template: '<router-outlet></router-outlet>',
})
export class ValidateComponent {
  constructor(
    private _stateViewService: StateViewService
  ) {
    this._stateViewService.editable = false;
    this._stateViewService.validation = true;
    this._stateViewService.consulting = false;
  }
}
