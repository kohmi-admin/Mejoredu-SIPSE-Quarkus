import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  styleUrls: [
    '../confirm-dialog/confirm-dialog.component.scss',
    './alert-dialog.component.scss',
  ],
  template: `
    <h2 id="alertTitle">{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <div id="actionSpace">
      <button mat-dialog-close id="confirmButton">Aceptar</button>
    </div>
  `,
})
export class AlertDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}
