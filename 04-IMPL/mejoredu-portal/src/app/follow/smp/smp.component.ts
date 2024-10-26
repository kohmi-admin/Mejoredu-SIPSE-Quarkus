import { Component } from '@angular/core';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-smp',
  templateUrl: './smp.component.html',
  styleUrls: ['./smp.component.scss']
})
export class SmpComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  uuidAlfresco: string;
  canDelete: boolean = false;

  constructor() {
    const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
    this.uuidAlfresco = dataAlf.uuidSeguimiento;
    this.canDelete = true;
  }
}
