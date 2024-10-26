import { ElementRef } from '@angular/core';
import html2PDF from 'jspdf-html2canvas';
import * as XLSX from 'xlsx';
import { TablesI } from './tables.interface';

export class ReportActions {
  reportName: string = 'report';
  table!: ElementRef;
  makingReport: boolean = false;

  async descargar(): Promise<void> {
    this.makingReport = true;
    await new Promise((resolve) => setTimeout(resolve, 50));
    let page: any = document.getElementById('report-space');
    html2PDF(page, {
      jsPDF: {
        unit: 'pt',
        format: 'a4',
      },
      html2canvas: {
        imageTimeout: 15000,
        logging: false,
        useCORS: false,
      },
      imageType: 'image/jpeg',
      imageQuality: 1,
      margin: {
        top: 10,
        right: 0,
        bottom: 10,
        left: 0,
      },
      watermark: undefined,
      autoResize: true,
      output: 'jspdf-generate.pdf',
      init: function () { },
      success: (pdf) => {
        pdf.save(this.reportName);
        this.makingReport = false;
      },
    });
  }

  exportExcel(items: TablesI[]) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    items.forEach((item: TablesI) => {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
        this.table.nativeElement
      );
      XLSX.utils.book_append_sheet(wb, ws, item.name);
    });
    /* save to file */
    XLSX.writeFile(wb, `${this.reportName}.xlsx`);
  }
}
