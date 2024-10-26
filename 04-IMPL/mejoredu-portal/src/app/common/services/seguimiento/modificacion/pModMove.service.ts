import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IProps {
  from: 'left' | 'right';
  isNew: boolean;
  viewType: 'view' | 'edit';
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class PModMoveService {
  private pModMove = new BehaviorSubject<IProps | null>(null);
  public pModMove$ = this.pModMove.asObservable();

  constructor() {
    this.pModMove.next(null);
  }

  sendData(data: IProps) {
    this.pModMove.next(data);
    this.pModMove.next(null);
  }
}
