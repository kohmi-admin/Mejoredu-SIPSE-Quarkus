import { Component } from '@angular/core';
import { StateViewService } from '../services/state-view.service';

@Component({
  selector: 'app-register',
  template: '<router-outlet></router-outlet>',
})
export class RegisterComponent {
  constructor(
    private _stateViewService: StateViewService
  ) {
    this._stateViewService.editable = true;
    this._stateViewService.validation = false;
    this._stateViewService.consulting = false;
  }
}
