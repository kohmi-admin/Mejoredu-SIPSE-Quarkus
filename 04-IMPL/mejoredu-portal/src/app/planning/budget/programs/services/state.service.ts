import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _canEdit: boolean = true;

  constructor() {}

  setCanEdit(canEdit: boolean): void {
    this._canEdit = canEdit;
  }

  getCanEdit(): boolean {
    return this._canEdit;
  }

}
