import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsControlService {
  private _project: number = 0;
  private _activity: number = 0;
  private _activityNombreCve: string = "";
  private _product: number = 0;
  private _projectNombreCve: string = "";
  public updateProgect: EventEmitter<number> = new EventEmitter<number>();
  public updateActivity: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  get project(): number {
    return this._project;
  }

  set project(value: number) {
    this._project = value;
    this.updateProgect.emit(value);
  }

  get projectNombreCve(): string {
    return this._projectNombreCve;
  }
  
  set projectNombreCve(value: string) {
    this._projectNombreCve = value;
  }

  get activity(): number {
    return this._activity;
  }

  set activity(value: number) {
    this._activity = value;
    this.updateActivity.emit(value);
  }

  get activityNombreCve(): string {
    return this._activityNombreCve;
  }

  set activityNombreCve(value: string) {
    this._activityNombreCve = value;
  }

  get product(): number {
    return this._product;
  }
}
