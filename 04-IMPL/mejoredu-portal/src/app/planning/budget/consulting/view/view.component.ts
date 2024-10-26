import { Component } from '@angular/core';
import { StateViewService } from '../../services/state-view.service';

@Component({
  selector: 'app-view',
  template: '<router-outlet></router-outlet>',
})
export class ViewComponent {
  constructor(
    private _stateViewService: StateViewService
  ) {
    this._stateViewService.editable = false;
    this._stateViewService.validation = false;
    this._stateViewService.consulting = true;
  }
}
