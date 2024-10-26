import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }

  getDefaultFormat(date: Date): string {
    return moment(date).format('YYYY-MM-DD')
  }

  getDefaultFormatByString(date: string): string {
    return moment(date).format('YYYY-MM-DD')
  }
}
