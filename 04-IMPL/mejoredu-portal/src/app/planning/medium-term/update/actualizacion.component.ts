import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateViewService } from '../services/state-view.service';

@Component({
  selector: 'app-actualizacion',
  template: '<router-outlet></router-outlet>'
})
export class ActualizacionComponent {

  constructor(
    private _stateViewService: StateViewService
  ) {
    this._stateViewService.editable = true;
    this._stateViewService.validation = true;
  }

}
