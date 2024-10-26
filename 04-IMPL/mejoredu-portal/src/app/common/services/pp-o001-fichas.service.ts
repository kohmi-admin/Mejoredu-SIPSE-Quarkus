import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IProps {
  from: 'form' | 'table';
  data: any;
  enabledForm: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PPO001FichasService {
  private ppO001Fichas = new BehaviorSubject<IProps | null>(null);
  public ppO001Fichas$ = this.ppO001Fichas.asObservable();

  constructor() {
    this.ppO001Fichas.next(null);
  }

  sendData(data: IProps) {
    this.ppO001Fichas.next(data);
    this.ppO001Fichas.next(null);
  }
}
