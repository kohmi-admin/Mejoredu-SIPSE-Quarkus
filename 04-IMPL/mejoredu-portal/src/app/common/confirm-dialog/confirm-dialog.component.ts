import { Component, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  styleUrls: ['./confirm-dialog.component.scss'],
  template: `
    <h2 id="alertTitle">{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <div id="actionSpace">
      <button [mat-dialog-close]="false" id="cancelButton">
        {{ data.btnCancelText }}
      </button>
      <button [mat-dialog-close]="true" id="confirmButton">
        {{ data.btnConfirmText }}
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      btnCancelText: string;
      btnConfirmText: string;
    }
  ) { }

  ngAfterViewInit() {
    // Establecer el enfoque automático en el botón de confirmar después de un breve retraso
    setTimeout(() => {
      const confirmButton = document.getElementById('confirmButton');
      if (confirmButton) {
        confirmButton.focus();
      }
    }, 100);
  }
}
