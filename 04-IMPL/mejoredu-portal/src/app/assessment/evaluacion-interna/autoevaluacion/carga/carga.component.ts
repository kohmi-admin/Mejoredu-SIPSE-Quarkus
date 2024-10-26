import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { FilesComponent } from './files/files.component';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { EvidenciaService } from '@common/services/evaluacion/interna/evidencia.service';
import { getCanEdit, getFileType } from '@common/utils/Utils';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { AlfrescoService } from '@common/services/alfresco.service';
import { IEvidenciaPayload } from '@common/interfaces/evaluacion/interna/evidencia.interface';
import * as moment from 'moment';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss'],
})
export class CargaComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  yearNav: string;
  dataAlf: ISeguridadAlfResponse;
  catPeriodo: IItemCatalogoResponse[] = [];
  loading = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  data: any[] = [];
  dataAction: any;
  dataTableOriginal = [
    {
      idApartado: 1,
      column1: [
        '1. Integración y funcionamiento de los órganos colegiados de Mejoredu',
      ],
      column2: [
        '1.1 Junta Directiva',
        '1.2 Consejo Técnico de Educación',
        '1.3 Consejo Ciudadano',
        '1.4 CSNMCE',
      ],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 2,
      column1: ['2. Integración y funcionamiento del COCODI'],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 3,
      column1: ['3. Situación operativa y financiera'],
      column2: [
        '3.1 Situación operativa',
        '3.1.1 Avance cuantitativo',
        '3.1.2 Avance cualitativo',
        '3.2 Situación financiera',
      ],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 4,
      column1: ['4. Integración de ingresos y egresos'],
      column2: ['4.1 Ingresos', '4.2 Egresos'],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 5,
      column1: ['5. Sistema de Evaluación del Desempeño'],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 6,
      column1: ['6. Asuntos relevantes de la gestión'],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 7,
      column1: [
        '7. Cumplimiento de planes, programas, políticas generales, sectoriales e institucionales, legislación y normativa',
      ],
      column2: [
        '7.1 Planes, Programas y Estrategias',
        '7.1.1 ND 2019-2024',
        '7.1.2 PI 2020-2024',
        '7.1.3 Programas presupuestarios',
        '7.1.4 PNCCIMGP 2019-2024',
        '7.1.5 Estrategia Digital Nacional',
        '7.2 Legislación',
        '7.2.1 Ley Federal de Austeridad Republicana',
        '7.2.2 Ley General de Transparencia y Acceso a la Información Pública y Ley Federal de Transparencia y Acceso a la Información Pública',
        '7.2.3 Ley de Adquisiciones, Arrendamientos y Servicios del Sector Público',
        '7.2.4 Ley de Obras Públicas y Servicios Relacionados con las Mismas',
        '7.2.5 Ley General de Archivos',
        '7.2.6 Ley del Servicio Profesional de Carrera en la APF o su similar establecido por la institución',
        '7.3 Políticas Generales y Normativa',
        '7.3.1 CNDH',
        '7.3.2 Comité de Ética',
        '7.3.3 Normativa Interna',
        '7.3.4 Estructura orgánica y ocupacional',
        '7.3.5 Programa de Trabajo de Control Interno y Administración de Riesgos',
        '7.3.6 Sistema de ciudadanos alertadores internos y externos de la corrupción',
        '7.3.7 Administración de recursos humanos',
      ],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 8,
      column1: ['8. Instancias fiscalizadoras'],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 9,
      column1: ['9. Convenios de colaboración'],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 10,
      column1: ['10. Fideicomisos y fondos públicos no paraestatales'],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 11,
      column1: ['11. Derechos de propiedad intelectual'],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 12,
      column1: ['12. Donaciones y desincorporaciones'],
      column2: [
        '12.1 Donaciones en especie y en efectivo',
        '12.2 Desincorporaciones',
      ],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
    {
      idApartado: 13,
      column1: [
        '13. Aspectos relevantes no contemplados en los numerales anteriores',
      ],
      column2: [],
      filesSaved: [],
      filesToSave: [],
      idEvidencia: null,
    },
  ];
  dataTable: {
    idApartado: number;
    column1: string[];
    column2: string[];
    filesSaved: any[];
    filesToSave: any[];
    idEvidencia: number | null;
  }[] = JSON.parse(JSON.stringify(this.dataTableOriginal));
  columnsTableInternal: TableColumn[] = [
    {
      columnDef: 'Unidad Administrativa/Dirección General',
      header: 'Unidad Administrativa/Dirección General',
    },
    { columnDef: 'Nombre de Usuario', header: 'Nombre de Usuario' },
    {
      columnDef: 'Hora y Fecha de Carga de Evidencia',
      header: 'Hora y Fecha de Carga de Evidencia',
    },
  ];
  columns: TableColumn[] = [
    {
      columnDef: 'anio',
      header: 'Año',
      width: '80px',
    },
    { columnDef: 'periodo', header: 'Período', width: '180px' },
    { columnDef: 'nombre', header: 'Nombre del Informe', alignLeft: true },
    { columnDef: 'Apartado', header: 'Apartado' },
    {
      columnDef: 'Unidad Administrativa/Dirección General',
      header: 'Unidad Administrativa/Dirección General',
    },
    { columnDef: 'Nombre de Usuario', header: 'Nombre de Usuario' },
    {
      columnDef: 'Hora y Fecha de Carga de Evidencia',
      header: 'Hora y Fecha de Carga de Evidencia',
    },
    { columnDef: 'Documentos ZIP', header: 'Documentos ZIP' },
  ];
  actions: TableActionsI = {
    delete: true,
    custom: [
      {
        id: 'Archivos',
        name: 'Archivos',
        icon: 'folder',
      },
      {
        id: 'view',
        name: 'Visualizar',
        icon: 'visibility',
      },
      {
        id: 'edit',
        name: 'Editar',
        icon: 'edit',
      },
    ],
  };
  notifier = new Subject();
  onlyView = false;
  canEdit: boolean = false;
  privilegedUser: boolean = false;
  isSubmiting: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private _dialog: MatDialog,
    private catalogService: CatalogsService,
    private evidenciaService: EvidenciaService,
    private alfrescoService: AlfrescoService,
    private alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.dataAlf = this.ls.get('dataAlf');
    this.privilegedUser =
      this.dataUser.idTipoUsuario === 'ENLACE' ||
      this.dataUser.idTipoUsuario === 'ADMINISTRADOR';
    this.canEdit = this.privilegedUser;
    this.buildForm();
    this.getCatalogs();
    this.validateCanEdit(+this.yearNav);
  }

  buildForm(): void {
    const questions: any = [];

    questions.push(
      new NumberQuestion({
        nane: 'anio',
        value: this.yearNav,
        label: 'Año',
        validators: [Validators.required],
      })
    );
    questions.push(
      new DropdownQuestion({
        nane: 'periodo',
        value: '',
        label: 'Período',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.suscribesForm();
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['periodoSemestral']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataPeriodo]) => {
        this.catPeriodo = dataPeriodo.catalogo;
        this.questions[1].options = mapCatalogData({
          data: dataPeriodo,
        });
        if (dataPeriodo.catalogo.length) {
          this.form
            .get('periodo')
            ?.setValue(dataPeriodo.catalogo[0].idCatalogo);
        }
      });
  }

  suscribesForm() {
    this.form
      .get('anio')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { periodo } = this.form.getRawValue();
        if (value && periodo) {
          this.validateCanEdit(value);
          this.getEvidencias();
        }
      });
    this.form
      .get('periodo')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { anio } = this.form.getRawValue();
        if (value && anio) {
          this.validateCanEdit(anio);
          this.getEvidencias();
        }
      });
  }

  validateCanEdit(anio: number) {
    if (this.privilegedUser) {
      const newCanEdit = getCanEdit(anio);
      this.canEdit = newCanEdit;
    }
  }

  getEvidencias() {
    this.data = [];
    this.dataTable = JSON.parse(JSON.stringify(this.dataTableOriginal));
    const { anio, periodo } = this.form.getRawValue();
    this.evidenciaService
      .getEvidencias(anio, periodo)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            this.data = value.respuesta.map((item) => ({
              ...item,
              periodo: this.getNamePeriodoById(item.periodo),
            }));
            for (const item of value.respuesta) {
              const finded = this.dataTable.find(
                (itemFind) => itemFind.idApartado === item.idApartado
              );
              if (finded) {
                const tmpFiles: any = item.documentos.map((itemMap) => ({
                  ...itemMap,
                  cveUsuario: item.cveUsuario,
                  unidad: item.unidadAdministrativa,
                  fecha: moment(item.fechaRegistro).format(
                    'DD/MM/YYYY, hh:mm:ss a'
                  ),
                  idEvidencia: item.idEvidencia,
                }));
                if (!finded.idEvidencia) {
                  finded.idEvidencia =
                    item.cveUsuario === this.dataUser.cveUsuario
                      ? item.idEvidencia
                      : null;
                }
                finded.filesSaved = finded.filesSaved.concat(tmpFiles);
              }
            }
            // for (let i = 1; i < 20; i++) {
            //   this.evidenciaService.deleteEvidencia(i).subscribe(data => { })
            // }
          }
        },
        error: (err) => { },
      });
  }

  getNamePeriodoById(id: number): string {
    let returnValue = '';
    const finded = this.catPeriodo.find((item) => item.idCatalogo === id);
    if (finded) {
      returnValue = finded.cdOpcion;
    }
    return returnValue;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case 'Archivos':
        this._dialog.open(FilesComponent, {
          width: '800px',
          data: {
            title: event.value.Apartado,
            files: event.value.files,
          },
        });
        break;
      case TableConsts.actionButton.edit:
        this.onlyView = false;
        break;
      case TableConsts.actionButton.delete:
        this.onlyView = false;
        break;
    }
  }

  async submit(): Promise<void> {
    this.isSubmiting = true;
    for (const item of this.dataTable) {
      const newFilesToSave = item.filesSaved.filter(
        (itemFilter) => itemFilter.idEvidencia === item.idEvidencia
      );
      if (item.filesToSave.length) {
        try {
          await this.createEvidencia(
            item.idEvidencia,
            item.idApartado,
            newFilesToSave.concat(item.filesToSave),
            this.dataUser.cveUsuario
          );
          item.filesToSave = [];
        } catch (error) { }
      }
    }

    this.alertService.showAlert(`Se Guardó Correctamente`);
    this.getEvidencias();
    this.isSubmiting = false;
  }

  createEvidencia(
    idEvidencia: number | null,
    idApartado: number,
    filesToSave: any[],
    cveUsuario: string
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const { anio, periodo } = this.form.getRawValue();
        const tmpFilesToSave: any[] = await this.getFileToService(filesToSave);
        const dataPayload: IEvidenciaPayload = {
          idEvidencia,
          anhio: anio,
          periodo,
          idApartado: idApartado,
          cveUsuario,
          documentos: tmpFilesToSave,
        };
        this.evidenciaService
          .createEvidencia(dataPayload)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.mensaje.codigo === '200') {
                resolve(value);
              } else {
                reject(new Error(value.mensaje.mensaje));
              }
            },
            error: (err) => {
              this.alertService.showAlert(
                `Error al cargar los documentos del apartado: ${idApartado}. Intente nuevamente.`
              );
              reject(new Error(err));
            },
          });
      } catch (error: any) {
        reject(new Error(error));
      }
    });
  }

  async getFileToService(arrayFiles: any[]) {
    let file: any[] = [];
    if (arrayFiles.length) {
      for (const item of arrayFiles) {
        if (item.cxUuid) {
          file.push({
            uuid: item.cxUuid,
            idTipoDocumento: item.idTipoDocumento,
            nombre: item.cxNombre,
          });
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(this.dataAlf.uuidEvaluacion, item)
            .then((uuid) => {
              file.push({
                uuid,
                idTipoDocumento: getFileType(item.name),
                nombre: item.name,
                fechaCarga: moment().format(),
              });
            })
            .catch((err) => { });
        }
      }
    }
    return file;
  }

  async deleteFile(i: number, item: any) {
    const confirm = await this.alertService.showConfirmation({
      message: `¿Está Seguro de Eliminar el Archivo: ${item.filesSaved[i].cxNombre}?`,
    });
    if (confirm) {
      const idApartado = item.idApartado;
      const idEvidencia = item.filesSaved[i].idEvidencia;
      const cveUsuario = item.filesSaved[i].cveUsuario;
      const filesSaved = JSON.parse(JSON.stringify(item.filesSaved));
      filesSaved.splice(i, 1);

      const newFilesToSave = filesSaved.filter(
        (itemFilter) => itemFilter.idEvidencia === idEvidencia
      );
      try {
        await this.createEvidencia(
          idEvidencia,
          idApartado,
          newFilesToSave,
          cveUsuario
        );
      } catch (error) { }
      this.alertService.showAlert(`Se Eliminó Correctamente`);
      this.getEvidencias();
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  downloadFilesAlf(item: any) {
    const uuids: string[] = item.filesSaved.map((file) => file.cxUuid);
    const fileName: string = `apartado-${item.idApartado}`;
    this.alfrescoService
      .downloadMultipleFilesAlfService(uuids, fileName)
      .then(() => { });
  }

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
