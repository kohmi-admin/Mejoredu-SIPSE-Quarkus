import { EventEmitter, Injectable } from '@angular/core';
import { IProjectsAnhioStatus } from '../proyects/proyects.component';

@Injectable({
  providedIn: 'root'
})
export class TabsControlService {
  private _project!: IProjectsAnhioStatus;
  private _projectName: string = '';
  private _activity: any;
  private _activityName: string = '';
  private _product: number = 0;
  private _productName: string = '';
  private _sdvance: number = 0;
  public updateProgect: EventEmitter<IProjectsAnhioStatus> = new EventEmitter<IProjectsAnhioStatus>();
  public updateActivity: EventEmitter<any> = new EventEmitter<any>();
  public updateProduct: EventEmitter<number> = new EventEmitter<number>();
  public updateProgectName: EventEmitter<string> = new EventEmitter<string>();
  public updateActivityName: EventEmitter<string> = new EventEmitter<string>();
  public updateProductName: EventEmitter<string> = new EventEmitter<string>();
  public updateAdvance: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  get project(): IProjectsAnhioStatus {
    return this._project;
  }

  set project(value: IProjectsAnhioStatus) {
    this._project = value;
    this.updateProgect.emit(value);
  }

  get projectName(): string {
    return this._projectName;
  }

  set projectName(value: string) {
    this._projectName = value;
    this.updateProgectName.emit(value);
  }

  get activity(): any {
    return this._activity;
  }

  set activity(value: any) {
    this._activity = value;
    this.updateActivity.emit(value);
  }

  get activityName(): string {
    return this._activityName;
  }

  set activityName(value: string) {
    this._activityName = value;
    this.updateActivityName.emit(value);
  }

  get product(): any {
    return this._product;
  }

  set product(value: number) {
    this._product = value;
    this.updateProduct.emit(value);
  }

  get productName(): string {
    return this._productName;
  }

  set productName(value: string) {
    this._productName = value;
    this.updateProductName.emit(value);
  }

  get advance(): any {
    return this._sdvance;
  }

  set advance(value: number) {
    this._sdvance = value;
    this.updateAdvance.emit(value);
  }
}
