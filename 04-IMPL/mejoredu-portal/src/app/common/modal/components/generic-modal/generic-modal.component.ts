import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlfrescoService } from '@common/services/alfresco.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss'],
})
export class GenericModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private globalFunctionsService: GlobalFunctionsService,
    private alfrescoService: AlfrescoService
  ) { }

  onSubmit() {
    if (this.data.autoClose !== false) {
      this.dialog.getDialogById(this.data.idModal)?.close('submit');
    }
  }

  downloadFile() {
    if (this.data.link.isAlfresco) {
      this.alfrescoService.viewOrDownloadFileAlfService({
        action: 'download',
        uid: this.data.link.uid,
        fileName: this.data.link.fileName ?? '',
      });
    } else {
      fetch(this.data.link.sourceFile)
        .then((response) => response.blob())
        .then(async (blob: Blob) => {
          this.globalFunctionsService.downloadBlob(
            blob,
            this.data.link.fileName ?? ''
          );
        });
    }
  }
}
