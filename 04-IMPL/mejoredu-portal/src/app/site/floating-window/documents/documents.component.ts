import { Component, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DocumentI } from '../floating-window.component';
import { Subject, takeUntil } from 'rxjs';
import { AlfrescoService } from '@common/services/alfresco.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: [
    './documents.component.scss',
    '../floating-window.component.scss',
  ],
})
export class DocumentsComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  @Input() type: 'normatividad' | 'apoyo' = 'normatividad';
  notifier = new Subject();
  arrayFiles: any[] = [];
  dataUser: IDatosUsuario;
  isSubmitingFiles: boolean = false;
  uuidToSave: string = '';
  documents: DocumentI[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private alfrescoService: AlfrescoService,
    private alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.questions = [
      new TextboxQuestion({
        nane: 'find',
        label: 'Buscar Documento',
        validators: [],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.documents = [];
    this.getDocumentos(changes['type'].currentValue);
  }

  getDocumentos(type: 'normatividad' | 'apoyo') {
    const nameLs =
      type === 'apoyo' ? 'documentosApoyo' : 'documentosNormatividad';
    this.uuidToSave =
      type === 'apoyo'
        ? this.dataAlf.uuidDocApoyo
        : this.dataAlf.uuidNormatividad;
    const documentos = this.ls.get(nameLs);
    if (this.dataUser.idTipoUsuario !== 'ADMINISTRADOR' && documentos?.length) {
      this.documents = documentos;
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
              this.documents = value.list?.entries.map((item) => {
                let typeDocu = '';
                const arrName = item.entry.name.split('.');
                if (arrName.length) {
                  typeDocu = arrName[arrName.length - 1];
                }
                return {
                  name: item.entry.name,
                  type: typeDocu,
                  uuid: item.entry.id,
                };
              });
              this.ls.set(nameLs, this.documents);
            } else {
              this.documents = [];
            }
          },
        });
    }
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

  filterDocuments(): DocumentI[] {
    const find = this.form.get('find')?.value?.toLowerCase();
    if (find) {
      return this.documents.filter((document) =>
        document.name?.toLocaleLowerCase().includes(find)
      );
    }
    return this.documents;
  }

  click(item: any) {
    this.downloadFileAlf(item.uuid, item.name);
  }

  deleteFile(e: any, item: any) {
    e.stopPropagation();
    this.alfrescoService
      .deleteFileAlfService(item.uuid)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.alertService.showAlert('Se Eliminó Correctamente');
          this.getDocumentos(this.type);
        },
      });
  }

  async handleAddFile() {
    this.isSubmitingFiles = true;
    this.addFileRecursive();
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
      this.getDocumentos(this.type);
      this.isSubmitingFiles = false;
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
