import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { AlfrescoService } from '@common/services/alfresco.service';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { P016DataGeneralService } from '@common/services/budget/p016/data-general.service';
import { getGlobalStatus } from '@common/utils/Utils';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-consulting',
  templateUrl: './consulting.component.html',
  styleUrls: ['./consulting.component.scss'],
})
export class ConsultingComponent {
  columns = [
    { columnDef: 'program', header: 'Programa Presupuestario' },
    { columnDef: 'registerDate', header: 'Fecha de Registro' },
    { columnDef: 'updateDate', header: 'Fecha de Actualización' },
    { columnDef: 'ppAprovate', header: 'PP Aprobados' },
    { columnDef: 'aprovDate', header: 'Fecha de Aprobación' },
    {
      columnDef: 'estatusFull',
      header: 'Estatus',
      width: '230px',
      alignRight: true,
    },
  ];
  ls = new SecureLS({ encodingType: 'aes' });
  yearNav: string;
  dataUser: IDatosUsuario;
  notifier = new Subject();

  data: any[] = [];
  actions: TableActionsI = {
    view: true,
    custom: [
      {
        id: 'download',
        icon: 'download',
        name: 'Descargar Programa Presupuestario',
      },
    ],
  };

  constructor(
    private _router: Router,
    private p016DataGeneralService: P016DataGeneralService,
    private ppConsultasService: PPConsultasService,
    private alfrescoService: AlfrescoService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getAll();
  }

  getAll() {
    this.data = [];
    this.ppConsultasService
      .getConsultaPorAnhio(this.yearNav, true)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          const tmpData: any[] = [];
          for (const item of value.respuesta) {
            const fechaRegistro = new Date(item.fechaRegistro);
            const fechaActualizacion = new Date(item.fechaActualizacion);
            const fechaAprobacion = new Date(item.fechaAprobacion);
            tmpData.push({
              ...item,
              program: item.clave,
              registerDate: `${fechaRegistro
                .getDate()
                .toString()
                .padStart(2, '0')}/${(fechaRegistro.getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}/${fechaRegistro.getFullYear()}`,
              updateDate: `${fechaActualizacion
                .getDate()
                .toString()
                .padStart(2, '0')}/${(fechaActualizacion.getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}/${fechaActualizacion.getFullYear()}`,
              ppAprovate: item.aprobado ? 'SI ' : 'NO',
              aprovDate: item.fechaAprobacion
                ? `${fechaAprobacion.getDate().toString().padStart(2, '0')}/${(
                  fechaAprobacion.getMonth() + 1
                )
                  .toString()
                  .padStart(2, '0')}/${fechaAprobacion.getFullYear()}`
                : '',
              estatusFull: getGlobalStatus(
                item.estatusGeneral,
                this.dataUser.idTipoUsuario
              ),
            });
          }
          this.data = tmpData;
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._router.navigate([
          `/Planeación/Programas Presupuestarios/Consulta/${event.value.program}`,
        ]);
        break;
      case 'Validar':
        this._router.navigate([
          `/Planeación/Programas Presupuestarios/Validación/${event.value.program}`,
        ]);
        break;
      case 'download':
        this.downloadFiles(event.value.idProgramaPresupuestal);
        break;
    }
  }

  downloadFiles(idProgramaPresupuestal: number) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid: 'e33eeb58-7525-47a0-b811-2be1c879b8d5',
      fileName: 'aasasass',
    });
    this.p016DataGeneralService
      .getPPPorId(idProgramaPresupuestal)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta.archivos?.length) {
            const listUuds: string[] = value.respuesta.archivos.map(
              (item) => item.cxUuid
            );
            this.alfrescoService.downloadMultipleFilesAlfService(listUuds);
          }
        },
      });
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
