import { Component } from '@angular/core';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import * as SecureLS from 'secure-ls';
import { TableColumn } from '@common/models/tableColumn';
import { ExcelXlsxService } from '@common/services/excel-xlsx.service';
import { ProjectsService } from '@common/services/projects.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '@common/modal/modal.service';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { AlertService } from '@common/services/alert.service';
import { Router } from '@angular/router';
import { getCveProyecto, getGlobalStatus } from '@common/utils/Utils';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent {
  ls = new SecureLS({ encodingType: 'aes' });

  data: any[] = [];
  columns: TableColumn[] = [
    {
      columnDef: 'claveNombreUnidad',
      header: 'Clave y Nombre de la Unidad',
      alignLeft: true,
    },
    {
      columnDef: 'claveProyecto',
      header: 'Clave del Proyecto',
      width: '170px',
    },
    { columnDef: 'nombre', header: 'Nombre del Proyecto', alignLeft: true },
  ];
  actions = {
    edit: true,
    delete: true,
    view: true,
  };
  loading = true;
  isUploadFile = false;
  notifier = new Subject();
  dataUser: IDatosUsuario;
  arrayFilesExcel: any[] = [];
  yearNav: string;
  configOrderSheets = ['Proyectos', 'Actividades', 'Productos'];
  configRequiredColumns = {
    Proyectos: [
      'cx_nombre_proyecto',
      'cx_objetivo',
      'id_anhio',
      'cx_alcance',
      'cx_fundamentacion',
      'cve_unidad',
    ],
    Actividades: [
      'cve_actividad',
      'cx_nombre_actividad',
      'cx_descripcion',
      'cx_articulacion_actividad',
    ],
    Productos: [
      'cx_vinculacion_producto',
      'cve_actividad',
      'id_catalogo_tipo_producto',
      'id_catalogo_nivel_educativo',
    ],
  };

  constructor(
    private excelXlsxService: ExcelXlsxService,
    private projectsService: ProjectsService,
    private modalService: ModalService,
    private _alertService: AlertService,
    private _router: Router
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.getProjects();
  }

  getProjects() {
    this.projectsService
      .getProjectByAnnioCarga(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          const tmpData: any[] = [];
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.data = value.proyecto
              .filter((item) => item.estatus !== 'B')
              .map((item) => ({
                ...item,
                claveNombreUnidad: `${item.claveUnidad} ${item.nombreUnidad}`,
                claveProyecto: getCveProyecto({
                  cveProyecto: +item.clave,
                  cveUnidad: item.claveUnidad,
                  yearNav: this.yearNav,
                }),
                estatusFull: getGlobalStatus(item.estatus),
              }));
          }
        },
        error: () => { },
      });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemProjectsResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
      case TableConsts.actionButton.edit:
        // REVIEW: redirect to view page
        this.ls.set('selectedUploadMasiveProyectoPAA', event);
        this._router.navigate([
          '/Planeación/Planeación a Corto Plazo/Formulación/Registro de Proyectos',
        ]);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation(
            { message: '¿Está Seguro de Eliminar el Proyecto?' });
          if (confirm) {
            this.projectsService
              .deleteProject({
                id: dataAction.idProyecto,
                usuario: this.dataUser.cveUsuario,
              })
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this.modalService.openGenericModal({
                      idModal: 'modal-disabled',
                      component: 'generic',
                      data: {
                        text: 'Se eliminó correctamente.',
                        labelBtnPrimary: 'Aceptar',
                      },
                    });
                    this.getProjects();
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  addProject() {
    this.isUploadFile = true;
    const file = this.arrayFilesExcel[0];
    this.excelXlsxService
      .excelToJson(file)
      .then((response) => {
        // COMMENT: Se valida que el excel contenga las 3 hojas obligatorias
        if (response.sheetNames.length !== 3) {
          this.isUploadFile = false;
          this.openModalExcelNoValido({
            text: `No se encontraron todas las hojas requeridas. Debe de contener las siguientes: ${this.configOrderSheets.join(
              ', '
            )}`,
          });
        } else {
          // COMMENT: Se valida el orden de las hojas
          let tmpFlagSheets = true;
          for (let i = 0; i < response.sheetNames.length; i++) {
            if (
              tmpFlagSheets &&
              response.sheetNames[i] !== this.configOrderSheets[i]
            ) {
              tmpFlagSheets = false;
            }
          }

          if (!tmpFlagSheets) {
            this.isUploadFile = false;
            this.openModalExcelNoValido({
              text: `El orden de las hojas no es correcto. Debe cumplir con el siguiente orden: ${this.configOrderSheets.join(
                ', '
              )}.`,
            });
          } else if (response.data.Proyectos.length !== 1) {
            // COMMENT: Se valida que solo exista 1 proyecto
            this.isUploadFile = false;
            if (response.data.Proyectos.length === 0) {
              this.openModalExcelNoValido({
                text: `No se encontró ningún proyecto.`,
              });
            }
            if (response.data.Proyectos.length > 1) {
              this.openModalExcelNoValido({
                text: `Solo se acepta un proyecto por archivo.`,
              });
            }
          } else {
            // COMMENT: Se valida que todas las filas cumplan con las columnas requeridas
            const tmpValidations: any[] = [];
            for (const sheetName of response.sheetNames) {
              const dataSheet: any[] = response.data[sheetName];
              const configSheet = this.configRequiredColumns[sheetName];
              let tmpFlagGlobal = true;
              for (const key in dataSheet) {
                let tmpFlag = true;
                for (const column of configSheet) {
                  if (tmpFlag && !Object.hasOwn(dataSheet[key], column)) {
                    tmpFlag = false;
                  }
                }
                if (tmpFlagGlobal && !tmpFlag) {
                  tmpFlagGlobal = false;
                }
              }
              if (!tmpFlagGlobal) {
                tmpValidations.push(
                  `La hoja de: ${sheetName} no cumple con las columnas requeridas: ${this.configRequiredColumns[
                    sheetName
                  ].join(', ')}.`
                );
              }
            }
            if (tmpValidations.length > 0) {
              this.isUploadFile = false;
              this.openModalExcelNoValido({
                listText: tmpValidations,
              });
            } else {
              this.projectsService
                .uploadExcel(this.dataUser.cveUsuario, file)
                .pipe(takeUntil(this.notifier))
                .subscribe({
                  next: (value) => {
                    this.isUploadFile = false;
                    if (value.mensaje.codigo === '200') {
                      this.getProjects();
                      this.arrayFilesExcel = [];
                      let inpFile: any =
                        document.getElementById('inpFileExcel');
                      inpFile.value = '';
                      this.modalService.openGenericModal({
                        idModal: 'modal-disabled',
                        component: 'generic',
                        data: {
                          text: 'Se guardó correctamente.',
                          labelBtnPrimary: 'Aceptar',
                        },
                      });
                    }
                  },
                  error: (err) => {
                    this.isUploadFile = false;
                  },
                });
            }
          }
        }
      })
      .catch((error) => { });
  }

  openModalExcelNoValido({
    text,
    listText,
  }: {
    text?: string;
    listText?: string[];
  }) {
    this.modalService.openGenericModal({
      idModal: 'modal-disabled',
      component: 'generic',
      data: {
        title: 'Formato de excel no válido',
        text,
        listText,
        link: {
          text: 'Descarga el formato ',
          linkText: 'aquí',
          isAlfresco: false,
          sourceFile: 'assets/formatos/formatoCargaMasivaProyectosPAA.xlsx',
          fileName: 'formatoCargaMasivaProyectosPAA.xlsx',
        },
        labelBtnPrimary: 'Aceptar',
      },
    });
  }

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
