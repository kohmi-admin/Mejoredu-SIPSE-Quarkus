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
export class PPM001FichasService {
  private ppM001Fichas = new BehaviorSubject<IProps | null>(null);
  public ppM001Fichas$ = this.ppM001Fichas.asObservable();

  constructor() {
    this.ppM001Fichas.next(null);
  }

  sendData(data: IProps) {
    this.ppM001Fichas.next(data);
    this.ppM001Fichas.next(null);
  }
}
