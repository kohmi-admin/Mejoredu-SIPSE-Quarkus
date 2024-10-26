import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DateQuestion } from '@common/form/classes/question-date.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { TabsControlService } from '../services/tabs-control.service';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import {
  IItemArchivo,
  IItemProductoProgramado,
} from '@common/interfaces/seguimiento/avances.interface';
import { Subject, forkJoin, lastValueFrom, take } from 'rxjs';
import * as moment from 'moment';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { AlfrescoService } from '@common/services/alfresco.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-avance',
  templateUrl: './avance.component.html',
  styleUrls: ['./avance.component.scss'],
})
export class AvanceComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario = this.ls.get('dUaStEaR');
  canEdit: boolean = true;
  mounths = [
    {
      name: 'Número de Productos Programados',
      items: [
        { name: 'Enero', value: 2, editable: false },
        { name: 'Febrero', value: 1, editable: false },
        { name: 'Marzo', value: 2, editable: false },
      ],
    },
    {
      name: 'Número de Productos Entregados por Mes',
      items: [
        { name: 'Enero', value: 1, editable: this.canEdit },
        { name: 'Febrero', value: 1, editable: this.canEdit },
        { name: 'Marzo', value: 2, editable: this.canEdit },
      ],
    },
  ];
  data: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'nombre', header: 'Nombre del Documento', alignLeft: true },
    { columnDef: 'fechaCarga', header: 'Fecha de Carga', width: '140px' },
  ];
  actions: TableActionsI = {
    delete: this.canEdit,
    custom: [
      {
        id: 'download',
        icon: 'download',
        name: 'Descargar',
      },
    ],
  };
  dataAlf: ISeguridadAlfResponse;
  filesArchivos: IItemArchivo[] = [];
  arrayFiles: any[] = [];
  notifier = new Subject();
  status: string = 'I';
  sectionsCompleted: number = 0;
  disableRegistroTrimestral: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _avancesService: AvancesService,
    private catalogService: CatalogsService,
    private alfrescoService: AlfrescoService,
    private globalFuntions: GlobalFunctionsService,
    private _alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.dataAlf = this.ls.get('dataAlf');
    let idUser = this.dataUser.idTipoUsuario;
    if (idUser == 'CONSULTOR' || idUser == 'PLANEACION') {
      this.canEdit = false;
    }
    const questions: any = [];

    questions.push(
      new TextboxQuestion({
        nane: 'cveProyecto',
        label: 'Clave y Nombre del Proyecto',
        readonly: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'cveActividad',
        label: 'Clave y Nombre de la Actividad',
        readonly: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'cveProducto',
        label: 'Clave y Nombre del Producto',
        value: this._tabsControlService.productName,
        readonly: true,
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'estatus',
        value: 'I',
        label: 'Estatus',
        filter: true,
        disabled: true,
        options: [
          {
            id: 'I',
            value: 'Incompleto',
          },
          {
            id: 'C',
            value: 'Completo',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'justificacion',
        label: 'Justificación',
        disabled: !this.canEdit,
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'descripcionTareas',
        label: 'Descripción de Tareas Realizadas',
        disabled: !this.canEdit,
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'descripcionProducto',
        label: 'Descripción del Producto Alcanzado',
        disabled: !this.canEdit,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'indicadorMIR',
        label: 'Indicador MIR/FID al que abona',
        value: 'Indicador MIR 1',
        readonly: true,
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'metaSuperada',
        label: 'Meta Superada (Justificar)',
        disabled: !this.canEdit || this.disableRegistroTrimestral
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'dificultad',
        label: 'Dificultades para su Realización',
        disabled: !this.canEdit || this.disableRegistroTrimestral
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'revisado',
        label: 'Revisado por la Junta Directiva',
        filter: true,
        options: [
          {
            id: true,
            value: 'Sì',
          },
          {
            id: false,
            value: 'No',
          },
        ],
        value: false,
        validators: [Validators.required],
        disabled: !this.canEdit || this.disableRegistroTrimestral
      })
    );

    questions.push(
      new DateQuestion({
        nane: 'fechaSesion',
        label: 'Fecha de Sesión',
        disabled: !this.canEdit || this.disableRegistroTrimestral,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'aprobado',
        label: 'Aprobado por la Junta Directiva',
        disabled: !this.canEdit || this.disableRegistroTrimestral,
        validators: [Validators.required],
      })
    );

    questions.push(
      new DateQuestion({
        nane: 'fechaAprobacion',
        label: 'Fecha de Aprobación',
        disabled: !this.canEdit || this.disableRegistroTrimestral,
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'publicacion',
        label: 'Publicación',
        filter: true,
        options: [
          {
            id: true,
            value: 'Sì',
          },
          {
            id: false,
            value: 'No',
          },
        ],
        value: false,
        validators: [Validators.required],
        disabled: !this.canEdit || this.disableRegistroTrimestral
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'tipoPublicacion',
        label: 'Tipo de Publicación',
        filter: true,
        disabled: !this.canEdit || this.disableRegistroTrimestral,
        options: [
          {
            id: 'DOF',
            value: 'DOF',
          },
          {
            id: 'Web MejorEdu',
            value: 'Web MejorEdu',
          },
          {
            id: 'Impreso',
            value: 'Impreso',
          },
          {
            id: 'Otro',
            value: 'Otro',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'especificarPublicacion',
        label: 'Especificar',
        disabled: !this.canEdit || this.disableRegistroTrimestral,
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'difusion',
        label: 'Difusión',
        filter: true,
        options: [
          {
            id: true,
            value: 'Sì',
          },
          {
            id: false,
            value: 'No',
          },
        ],
        value: false,
        validators: [Validators.required],
        disabled: !this.canEdit || this.disableRegistroTrimestral
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'tipoDifusion',
        label: 'Tipo de Difusión',
        filter: true,
        disabled: !this.canEdit || this.disableRegistroTrimestral,
        options: [
          {
            id: 'Web MejorEdu',
            value: 'Web MejorEdu',
          },
          {
            id: 'Redes Sociales',
            value: 'Redes Sociales',
          },
          {
            id: 'Otro',
            value: 'Otro',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'especificarDifusion',
        label: 'Especificar',
        disabled: !this.canEdit || this.disableRegistroTrimestral,
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('revisado')?.valueChanges.subscribe((value) => {
      if (value === true) {
        this.form.get('fechaSesion')?.enable();
        this.form.get('aprobado')?.enable();
        this.form.get('fechaAprobacion')?.enable();
      } else {
        this.form.get('fechaSesion')?.disable();
        this.form.get('fechaSesion')?.setValue('');
        this.form.get('aprobado')?.disable();
        this.form.get('aprobado')?.setValue('');
        this.form.get('fechaAprobacion')?.disable();
        this.form.get('fechaAprobacion')?.setValue('');
      }
    });
    this.form.get('publicacion')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('tipoPublicacion')?.enable();
      } else {
        this.form.get('tipoPublicacion')?.disable();
        this.form.get('tipoPublicacion')?.setValue('');
      }
    });
    this.form.get('tipoPublicacion')?.valueChanges.subscribe((value) => {
      if (value === 2636) {
        this.form.get('especificarPublicacion')?.enable();
      } else {
        this.form.get('especificarPublicacion')?.disable();
        this.form.get('especificarPublicacion')?.setValue('');
      }
    });
    this.form.get('difusion')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('tipoDifusion')?.enable();
      } else {
        this.form.get('tipoDifusion')?.disable();
        this.form.get('tipoDifusion')?.setValue('');
      }
    });
    this.form.get('tipoDifusion')?.valueChanges.subscribe((value) => {
      if (value === 2640) {
        this.form.get('especificarDifusion')?.enable();
      } else {
        this.form.get('especificarDifusion')?.disable();
        this.form.get('especificarDifusion')?.setValue('');
      }
    });
    this.getAll();
    this._tabsControlService.updateProgectName.subscribe((value: string) => {
      this.form.controls['cveProyecto'].setValue(value);
    });
    this._tabsControlService.updateActivityName.subscribe((value: string) => {
      this.form.controls['cveActividad'].setValue(value);
    });
    this._tabsControlService.updateProductName.subscribe((value: string) => {
      this.form.controls['cveProducto'].setValue(value);
    });
    this.getData();
  }

  async getData(): Promise<void> {
    const response = await lastValueFrom(
      this._avancesService.consultarAvance(
        this._tabsControlService.product.idProducto || 526
      )
    );
    this.form.controls['cveProyecto'].setValue(
      this._tabsControlService.project?.proyectoPAA ||
      response.respuesta.cveProyecto
    );
    this.form.controls['cveActividad'].setValue(
      this._tabsControlService.activity?.actividad ||
      response.respuesta.cveActividad
    );
    this.form.controls['cveProducto'].setValue(
      this._tabsControlService.product?.product ||
      response.respuesta.cveProducto
    );
    this.form
      .get('indicadorMIR')
      ?.setValue(this._tabsControlService.product?.indicadorMIR || '');
    this.getCatalogs();
    this.getCurrentTrim(response.respuesta.productosProgramados);
    this.consultarEvidenciaMensual();
    this.consultarEvidenciaTrimestral();
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoPublicación']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoDifusion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nombreIndicadorMIR']
      ),
    ])
      .pipe(take(1))
      .subscribe(([tipoPublicación, tipoDifusion, dataNombreIndicadorMIR]) => {
        let questionTP = this.questions.find(
          (i) => i.nane === 'tipoPublicacion'
        );
        if (questionTP) {
          questionTP.options = mapCatalogData({
            data: tipoPublicación,
          });
        }

        let questionTD = this.questions.find((i) => i.nane === 'tipoDifusion');
        if (questionTD) {
          questionTD.options = mapCatalogData({
            data: tipoDifusion,
          });
        }

        let indicador = this.questions.find((i) => i.nane === 'indicadorMIR');
        if (indicador) {
          indicador.options = mapCatalogData({
            data: dataNombreIndicadorMIR,
            withOptionNoAplica: true,
            withOptionSelect: true,
          });
        }
      });
  }
  getCurrentQuarter(productMes) {

    if (productMes < 3) {
      return 1;
    } else if (productMes < 6) {
      return 2;
    } else if (productMes < 9) {
      return 3;
    } else {
      return 4;
    }
  }

  getCurrentTrim(productoProgramado: IItemProductoProgramado[]): void {
    let productMes = this._tabsControlService.product.mes;
    let trimestreActual = moment().quarter();
    if (productMes) {
      trimestreActual = this.getCurrentQuarter(productMes);
    }
    console.log(trimestreActual);
    // Obtener los meses correspondientes al trimestre actual
    const mesesTrimestre: number[] = [];
    for (let i = 0; i < 3; i++) {
      const mes = moment()
        .quarter(trimestreActual)
        .startOf('quarter')
        .add(i, 'months')
        .format('M');
      mesesTrimestre.push(Number(mes));
    }
    let editable = false;
    this.mounths.forEach((mounth) => {
      const records = productoProgramado.filter((record) =>
        mesesTrimestre.includes(record.mes)
      );
      mounth.items = records.map((record) => {
        return {
          name: moment()
            .month(record.mes - 1)
            .format('MMMM'),
          value: !editable
            ? record.productosProgramados
            : record.productosEntregados || Number(0),
          editable: editable,
        };
      });
      editable = true;
    });
  }

  handleAddFile() {
    const tmpFiles: any[] = [...this.filesArchivos];
    tmpFiles.push({
      nombre: this.arrayFiles[0].name,
      file: this.arrayFiles[0],
    });
    this.filesArchivos = tmpFiles;
    this.arrayFiles = [];
  }

  async registrarEntregables() {
    const productosProgramados: IItemProductoProgramado[] = [];
    this.mounths.forEach((mounth, index) => {
      if (index === 0) {
        mounth.items.forEach((item) => {
          const producto: IItemProductoProgramado = {
            mes: Number(moment().month(item.name).format('M')),
            productosProgramados: item.value,
            productosEntregados: 0,
          };
          productosProgramados.push(producto);
        });
      } else {
        mounth.items.forEach((item) => {
          const producto = productosProgramados.find(
            (p) => p.mes === Number(moment().month(item.name).format('M'))
          );
          if (producto) {
            producto.productosEntregados = Number(item.value);
          }
        });
      }
    });
    await lastValueFrom(
      this._avancesService.registrarEntregables({
        idProducto: this._tabsControlService.product.idProducto,
        cveProyecto: this.form.get('cveProyecto')?.value,
        cveActividad: this.form.get('cveActividad')?.value,
        cveProducto: this.form.get('cveProducto')?.value,
        productosProgramados: productosProgramados,
      })
    );
  }

  async consultarEvidenciaMensual() {
    const response = await lastValueFrom(
      this._avancesService.consultarEvidenciaMensual(
        this._tabsControlService.product.idProducto,
        moment().month() + 1
      )
    );
    this.form.get('estatus')?.setValue(response.respuesta.estatus);
    this.form.get('justificacion')?.setValue(response.respuesta.justificacion);
    this.form
      .get('descripcionTareas')
      ?.setValue(response.respuesta.descripcionTareas);
    this.form
      .get('descripcionProducto')
      ?.setValue(response.respuesta.descripcionProducto);
    this.filesArchivos = response.respuesta.archivos.map((a) => {
      a.fechaCarga = moment(a.fechaCarga).format('YYYY-MM-DD');
      return a;
    });
  }

  async registrarEvidenciaMensual() {
    const arrToFiles: IItemArchivo[] = [];
    if (this.filesArchivos?.length > 0) {
      for (const item of this.filesArchivos) {
        if (item.idArchivo) {
          arrToFiles.push(item);
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(
              this.dataAlf.uuidSeguimiento,
              item.file
            )
            .then((uuid) => {
              arrToFiles.push({
                uuid,
                nombre: item.file.name,
              });
            });
        }
      }
    }
    await lastValueFrom(
      this._avancesService.registroEvidenciaMensual(this.dataUser.cveUsuario, {
        estatus: this.form.get('estatus')?.value,
        justificacion: this.form.get('justificacion')?.value,
        descripcionTareas: this.form.get('descripcionTareas')?.value,
        descripcionProducto: this.form.get('descripcionProducto')?.value,
        archivos: arrToFiles,
        idProducto: this._tabsControlService.product.idProducto,
        mes: moment().month() + 1,
      })
    );
  }

  async registrarEvidenciaTrimestral() {
    await lastValueFrom(
      this._avancesService.registroEvidenciaTrimestral(
        this.dataUser.cveUsuario,
        {
          idProducto: this._tabsControlService.product.idProducto,
          trimestre: moment().quarter(),
          indicadorMIR: this.form.get('indicadorMIR')?.value,
          metaSuperada: this.form.get('metaSuperada')?.value,
          dificultad: this.form.get('dificultad')?.value,
          revisado: this.form.get('revisado')?.value,
          fechaSesion: this.form.get('fechaSesion')?.value,
          aprobado: this.form.get('aprobado')?.value,
          fechaAprobacion: this.form.get('fechaAprobacion')?.value,
          publicacion: this.form.get('publicacion')?.value,
          tipoPublicacion: this.form.get('tipoPublicacion')?.value,
          especificarPublicacion: this.form.get('especificarPublicacion')
            ?.value,
          difusion: this.form.get('difusion')?.value,
          tipoDifusion: this.form.get('tipoDifusion')?.value,
          especificarDifusion: this.form.get('especificarDifusion')?.value,
        }
      )
    );
  }

  async consultarEvidenciaTrimestral() {
    const response = await lastValueFrom(
      this._avancesService.consultarEvidenciaTrimestral(
        this._tabsControlService.product.idProducto,
        moment().quarter()
      )
    );
    this.form.get('indicadorMIR')?.setValue(response.respuesta.indicadorMIR);
    this.form.get('metaSuperada')?.setValue(response.respuesta.metaSuperada);
    this.form.get('dificultad')?.setValue(response.respuesta.dificultad);
    this.form.get('revisado')?.setValue(response.respuesta.revisado);
    this.form.get('fechaSesion')?.setValue(response.respuesta.fechaSesion);
    this.form.get('aprobado')?.setValue(response.respuesta.aprobado);
    this.form
      .get('fechaAprobacion')
      ?.setValue(response.respuesta.fechaAprobacion);
    this.form.get('publicacion')?.setValue(response.respuesta.publicacion);
    this.form
      .get('tipoPublicacion')
      ?.setValue(response.respuesta.tipoPublicacion);
    this.form
      .get('especificarPublicacion')
      ?.setValue(response.respuesta.especificarPublicacion);
    this.form.get('difusion')?.setValue(response.respuesta.difusion);
    this.form.get('tipoDifusion')?.setValue(response.respuesta.tipoDifusion);
    this.form
      .get('especificarDifusion')
      ?.setValue(response.respuesta.especificarDifusion);
    this.form
      .get('indicadorMIR')
      ?.setValue(this._tabsControlService.product.indicadorMIR);
  }

  async getAll(): Promise<void> {
    this.data = [
      {
        document: 'Documento 1',
        date: '18/12/2023',
      },
    ];
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.uuid) {
          this.downloadFileAlf(event.value?.uuid, event.value?.nombre);
        } else {
          this.globalFuntions.downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete:
        {
          const index = this.filesArchivos.findIndex(
            (item: IItemArchivo) => item.idArchivo === event.value.idArchivo
          );
          const tmpData = [...this.filesArchivos];
          tmpData.splice(index, 1);
          this.filesArchivos = tmpData;
        }
        break;
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  async submit(): Promise<void> {
    await Promise.all([
      this.registrarEntregables(),
      this.registrarEvidenciaMensual(),
      this.registrarEvidenciaTrimestral(),
    ]);
    this._alertService.showAlert('Se guardó correctamente.');
  }

  private enableRegistroTrim() {
    const currentMonth = new Date().getMonth();
    if (currentMonth == 1 || currentMonth == 4 || currentMonth == 7 || currentMonth == 10) {
      this.disableRegistroTrimestral = false;
    }
  }
}
