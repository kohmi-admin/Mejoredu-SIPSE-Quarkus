import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx/xlsx.mjs';

@Injectable({
  providedIn: 'root',
})
export class ExcelXlsxService {
  excelToJson(file: File) {
    return new Promise<{
      sheetNames: string[];
      data: { Proyectos?: any; Actividades?: any; Productos?: any };
    }>((resolve, reject) => {
      const returnData = {
        sheetNames: [],
        data: {},
      };
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const arrayBuffer: any = fileReader.result;
        const data = new Uint8Array(arrayBuffer);
        const arr = new Array();
        for (let i = 0; i <= data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetNames = workbook.SheetNames;
        returnData.sheetNames = sheetNames;
        if (sheetNames?.length > 0) {
          for (const item of sheetNames) {
            const tmpWorksheet = workbook.Sheets[item];
            returnData.data[item] = XLSX.utils.sheet_to_json<string>(
              tmpWorksheet,
              {
                raw: true,
              }
            );
          }
        }
        resolve(returnData);
      };

      fileReader.onerror = (err: any) => {
        reject(err);
      };
    });

    // fileReader.onloadend = (e) => {
    //   // this.flag = true;
    // }
  }

  tableToExcel({
    tableId,
    nameSheet,
    fileName,
  }: {
    tableId: string;
    nameSheet?: string;
    fileName?: string;
  }): void {
    let element = document.getElementById(tableId);
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, nameSheet ?? 'Sheet1');

    XLSX.writeFile(
      book,
      fileName ?? `excel-${moment().format('DDMMYYYY')}.xlsx`
    );
  }
}
