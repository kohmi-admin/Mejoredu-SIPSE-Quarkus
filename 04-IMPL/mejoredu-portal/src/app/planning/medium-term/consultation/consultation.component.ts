import { Component } from '@angular/core';
import { IArrFilesResponse } from '@common/interfaces/epilogo.interface';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { AlfrescoService } from '@common/services/alfresco.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import * as SecureLS from 'secure-ls';
import { takeUntil, Subject } from 'rxjs';
import { IGestorResponse } from '@common/interfaces/medium-term/principal.interface';
import { EpilogoPiActasService } from '@common/services/epilogoPiActas.service';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
})
export class ConsultationComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  yearNav: string;
  filesActas: IArrFilesResponse[] | any[] = [];
  filesArchivosPi: IArrFilesResponse[] | any[] = [];
  gestorSelected: null | IGestorResponse = null;

  constructor(
    private alfrescoService: AlfrescoService,
    private globalFuntions: GlobalFunctionsService,
    private principalService: PrincipalService,
    private epilogoService: EpilogoPiActasService
  ) {
    this.yearNav = this.ls.get('yearNav');
    this.getGestorPorAnhio();
  }

  getGestorPorAnhio() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.gestorSelected = value.respuesta;
            this.getEpilogoByIdEstructura();
          }
        },
        error: (error) => { },
      });
  }

  getEpilogoByIdEstructura() {
    this.filesArchivosPi = [];
    this.filesActas = [];
    this.epilogoService
      .getEpilogoPorIdEstructura(String(this.gestorSelected?.idPrograma))
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          const tmpFilesPi: any[] = [];
          for (const item of value.respuesta.archivosPI) {
            tmpFilesPi.push({
              ...item,
              name: item.archivo.cxNombre,
              year: this.yearNav,
              date: `${item.archivo.dfFechaCarga} ${item.archivo.dfHoraCarga}`,
            });
          }
          const tmpFilesActas: any[] = [];
          for (const item of value.respuesta.actas) {
            tmpFilesActas.push({
              ...item,
              name: item.archivo.cxNombre,
              year: this.yearNav,
              date: `${item.archivo.dfFechaCarga} ${item.archivo.dfHoraCarga}`,
            });
          }
          this.filesArchivosPi = tmpFilesPi;
          this.filesActas = tmpFilesActas;
        },
        error(err) { },
      });
  }

  async onTableActionArchivosPi(event: TableButtonAction) {
    if (event.name === 'download') {
      if (event.value?.archivo?.cxUuid) {
        this.downloadFileAlf(
          event.value?.archivo?.cxUuid,
          event.value?.archivo?.cxNombre
        );
      } else {
        this.globalFuntions.downloadInputFile(event.value.file);
      }
    }
  }

  async onTableActionActas(event: TableButtonAction) {
    if (event.name === 'download') {
      if (event.value?.archivo?.cxUuid) {
        this.downloadFileAlf(
          event.value?.archivo?.cxUuid,
          event.value?.archivo?.cxNombre
        );
      } else {
        this.globalFuntions.downloadInputFile(event.value.file);
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

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
