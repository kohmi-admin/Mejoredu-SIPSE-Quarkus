import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlternSwitchService {
  changeAdecuation: EventEmitter<number> = new EventEmitter<number>();
  private _adecuation: number = 0;

  constructor() { }

  setAdecuation(value: number): void {
    this._adecuation = value;
    this.changeAdecuation.emit(value);
  }

  getAdecuation(): number {
    return this._adecuation;
  }

}
