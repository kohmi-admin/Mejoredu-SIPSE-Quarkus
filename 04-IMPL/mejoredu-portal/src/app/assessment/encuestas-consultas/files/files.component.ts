import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@common/services/alert.service';
import { FileI } from 'src/app/assessment/classes/file.interface';
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
  styleUrls: ['../../styles/files.scss'],
})
export class FilesComponent extends FilesViewer implements OnInit {
  override data: FileI[] = [
    {
      id: 1,
      document: 'Ficha Técnica',
    },
    {
      id: 2,
      document: 'Batería de Reactivos',
    },
    {
      id: 2,
      document: 'Informe de Resultados',
    },
  ];

  constructor(
    private alertService: AlertService,
    public dialogRef: MatDialogRef<FilesComponent>,
    @Inject(MAT_DIALOG_DATA) public model: any
  ) {
    super(alertService);
  }

  ngOnInit(): void {
    this.getAll();
  }
}
