import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateViewService } from '../../services/state-view.service';

@Component({
  selector: 'app-registro',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroComponent {

  constructor(
    private _stateViewService: StateViewService
  ) {
    this._stateViewService.editable = true;
    this._stateViewService.validation = false;
  }

}
