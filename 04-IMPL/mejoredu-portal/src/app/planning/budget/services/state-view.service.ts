import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateViewService {
  private _editable: boolean = false;
  private _validation: boolean = false;
  private _consulting: boolean = false;

  constructor() { }

  get editable(): boolean {
    return this._editable;
  }

  set editable(value: boolean) {
    this._editable = value;
  }

  get validation(): boolean {
    return this._validation;
  }

  set validation(value: boolean) {
    this._validation = value;
  }

  get consulting(): boolean {
    return this._consulting;
  }

  set consulting(value: boolean) {
    this._consulting = value;
  }
}
