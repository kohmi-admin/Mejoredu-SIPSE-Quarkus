import { Component, OnDestroy } from '@angular/core';
import { FormsStateService } from './services/forms-state.service.ts.service';
import { Subscription } from 'rxjs';
import { RegisterDataService } from '@common/services/register-data.service';
import { StateViewService } from '../../services/state-view.service';
import * as SecureLS from 'secure-ls';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  index: number = 0;
  validation: boolean = false;
  private _body = document.querySelector('body');
  private registerDataSubs!: Subscription;

  public active = {
    projects: true,
    activities: true,
    products: true,
    budgets: true,
    mir: true,
    goalsWellBeing: true,
    generalView: true,
  };
  public completed = {
    projects: false,
    activities: false,
    products: false,
    budgets: false,
    mir: false,
    goalsWellBeing: false,
    generalView: false,
  };

  constructor(
    private _formsState: FormsStateService,
    private registerDataService: RegisterDataService,
    private _stateView: StateViewService
  ) {
    this._body?.classList.add('hideW');
    this._formsState.activeAllOptions.subscribe((active: any) => {
      this.active.activities = active;
      this.active.products = active;
      this.active.budgets = active;
    });
    this.validation = _stateView.validation;
  }

  ngOnInit() {
    this.registerDataSubs = this.registerDataService.registerData$.subscribe(
      (result) => {
        if (result) {
          for (const key in result) {
            if (Object.prototype.hasOwnProperty.call(result, key)) {
              const element = result[key];
              this.completed[key] = element;
            }
          }
        }
      }
    );
  }

  setRecord(action: any): void {
    const data = action?.data;
    const editable = action?.editable ? true : false;
    this._formsState.setReadonly(!editable);
    this.completed.projects = false;
    this.active.activities = false;
    if (data) {
      this.completed.projects = true;
      this.active.activities = true;
    }
    this._formsState.setProduct(data || undefined);
    this.active.projects = true;
    this.index = 1;
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.registerDataSubs.unsubscribe();
    this.ls.remove('selectedUploadMasiveProyectoPAA');
    this.ls.remove('selectedValidateProyectoPAA');
    this.ls.remove('selectedConsultaProyectoPAA');
    const selectedRubric = this.ls.get('selectedRubric');
    if (!selectedRubric) {
      this.ls.remove('selectedAjustesProyectoPAA');
    }
  }
}
