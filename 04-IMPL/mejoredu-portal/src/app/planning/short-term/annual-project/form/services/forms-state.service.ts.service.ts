import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FormsStateService {
  private _activeated: boolean = false;
  private _product: any;
  private _readonly: boolean = false;
  public activeAllOptions: EventEmitter<boolean> = new  EventEmitter<boolean>();

  constructor(
    private _router: Router,
  ) {
    if (!this._activeated) {
      // this._router.navigateByUrl('Planeación/Planeación a Corto Plazo/Proyecto Anual/Cargar Archivo');
    }
  }

  setProduct(product: any) {
    this._activeated = true;
    this._product = { ...product };
    if (product) {
      this.activeAllOptions.emit(true);
    }
  }

  activeAll() {
    this.activeAllOptions.emit(true);
  }
  
  unactiveAll() {
    this.activeAllOptions.emit(false);
  }

  getProduct() {
    return this._product;
  }

  setReadonly(readonly: boolean) {
    this._readonly = readonly;
  }

  getReadonly() { 
    return this._readonly;
  }

}
