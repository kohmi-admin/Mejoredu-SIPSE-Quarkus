import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlfrescoService } from '@common/services/alfresco.service';

@Component({
  selector: 'app-viewer-pdf',
  templateUrl: './viewer-pdf.component.html',
  styleUrls: ['./viewer-pdf.component.scss'],
})
export class ViewerPdfComponent {
  source: string = '';
  loadingAlfresco: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private alfrescoService: AlfrescoService
  ) {
    if (this.data?.source) {
      this.source = this.data?.source;
    }
    if (this.data?.sourceFromAlfresco) {
      this.getViewPdfAlfresco();
    }
  }

  onSubmit(action: string) {
    // if (this.data.autoClose !== false) {
    //   this.dialog.getDialogById(this.data.idModal)?.close("download");
    // }
    // this.dialog.getDialogById(this.data.idModal)?.
    if (action === 'download') {
      this.downloadFile();
    }
  }

  getViewPdfAlfresco() {
    this.alfrescoService
      .viewOrDownloadFileAlfService({
        action: 'viewer',
        uid: this.data?.sourceFromAlfresco,
      })
      .then((response) => {
        this.loadingAlfresco = false;
        this.source = String(response.urlFile);
      })
      .catch((err) => {
        this.loadingAlfresco = false;
      });
  }

  downloadFile() {
    if (this.data?.downloadFile?.type === 'alfresco') {
      this.alfrescoService
        .viewOrDownloadFileAlfService({
          action: 'download',
          uid: this.data?.downloadFile?.uuidFile,
          fileName: this.data?.downloadFile?.name || null,
        });
    }
  }
}
