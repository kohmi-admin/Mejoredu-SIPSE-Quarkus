import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TableColumn } from '@common/models/tableColumn';
import { Observable, Subject } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss'],
})
export class StructureComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Input() editable: boolean = true;
  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  private _body = document.querySelector('body');

  data: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'record', header: 'Registro', alignLeft: true },
  ];
  actions = {
    edit: true,
    delete: true,
  };

  constructor() {
    this._body?.classList.add('hideW');
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.ls.remove('recordViewType');
    this.ls.remove('selectedValidatePI');
    this.ls.remove('selectedAjustesPI');
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }
}
