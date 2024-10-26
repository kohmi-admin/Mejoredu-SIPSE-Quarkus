import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsControlService {
  private _project: number = 0;
  private _projectName: string = "";
  private _activity: number = 0;
  private _activityName: string = "";
  private _product: number = 0;
  public updateProgect: EventEmitter<number> = new EventEmitter<number>();
  public updateActivity: EventEmitter<number> = new EventEmitter<number>();
  public updateProduct: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  get project(): number {
    return this._project;
  }

  get projectName(): string {
    return this._projectName;
  }

  set project(value: number) {
    this._project = value;
    this.updateProgect.emit(value);
  }

  set projectName(value: string) {
    this._projectName = value;
  }

  get activity(): number {
    return this._activity;
  }

  set activity(value: number) {
    this._activity = value;
    this.updateActivity.emit(value);
  }
  
  get activityName(): string {
    return this._activityName;
  }

  set activityName(value: string) {
    this._activityName = value;
  }

  get product(): number {
    return this._product;
  }

  set product(value: number) {
    this._product = value;
    this.updateProduct.emit(value);
  }
}
