import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterDataService {
  private registerData = new BehaviorSubject<any>(null);
  public registerData$ = this.registerData.asObservable();

  constructor() {
    this.registerData.next(null);
  }

  sendData(data: any) {
    this.registerData.next(data);
    this.registerData.next(null);
  }
}
