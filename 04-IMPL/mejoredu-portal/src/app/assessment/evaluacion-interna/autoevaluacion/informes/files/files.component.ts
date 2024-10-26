import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { AlfrescoService } from '@common/services/alfresco.service';
import { FilesViewer } from 'src/app/assessment/classes/files-viewer.class';

@Component({
  selector: 'app-files',
  template: `
    <h1 mat-dialog-title>{{ title }}</h1>
    <div mat-dialog-content>
      <app-mat-custom-table
        *ngIf="!loading"
        (action)="onTableAction($event)"
        (update)="getAll()"
        [actions]="actions"
        [dataset]="data"
        [maxWidthActions]="'220px'"
        [columns]="columns"
      >
      </app-mat-custom-table>
    </div>
  `,
  styleUrls: ['../../../../styles/files.scss'],
})
export class FilesComponent extends FilesViewer implements OnInit {
  override data: any[] = [];
  override columns: TableColumn[] = [
    { columnDef: 'fileType', header: 'Tipo de archivo', alignLeft: true },
    { columnDef: 'cxNombre', header: 'Nombre', alignLeft: true },
  ];
  override actions: TableActionsI = {
    view: false,
    delete: false,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
        icon: 'download',
      },
    ],
  };

  constructor(
    private alertService: AlertService,
    public dialogRef: MatDialogRef<FilesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any,
    private alfrescoService: AlfrescoService
  ) {
    super(alertService);
    this.data = dataModal.fileList ?? [];
  }

  ngOnInit(): void {
    this.getAll();
  }

  override async onTableAction(event: TableButtonAction) {
    if (event.name === 'download') {
      this.alertService.showAlert('En breve se descargará el archivo');
      this.downloadFileAlf(event.value.cxUuid, event.value.cxNombre);
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }
}
