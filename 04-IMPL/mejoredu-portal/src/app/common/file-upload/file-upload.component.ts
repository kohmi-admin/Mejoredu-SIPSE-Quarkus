import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { AlfrescoService } from '@common/services/alfresco.service';
import { downloadInputFile } from '@common/utils/Utils';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() files: File[] = [];
  @Input() id?: string;
  @Input() accept?: string;
  @Input() disableInput: boolean = false;
  @Input() multiple = false;
  @Input() showUploadedFiles = true;
  @Input() dragCompact = false;
  @Output() onOutputFile = new EventEmitter<any[]>();
  @Output() onDownloadFile = new EventEmitter<any>();
  isDragOver = false;

  constructor(private alfrescoService: AlfrescoService) { }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (!this.multiple) {
      this.files.splice(0);
    }

    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      for (let i = 0; i < droppedFiles.length; i++) {
        this.files.push(droppedFiles[i]);
      }
    }
  }

  remove(index: number) {
    if (!this.disableInput) {
      let inpFile: any = document.getElementById(
        this.id ? this.id : 'fileInput'
      );
      inpFile.value = '';
      this.files.splice(index, 1);
    }
  }

  openFileSelector() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    if (!this.multiple) {
      this.files.splice(0);
    }
    const selectedFiles: FileList = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.files.push(selectedFiles[i]);
    }
    this.onOutputFile.emit(this.files);
  }

  downloadFile() {
    if (this.onDownloadFile) this.onDownloadFile.emit(this.files);
    if (this.files.length) {
      const file: any = this.files[0];
      if (file.cxUuid) {
        this.alfrescoService.viewOrDownloadFileAlfService({
          action: 'download',
          uid: file.cxUuid,
          fileName: file.cxNombre,
        });
      } else {
        downloadInputFile(file);
      }
    }
  }
}
