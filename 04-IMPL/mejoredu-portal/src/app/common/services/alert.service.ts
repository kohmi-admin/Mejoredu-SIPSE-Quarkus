import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '@common/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '@common/confirm-dialog/confirm-dialog.component';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialog: MatDialog) { }

  showAlert(message: string, title: string = ''): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title, message },
      maxWidth: '400px',
    });
  }

  async showConfirmation({
    message,
    title = 'Confirmación',
    btnCancelText = 'NO',
    btnConfirmText = 'SÍ',
  }: {
    message: string;
    title?: string;
    btnCancelText?: string;
    btnConfirmText?: string;
  }): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message, btnCancelText, btnConfirmText },
      maxWidth: '400px',
      autoFocus: false,
    });

    return await lastValueFrom(dialogRef.afterClosed());
  }
}
