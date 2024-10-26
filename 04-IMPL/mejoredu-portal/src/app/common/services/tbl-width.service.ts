import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TblWidthService {

  constructor() { }

  getColWidth(widthLess: number, percent: number) {
    const tbl1 = document.getElementById('tbl1');
    const calc = ((tbl1?.offsetWidth || 0) / percent) - widthLess;
    return calc;
  }
}
