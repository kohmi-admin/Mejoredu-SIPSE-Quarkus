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
export class PPP016DatosGeneralesService {
  private ppP016DatosGenerales = new BehaviorSubject<IProps | null>(null);
  public ppP016DatosGenerales$ = this.ppP016DatosGenerales.asObservable();

  constructor() {
    this.ppP016DatosGenerales.next(null);
  }

  sendData(data: IProps) {
    this.ppP016DatosGenerales.next(data);
    this.ppP016DatosGenerales.next(null);
  }
}
