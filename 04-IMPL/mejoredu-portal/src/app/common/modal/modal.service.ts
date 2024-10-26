import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';
import { ViewerPdfComponent } from './components/viewer-pdf/viewer-pdf.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public dialog: MatDialog) { }

  openGenericModal({
    component,
    data,
    idModal,
    props,
  }: {
    idModal: string;
    component: any;
    data: any;
    props?: object;
  }) {
    let tmpComponent = component;
    if (typeof component === 'string') {
      if (component === 'generic') {
        tmpComponent = GenericModalComponent;
      } else if (component === 'viewerPdf') {
        tmpComponent = ViewerPdfComponent;
      }
    }
    const dialogRef = this.dialog.open(tmpComponent, {
      id: idModal,
      width: component === 'viewerPdf' ? '100%' : '320px',
      height: component === 'viewerPdf' ? '100%' : 'auto',
      maxWidth: component === 'viewerPdf' ? '800px' : '100%',
      maxHeight: component === 'viewerPdf' ? '800px' : '100%',
      hasBackdrop: true,
      backdropClass: ['modal-backdrop'],
      data: {
        idModal,
        ...data,
      },
      ...props,
    });
    return dialogRef;
  }
}
