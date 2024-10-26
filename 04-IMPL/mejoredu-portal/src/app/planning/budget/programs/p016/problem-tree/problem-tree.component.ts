import { Component, ViewChild } from '@angular/core';
import { ListI } from '../board/interfaces/list.interface';
import { TypeCardEnum } from '../board/enums/type.enum';
import { BoardService } from '../board/services/board.service';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { StateViewService } from '../../../services/state-view.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { BoardComponent } from '../board/board.component';
import { P016ProblemTreeService } from '@common/services/budget/p016/problem-tree.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import {
  IEsquemaResponse,
  IItemP016ProblemTreeRespuesta,
  IP016ProblemTreePayload,
} from '@common/interfaces/budget/p016/problem-tree.interface';
import { ModalService } from '@common/modal/modal.service';
import { P016DiagnosticService } from '@common/services/budget/p016/diagnostic.service';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { IItemConsultaResponse } from '@common/interfaces/budget/consultas.interface';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { AlfrescoService } from '@common/services/alfresco.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { DOCUMENT_TYPES } from '@common/enums/documentTypes.enum';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-problem-tree',
  templateUrl: './problem-tree.component.html',
  styleUrls: ['./problem-tree.component.scss'],
})
export class ProblemTreeComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  @ViewChild(BoardComponent) board: BoardComponent | undefined;

  notifier = new Subject();

  lists: ListI[] = [];
  listsE: ListI[] = [];
  inputText: string = '';

  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  editable = true;
  validation = false;
  idSaveValidar: number = 0;
  consulting = false;
  loading: boolean = false;
  yearNav: string = '';
  selectedFichaP016!: IItemConsultaResponse;
  dataP016ProblemTree: IItemP016ProblemTreeRespuesta | any = undefined;
  isSubmiting: boolean = false;
  editForm: boolean = false;
  arrayFilesEsquema: any[] = [];
  dataUser: IDatosUsuario;
  esquema!: IEsquemaResponse;
  canEdit: boolean = true;
  selectedAjustesPP!: any;
  selectedValidarPP!: any;

  constructor(
    private _boardService: BoardService,
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    public modalService: ModalService,
    private ppConsultasService: PPConsultasService,
    private p016DiagnosticoService: P016DiagnosticService,
    private p016ProblemTreeService: P016ProblemTreeService,
    private alfrescoService: AlfrescoService,
    private alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.canEdit = this.ls.get('canEdit');
    this.editable = this._stateViewService.editable;
    this.validation = this._stateViewService.validation;
    this.consulting = this._stateViewService.consulting;
    this.selectedAjustesPP = this.ls.get('selectedAjustesPP');
    this.selectedValidarPP = this.ls.get('selectedValidarPP');
    if (this.canEdit && this.selectedValidarPP) {
      this.canEdit = false;
    }

    //this.simulate();
    this.questions = [
      new TextareaQuestion({
        idElement: 157,
        nane: 'Problema Central',
        label: 'Problema Central',
        validators: [Validators.required, Validators.maxLength(3000)],
      }),
      new TextareaQuestion({
        idElement: 158,
        nane: 'Causas',
        label: 'Causas',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 159,
        nane: 'Efectos',
        label: 'Efectos',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 160,
        nane: 'Esquema',
        label: 'Esquema',
        validators: [Validators.required, Validators.maxLength(300)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this.editable) {
      this.form.disable();
    }
    this.getAll();
    this.getPrograma();
  }

  getPrograma() {
    this.ppConsultasService
      .getConsultaPorProgramaYAnhio(this.yearNav, 'P016')
      .then((response) => {
        this.selectedFichaP016 = response;
        if (
          !this.selectedAjustesPP &&
          !this.selectedValidarPP &&
          !this.consulting &&
          (this.selectedFichaP016.estatusGeneral === 'P' ||
            this.selectedFichaP016.estatusGeneral === 'E')
        ) {
          this.alertService.showAlert(
            'El programa está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
          );
        }

        this._boardService.canAdd = false;
        this._boardService.canEdit = false;
        this._boardService.editableInput = false;
      })
      .catch((error) => {
        this.canEdit = false;
        this.alertService.showAlert(
          `No se ha Registrado un Programa para el Año ${this.yearNav}, vaya a Datos Generales y Guardelo para Poder Continuar.`
        );
      });
  }

  async submit() {
    this.isSubmiting = true;
    let archivoToCreate: any = null;
    if (this.arrayFilesEsquema?.length > 0) {
      const responseAlf = await this.uploadToAlfresco(this.arrayFilesEsquema);
      if (responseAlf) {
        archivoToCreate = responseAlf;
      }
    }

    this.board?.getValuesBoard().then((value) => {
      let inverseJson: IP016ProblemTreePayload = {
        ...this.mapJsonInverse(
          value.causas,
          value.efectos,
          value.programaCentral
        ),
        esquema: archivoToCreate,
      };
      this.p016ProblemTreeService
        .registrarArbolProblema(inverseJson)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.getProblemTree();
              this.editForm = false;
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
          error: (error) => {
            this.isSubmiting = false;
            this.getAll();
          },
        });
    });
  }

  simulate() {
    this.listsE.push(
      {
        cards: [
          {
            title: '1',
            description: `Ineficiente toma de decisiones entre los diferentes actores escolares y autoridades`,
            type: TypeCardEnum.EFECTO,
            isChild: false,
            cards: [],
          },
        ],
      },
      {
        cards: [
          {
            title: '2',
            description: `Desequilibrio entre el desarrolllo conceptual y metodológico para la formación diagnóstica y formativa de los componentes, procesos y resultados involucrados en el hecho educativo`,
            type: TypeCardEnum.EFECTO,
            isChild: false,
            cards: [
              {
                title: '2.1',
                description: `Estrategia rectora integral de Mediano Plazo que no considera estudios, investigaciones, instrumentos y evaluaciones de procesos, componentes y resultados educativos que se vinculen con las decisiones de mejora educativa del SEN`,
                type: TypeCardEnum.EFECTO,
                isChild: true,
                cards: [],
              },
            ],
          },
        ],
      },
      {
        cards: [
          {
            title: '3',
            description: `Incipiente normatividad para el desarrollo de la mejora continua de la educación`,
            type: TypeCardEnum.EFECTO,
            isChild: false,
            cards: [
              {
                title: '3.1',
                description: `Inexistencia de un programa estratégico que define objetivos, estrategias y líneas de acción para impulsar la mejora continua de la educación`,
                type: TypeCardEnum.EFECTO,
                isChild: true,
                cards: [],
              },
            ],
          },
        ],
      }
    );
    this.lists.push(
      {
        cards: [
          {
            title: '1',
            description: `Deficiente sistema de indicadores para monitorear los resultados de la mejora educativa`,
            type: TypeCardEnum.CAUSA,
            isChild: false,
            cards: [
              {
                title: '1.1',
                description: `Deficiente estadísticas e indicadores en diferentes niveles de desagregación hasta la escuela que permiten monitorear la mejora continua de la educación`,
                type: TypeCardEnum.CAUSA,
                isChild: false,
                cards: [
                  {
                    title: '1.1.1',
                    description: `Inapropiadas sugerencias de elementos para la mejora de planes y programas de estudio, y de los objetivos de la educación inicial y de adultos`,
                    type: TypeCardEnum.CAUSA,
                    isChild: false,
                    cards: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        cards: [
          {
            title: '2',
            description: `Deficiente marco normativo para la mejora continua de la educación`,
            type: TypeCardEnum.CAUSA,
            isChild: false,
            cards: [
              {
                title: '2.1',
                description: `Poco pertinentes materiales y recursos relacionados con la mejora continua de la educación`,
                type: TypeCardEnum.CAUSA,
                isChild: false,
                cards: [
                  {
                    title: '2.1.1',
                    description: `Deficientes lineamientos y criterios para la mejora del aprendizaje escolar`,
                    type: TypeCardEnum.CAUSA,
                    isChild: false,
                    cards: [],
                  },
                ],
              },
              {
                title: '2.2',
                description: `Ineficientes estrategias y herramientas de apoyo y acompañamiento a los actores educativos y escolares para promover la mejora continua de la educación`,
                type: TypeCardEnum.CAUSA,
                isChild: false,
                cards: [],
              },
            ],
          },
        ],
      },
      {
        cards: [
          {
            title: '3',
            description: `Deficiente estructura de actores, instituciones y procesos enfocados a la mejora continua de la educación`,
            type: TypeCardEnum.CAUSA,
            isChild: false,
            cards: [],
          },
        ],
      }
    );
  }

  uploadToAlfresco(files: any[]) {
    return new Promise<any>((resolve, reject) => {
      const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
      let fileTmp: any = null;
      if (files.length > 0) {
        // this.isUploadFile = true;
        fileTmp = files[0];
        this.alfrescoService
          .uploadFileAlfService(dataAlf.uuidPlaneacion, fileTmp)
          .subscribe({
            next: (value) => {
              // this.isUploadFile = false;
              resolve({
                uuid: value.entry.id,
                // idArchivo: null,
                // estatus: 'A',
                nombre: fileTmp.name,
                tipoArchivo: DOCUMENT_TYPES.image,
                // usuario: this.dataUser.cveUsuario,
              });
            },
            error: (err) => {
              // this.isUploadFile = false;
              reject(err);
            },
          });
      }
    });
  }

  getAll() {
    this.loading = true;
    this.getProblemTree();
    this.loading = false;
  }

  getDefinicionProblema() {
    return new Promise<string>((resolve, reject) => {
      this.p016DiagnosticoService
        .getDiagnosticoPorAnhio(this.yearNav)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            resolve(value.respuesta.definicionProblema ?? '');
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  getProblemTree() {
    this.p016ProblemTreeService
      .getArbolProblemaoPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (value.respuesta.esquema) {
              this.esquema = value.respuesta.esquema;
            }
            this.getDefinicionProblema().then(
              (value) => (this.inputText = value)
            );
            this.dataP016ProblemTree = value.respuesta;
            this.idSaveValidar = this.dataP016ProblemTree.idArbol;
            let causas: any = this.mapJsonCausas(value.respuesta);
            this.lists = causas;
            let efectos: any = this.mapJsonEfectos(value.respuesta);
            this.listsE = efectos;
          }
        },
        error: (error) => { },
      });
  }

  mapCausaToCard(item: any, type?: boolean) {
    return {
      title: item.clave,
      idNodo: item.idNodo,
      description: item.descripcion,
      type: type ? TypeCardEnum.EFECTO : TypeCardEnum.CAUSA,
      isChild: item.nivel > 1,
      cards: item.hijos?.map((hijos) => this.mapCausaToCard(hijos, type)),
    };
  }

  mapJsonCausas(input: any): any {
    let cardsCausa: any[] = [];
    for (let i in input.causas) {
      cardsCausa.push({ cards: [this.mapCausaToCard(input.causas[i])] });
    }
    return cardsCausa;
  }

  mapJsonEfectos(input: any): any {
    let cardsEfecto: any[] = [];
    for (let i in input.efectos) {
      cardsEfecto.push({
        cards: [this.mapCausaToCard(input.efectos[i], true)],
      });
    }
    return cardsEfecto;
  }

  mapCardToCausa(card: any): any {
    return {
      idNodo: card.idNodo ? card.idNodo : null,
      clave: card.title.replace(/[EC]/g, ''),
      descripcion: card.description,
      hijos: card.cards.map((hijo: any) => this.mapCardToCausa(hijo)),
    };
  }

  mapJsonInverse(
    inputCausas: any,
    inputEfectos: any,
    problemaCentral: string
  ): any {
    let causas: any[] = [];
    let efectos: any[] = [];
    for (let i in inputCausas) {
      causas.push(this.mapCardToCausa(inputCausas[i].cards[0]));
    }
    for (let i in inputEfectos) {
      efectos.push(this.mapCardToCausa(inputEfectos[i].cards[0]));
    }
    return {
      idAnhio: this.dataP016ProblemTree?.idAnhio || this.yearNav,
      problemaCentral,
      causas,
      efectos,
    };
  }

  get disabledBtnEdit(): boolean {
    if (
      this.selectedFichaP016?.estatusGeneral === 'T' ||
      this.selectedFichaP016?.estatusGeneral === 'P' ||
      this.selectedFichaP016?.estatusGeneral === 'E'
    ) {
      return true;
    } else {
      return this.editForm;
    }
  }

  handleEditform() {
    this._boardService.canAdd = true;
    this._boardService.canEdit = true;
    this._boardService.editableInput = true;
    this.editForm = true;
  }

  downloadEsquema() {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid: this.esquema.cxUuid,
      fileName: this.esquema.cxNombre,
    });
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
