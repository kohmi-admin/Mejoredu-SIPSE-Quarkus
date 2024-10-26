import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  selectedActionLeft: number | null = null;
  formLeft: EventEmitter<any> = new EventEmitter();
  formRight: EventEmitter<any> = new EventEmitter();

  constructor() { }

  setFormLeft(form: any): void {
    this.formLeft.emit(form);
  }

  setFormRight(form: any): void {
    this.formRight.emit(form);
  }
}
