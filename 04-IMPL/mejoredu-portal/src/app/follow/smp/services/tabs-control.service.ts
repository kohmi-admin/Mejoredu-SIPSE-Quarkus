import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsControlService {
  private _meta: number = 0;
  private _indicator: number = 0;
  private _product: number = 0;
  public updateMeta: EventEmitter<number> = new EventEmitter<number>();
  public updateIndicator: EventEmitter<number> = new EventEmitter<number>();
  public updateProduct: EventEmitter<number> = new EventEmitter<number>();
  public avance: string = '';
  public metaParametros: string = '';
  public indicador: string = '';

  constructor() { }

  get meta(): number {
    return this._meta;
  }

  set meta(value: number) {
    this._meta = value;
    this.updateMeta.emit(value);
  }

  get indicator(): number {
    return this._indicator;
  }

  set indicator(value: number) {
    this._indicator = value;
    this.updateIndicator.emit(value);
  }

  get product(): number {
    return this._product;
  }

  set product(value: number) {
    this._product = value;
    this.updateProduct.emit(value);
  }
}
