import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { TablesI } from 'src/app/reports/numeralia/class/tables.interface';

@Injectable({
  providedIn: 'root',
})
export class GenerateXLSXService {
  constructor() { }

  exportExcel(reportName: string, items: TablesI[]) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    items.forEach((item: TablesI) => {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
        item.item.nativeElement,
        { raw: true }
      );
      XLSX.utils.book_append_sheet(wb, ws, item.name);
    });
    /* save to file */
    XLSX.writeFile(wb, `${reportName}.xlsx`);
  }
}
