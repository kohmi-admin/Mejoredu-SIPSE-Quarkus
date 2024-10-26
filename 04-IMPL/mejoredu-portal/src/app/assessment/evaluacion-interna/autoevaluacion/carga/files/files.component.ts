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
  styleUrls: ['../../../../styles/files.scss'],
})
export class FilesComponent extends FilesViewer implements OnInit {
  override data: FileI[] = [
    {
      id: 1,
      document: 'Anexo_Actas sesiones CE.pdf',
    },
  ];

  constructor(
    private alertService: AlertService,
    public dialogRef: MatDialogRef<FilesComponent>,
    @Inject(MAT_DIALOG_DATA) public model: any
  ) {
    super(alertService);
    this.title = model.title;
    this.data = model.files.map((f: string, i: number) => ({ id: i + 1, document: f }));
  }

  ngOnInit(): void {
    this.getAll();
  }
}
