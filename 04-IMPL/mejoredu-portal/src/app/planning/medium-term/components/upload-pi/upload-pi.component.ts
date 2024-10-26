import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IArrFilesResponse } from '@common/interfaces/epilogo.interface';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { Subject } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-upload-pi',
  templateUrl: './upload-pi.component.html',
  styleUrls: ['./upload-pi.component.scss'],
})
export class UploadPiComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Input() editable: boolean = true;
  @Input() filesArchivosPi: IArrFilesResponse[] = [];
  @Input() filesActas: IArrFilesResponse[] = [];
  @Input() consultation: boolean = false;
  @Output() onOutputFile = new EventEmitter<any>();
  @Output() onTableActionArchivosPi = new EventEmitter<any>();
  @Output() onTableActionActas = new EventEmitter<any>();
  columnsPi: TableColumn[] = [
    { columnDef: 'name', header: 'Nombre del Documento', alignLeft: true },
    { columnDef: 'year', header: 'Año', width: '120px' },
    { columnDef: 'date', header: 'Fecha y Hora de Carga', width: '210px' },
  ];
  columnsActas: TableColumn[] = [
    { columnDef: 'name', header: 'Nombre del Documento', alignLeft: true },
    { columnDef: 'year', header: 'Año', width: '120px' },
    { columnDef: 'date', header: 'Fecha y Hora de Carga', width: '210px' },
  ];
  actionsPi = {
    delete: true,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
        icon: 'download',
        color: 'primary',
      },
    ],
  };
  actionsActas = {
    delete: true,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
        icon: 'download',
        color: 'primary',
      },
    ],
  };
  loading = false;
  body = document.querySelector('body');
  notifier = new Subject();
  isSubmitingActas: boolean = false;
  isSubmitingArchivosPi: boolean = false;
  arrayFilesPi: any[] = [];
  arrayFilesActas: any[] = [];

  constructor() {
    this.body?.classList.add('hideW');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['consultation']) {
      if (changes['consultation'].currentValue) {
        this.actionsPi.delete = false;
        this.actionsActas.delete = false;
      } else {
        this.actionsPi.delete = true;
        this.actionsActas.delete = true;
      }
    }
  }

  handleTableActionArchivosPi(event: TableButtonAction) {
    this.onTableActionArchivosPi.emit(event);
  }

  handleTableActionActas(event: TableButtonAction) {
    this.onTableActionActas.emit(event);
  }

  addFileArchivosPi() {
    this.onOutputFile.emit({
      type: 'pi',
      newFile: this.arrayFilesPi[0],
    });
    this.arrayFilesPi = [];
  }

  addFileActa() {
    this.onOutputFile.emit({
      type: 'acta',
      newFile: this.arrayFilesActas[0],
    });
    this.arrayFilesActas = [];
  }

  ngOnDestroy(): void {
    this.body?.classList.remove('hideW');
    this.notifier.complete();
  }
}
