import { Component } from '@angular/core';
import { StateViewService } from '../../services/state-view.service';

@Component({
  selector: 'app-modify',
  template: '<router-outlet></router-outlet>',
})
export class ModifyComponent {
  constructor(
    private _stateViewService: StateViewService
  ) {
    this._stateViewService.editable = true;
    this._stateViewService.validation = true;
    this._stateViewService.consulting = false;
  }
}
