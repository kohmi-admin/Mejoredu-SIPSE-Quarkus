import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private _verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) {}

  showMessage(message: string, action: string = 'Cerrar') {
    this._snackBar.open(message, action, {
      panelClass: ['custom-snackbar'],
      horizontalPosition: this._horizontalPosition,
      verticalPosition: this._verticalPosition,
      duration: 4000,
    });
  }
}
