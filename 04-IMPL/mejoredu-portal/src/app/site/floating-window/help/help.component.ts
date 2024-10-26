import { Component } from '@angular/core';
import { FaqI } from '../interfaces/faq.interface';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import * as SecureLS from 'secure-ls';
import { Subject, takeUntil } from 'rxjs';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { AlfrescoService } from '@common/services/alfresco.service';
import { AlertService } from '@common/services/alert.service';
import { DocumentI } from '../floating-window.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss', '../floating-window.component.scss'],
})
export class HelpComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
  notifier = new Subject();
  arrayFiles: any[] = [];
  dataUser: IDatosUsuario;
  isSubmitingFiles: boolean = false;
  uuidToSave: string = '';
  faq: FaqI[] = [];
  documents: DocumentI[] = [];
  documentUserManual: any = null;
  fileNameHelp = 'Preguntas de Ayuda.xlsx';
  fileNameManual = 'Manual de Usuario';

  constructor(
    private alfrescoService: AlfrescoService,
    private alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.uuidToSave = this.dataAlf.uuidAyuda;
    this.getDocumentos();
  }

  getDocumentos() {
    const documentoPreguntas = this.ls.get('documentoPreguntas');
    const documentoManual = this.ls.get('documentoManual');

    if (
      this.dataUser.idTipoUsuario !== 'ADMINISTRADOR' &&
      (documentoPreguntas || documentoManual)
    ) {
      if (documentoPreguntas) this.faq = documentoPreguntas;
      if (documentoManual) this.documentUserManual = documentoManual;
    } else {
      this.alfrescoService
        .getFilesAlfService({
          skipCount: '0',
          maxItems: '100',
          uidContenedor: this.uuidToSave,
        })
        .subscribe({
          next: (value) => {
            if (value.list?.entries?.length) {
              this.uploadDataToFaq(value.list?.entries);
              this.getFileUserManual(value.list?.entries);
              this.documents = value.list?.entries.map((item) => {
                let type = '';
                const arrName = item.entry.name.split('.');
                if (arrName.length) {
                  type = arrName[arrName.length - 1];
                }
                return {
                  name: item.entry.name,
                  type,
                  uuid: item.entry.id,
                };
              });
            } else {
              this.documents = [];
              this.faq = [];
              this.documentUserManual = null;
            }
          },
        });
    }
  }

  getFileUserManual(list: any[]) {
    const filePdf = list.find((itemFilter) =>
      itemFilter.entry.name.includes(this.fileNameManual)
    );
    if (filePdf) {
      let typeDocu = '';
      const arrName = filePdf.entry.name.split('.');
      if (arrName.length) {
        typeDocu = arrName[arrName.length - 1];
      }

      this.documentUserManual = {
        name: filePdf.entry.name,
        uuid: filePdf.entry.id,
        type: typeDocu,
      };
      this.ls.set('documentoManual', this.documentUserManual);
    } else {
      this.documentUserManual = null;
    }
  }

  uploadDataToFaq(list: any[]) {
    const fileExcel = list.find(
      (itemFilter) => itemFilter.entry.name === this.fileNameHelp
    );

    if (fileExcel) {
      const uidExcel = fileExcel.entry.id;
      this.alfrescoService
        .viewOrDownloadFileAlfService({
          action: 'viewer',
          uid: uidExcel,
          fileName: this.fileNameHelp,
          withB64: true,
        })
        .then((response) => {
          const b64Clean = response.b64?.split('base64,')[1];
          const wb = XLSX.read(b64Clean, { type: 'base64' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data: any = XLSX.utils.sheet_to_json(ws);

          const tmp: any[] = [];
          for (const item of data) {
            const newObject = {
              question: '',
              answer: '',
            };
            Object.entries(item).map((itemMap: any, idxMap) => {
              if (idxMap === 0) {
                newObject.question = itemMap[1] ?? itemMap[0];
              }
              if (idxMap === 1) {
                newObject.answer = itemMap[1] ?? itemMap[0];
              }
            });

            tmp.push(newObject);
          }
          this.faq = tmp;
          this.ls.set('documentoPreguntas', this.faq);
        });
    } else {
      this.faq = [];
    }
  }

  click(item: any) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid: item.uuid,
      fileName: item.name,
    });
  }

  toggleFaq(index: number) {
    this.faq[index].open = !this.faq[index].open;
    this.faq.forEach((faq, i) => {
      if (i !== index) {
        faq.open = false;
      }
    });
  }

  deleteFile(e: any, item: any) {
    e.stopPropagation();
    this.alfrescoService
      .deleteFileAlfService(item.uuid)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.alertService.showAlert('Se Eliminó Correctamente');
          this.getDocumentos();
        },
      });
  }

  async handleAddFile() {
    const tmpFiles: any[] = [];
    for (const item of this.arrayFiles) {
      if (
        tmpFiles.length < 2 &&
        (item.name === this.fileNameHelp ||
          item.name.includes(this.fileNameManual))
      ) {
        tmpFiles.push(item);
      }
    }
    this.arrayFiles = tmpFiles;
    if (this.arrayFiles.length) {
      this.isSubmitingFiles = true;
      this.addFileRecursive();
    }
  }

  btnHelp() {
    this.alertService.showAlert(
      `Solo se puede cargar 2 archivos. Preguntas y respuestas: con nombre "${this.fileNameHelp}" y en formato Excel. Manual de usuario: con nombre "${this.fileNameManual}" y en formato Word, Excel o PowerPoint`
    );
  }

  addFileRecursive() {
    if (this.arrayFiles.length > 0) {
      this.alfrescoService
        .uploadFileToAlfrescoPromise(this.uuidToSave, this.arrayFiles[0])
        .then((uuid) => {
          this.arrayFiles.splice(0, 1);
          this.addFileRecursive();
        })
        .catch((err) => { });
    } else {
      this.alertService.showAlert('Se Guardó Correctamente');
      this.getDocumentos();
      this.isSubmitingFiles = false;
    }
  }

  downloadUserManual() {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid: this.documentUserManual.uuid,
      fileName: this.documentUserManual.name,
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'docx':
        return 'word';
      case 'xlsx':
        return 'excel';
      case 'pptx':
        return 'powerpoint';
      default:
        return 'pdf';
    }
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
