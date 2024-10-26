import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  IArchivoPayload,
  IGestionReportesPayload,
} from '@common/interfaces/reportes/gestion-reportes.interface';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlfrescoService } from '@common/services/alfresco.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { GestionReportesService } from '@common/services/reportes/gestion-reportes.service';
import { GestionArchivosService } from '@common/services/seguimiento/seguimientoMedianoPlazo/gestion-reportes.service';
import { getFileType } from '@common/utils/Utils';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-file-managment',
  templateUrl: './file-managment.component.html',
  styleUrls: ['./file-managment.component.scss'],
})
export class FileManagmentComponent implements OnDestroy, OnInit {
  @Input() uuidAlfresco!: string;
  @Input() titleLabel = 'Carga de Archivos';
  @Input() component!: 'reportes' | 'seguimientoMedianoPlazo';
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  yearNav: string;
  isSubmiting: boolean = false;
  filesArchivos: any[] = [];
  notifier = new Subject();
  arrayFiles: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'cxNombre', header: 'Nombre del Documento', alignLeft: true },
  ];
  actions: TableActionsI = {
    delete: false,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
        icon: 'download',
        color: 'primary',
      },
    ],
  };

  constructor(
    private globalFuntions: GlobalFunctionsService,
    private alfrescoService: AlfrescoService,
    private gestionReportesService: GestionReportesService,
    private gestionArchivosService: GestionArchivosService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
  }

  ngOnInit(): void {
    if (this.dataUser.idTipoUsuario === 'ADMINISTRADOR') {
      this.actions.delete = true;
    }
    this.getArchivos();
  }

  getArchivos() {
    this.filesArchivos = [];
    if (this.component === 'reportes') {
      this.gestionReportesService
        .getArchivos(this.yearNav)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200') {
              this.filesArchivos = value.respuesta;
            }
          },
        });
    }

    if (this.component === 'seguimientoMedianoPlazo') {
      this.gestionArchivosService
        .getArchivos(this.yearNav)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.codigo === '200') {
              this.filesArchivos = value.respuesta;
            }
          },
        });
    }
  }

  handleAddFile() {
    this.isSubmiting = true;
    const tmpFiles: any[] = [...this.filesArchivos];
    for (const item of this.arrayFiles) {
      tmpFiles.push({
        name: item.name,
        file: item,
      });
    }
    // this.filesArchivos = tmpFiles;
    this.arrayFiles = [];
    this.submit(tmpFiles);
  }

  async onTableActionArchivos(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.cxUuid) {
          this.downloadFileAlf(event.value?.cxUuid, event.value?.cxNombre);
        } else {
          this.globalFuntions.downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete: {
        const index = this.filesArchivos.findIndex(
          (item: any) => item.idArchivo === event.value.idArchivo
        );
        const tmpData = [...this.filesArchivos];
        tmpData.splice(index, 1);
        // this.filesArchivos = tmpData;
        this.submit(tmpData);
        break;
      }
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  async submit(tmpFiles: any[]) {
    const arrToFiles: IArchivoPayload[] = [];
    if (tmpFiles?.length > 0) {
      for (const item of tmpFiles) {
        if (item.cxUuid) {
          arrToFiles.push({
            uuid: item.cxUuid,
            fechaCarga: item.dfFechaCarga,
            idArchivo: item.idArchivo,
            idTipoDocumento: item.idTipoDocumento,
            nombre: item.cxNombre,
          });
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(this.uuidAlfresco, item.file)
            .then((uuid) => {
              arrToFiles.push({
                uuid,
                idTipoDocumento: getFileType(item.file.name),
                nombre: item.file.name,
                fechaCarga: moment().format(),
                idArchivo: 0,
              });
            })
            .catch((err) => { });
        }
      }
    }
    if (this.component === 'reportes') {
      const dataService: IGestionReportesPayload = {
        archivos: arrToFiles,
        idAnhio: +this.yearNav,
        usuario: this.dataUser.cveUsuario,
      };
      this.gestionReportesService
        .createArchivo(dataService)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.codigo === '200') {
              this.getArchivos();
              this.resetForm();
            }
          },
          error: (err) => {
            this.resetForm();
            this.isSubmiting = false;
          },
        });
    }
    if (this.component === 'seguimientoMedianoPlazo') {
      const dataService: IGestionReportesPayload = {
        archivos: arrToFiles,
        idAnhio: +this.yearNav,
        usuario: this.dataUser.cveUsuario,
      };
      this.gestionArchivosService
        .createArchivo(dataService)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.codigo === '200') {
              this.getArchivos();
              this.resetForm();
            }
          },
          error: (err) => {
            this.resetForm();
            this.isSubmiting = false;
          },
        });
    }
  }

  resetForm() {
    let inpFileFiles: any = document.getElementById('inpFileFiles');
    inpFileFiles.value = '';
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
