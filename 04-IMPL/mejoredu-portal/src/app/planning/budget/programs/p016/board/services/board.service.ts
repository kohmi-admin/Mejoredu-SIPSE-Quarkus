import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private _editableInput: boolean = false;
  private _canAdd: boolean = false;
  private _canEdit: boolean = true;

  constructor() { }
  
  get editableInput(): boolean {
    return this._editableInput;
  }

  set editableInput(value: boolean) {
    this._editableInput = value;
  }

  get canAdd(): boolean {
    return this._canAdd;
  }

  set canAdd(value: boolean) {
    this._canAdd = value;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  set canEdit(value: boolean) {
    this._canEdit = value;
  }
}
