import { Component } from '@angular/core';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['../reports.component.scss', './reports.component.scss']
})
export class ReportsComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  uuidAlfresco: string;
  canDelete: boolean = false;

  constructor() {
    const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
    this.uuidAlfresco = dataAlf.uuidReporte;
    this.canDelete = true;
  }
}
