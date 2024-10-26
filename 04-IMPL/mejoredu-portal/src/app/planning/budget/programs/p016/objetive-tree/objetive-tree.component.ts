import { Component, ViewChild } from '@angular/core';
import { ListI } from '../board/interfaces/list.interface';
import { TypeCardEnum } from '../board/enums/type.enum';
import { BoardService } from '../board/services/board.service';
import { StateViewService } from '../../../services/state-view.service';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { ModalService } from '@common/modal/modal.service';
import { P016DiagnosticService } from '@common/services/budget/p016/diagnostic.service';
import * as SecureLS from 'secure-ls';
import { BoardComponent } from '../board/board.component';
import { Subject, takeUntil } from 'rxjs';
import { P016ObjetiveTreeService } from '@common/services/budget/p016/objetive-tree.service';
import {
  IItemP016ObjetiveTreeRespuesta,
  IP016ObjetiveTreePayload,
} from '@common/interfaces/budget/p016/objetive-tree.interface';
import { PPConsultasService } from '@common/services/budget/consultas.service';
import { IItemConsultaResponse } from '@common/interfaces/budget/consultas.interface';
import { DOCUMENT_TYPES } from '@common/enums/documentTypes.enum';
import { AlfrescoService } from '@common/services/alfresco.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { IEsquemaResponse } from '@common/interfaces/budget/p016/problem-tree.interface';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-objetive-tree',
  templateUrl: './objetive-tree.component.html',
  styleUrls: ['./objetive-tree.component.scss'],
})
export class ObjetiveTreeComponent {
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
  consulting = false;
  idSaveValidar: number = 0;
  loading: boolean = false;
  yearNav: string = '';
  selectedFichaP016!: IItemConsultaResponse;
  dataP016ObjetiveTree: IItemP016ObjetiveTreeRespuesta | any = undefined;
  isSubmiting: boolean = false;
  editForm: boolean = false;
  arrayFilesEsquema: any[] = [];
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
    private p016ObjetiveTreeService: P016ObjetiveTreeService,
    private alfrescoService: AlfrescoService,
    private alertService: AlertService
  ) {
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
        idElement: 161,
        nane: 'Problema Central',
        label: 'Problema Central',
        validators: [Validators.required, Validators.maxLength(3000)],
      }),
      new TextareaQuestion({
        idElement: 162,
        nane: 'Medios',
        label: 'Medios',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 163,
        nane: 'Fines',
        label: 'Fines',
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      new TextareaQuestion({
        idElement: 164,
        nane: 'Esquema',
        label: 'Esquema',
        validators: [Validators.required, Validators.maxLength(300)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this.editable) {
      this.form.disable();
    }
    this.validation = this._stateViewService.validation;
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
      let inverseJson: IP016ObjetiveTreePayload = {
        ...this.mapJsonInverse(
          value.medios,
          value.fines,
          value.programaCentral
        ),
        esquema: archivoToCreate,
      };
      this.p016ObjetiveTreeService
        .registrarArbolObjetivo(inverseJson)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.getPrograma();
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

  uploadToAlfresco(files: any[]) {
    return new Promise<any>((resolve, reject) => {
      const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
      let fileTmp: any = null;
      if (files.length > 0) {
        fileTmp = files[0];
        this.alfrescoService
          .uploadFileAlfService(dataAlf.uuidPlaneacion, fileTmp)
          .subscribe({
            next: (value) => {
              resolve({
                uuid: value.entry.id,
                nombre: fileTmp.name,
                tipoArchivo: DOCUMENT_TYPES.image,
              });
            },
            error: (err) => {
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
    this.p016ObjetiveTreeService
      .getArbolObjetivoPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (value.respuesta.esquema) {
              this.esquema = value.respuesta.esquema;
            }
            this.inputText = value.respuesta.problemaCentral;
            if (!this.inputText) {
              this.getDefinicionProblema().then(
                (value) => (this.inputText = value)
              );
            }
            this.idSaveValidar = value.respuesta.idArbol;
            this.dataP016ObjetiveTree = value.respuesta;
            let medios: any = this.mapJsonMedios(value.respuesta);
            this.lists = medios;
            let fines: any = this.mapJsonFines(value.respuesta);
            this.listsE = fines;
          }
        },
        error: (error) => { },
      });
  }

  mapCausaToCard(item: any, type?: boolean) {
    let cardType;

    if (item.idTipo) {
      switch (item.idTipo) {
        case 11:
          cardType = TypeCardEnum.NO_FIN;
          break;
        case 10:
          cardType = TypeCardEnum.FIN;
          break;
        case 7:
          cardType = TypeCardEnum.COMPONENTE;
          break;
        case 8:
          cardType = TypeCardEnum.ACTIVIDAD;
          break;
      }
    } else {
      cardType = type ? TypeCardEnum.FIN : TypeCardEnum.MEDIO;
    }

    return {
      title: item.clave,
      idNodo: item.idNodo,
      description: item.descripcion,
      type: cardType,
      isChild: item.nivel > 1,
      cards: item.hijos?.map((hijos) => this.mapCausaToCard(hijos, type)),
    };
  }

  mapJsonMedios(input: any): any {
    let cardsMedios: any[] = [];
    for (let i in input.medios) {
      cardsMedios.push({ cards: [this.mapCausaToCard(input.medios[i])] });
    }
    return cardsMedios;
  }

  mapJsonFines(input: any): any {
    let cardsEfecto: any[] = [];
    for (let i in input.fines) {
      cardsEfecto.push({ cards: [this.mapCausaToCard(input.fines[i], true)] });
    }
    return cardsEfecto;
  }

  mapCardToCausa(card: any): any {
    return {
      idNodo: card.idNodo ? card.idNodo : null,
      clave: card.title.replace(/[EC]/g, ''),
      descripcion: card.description,
      idTipo:
        card.type === TypeCardEnum.NO_FIN
          ? 11
          : card.type === TypeCardEnum.FIN
            ? 10
            : card.type === TypeCardEnum.COMPONENTE
              ? 7
              : card.type === TypeCardEnum.ACTIVIDAD
                ? 8
                : null,
      hijos: card.cards.map((hijo: any) => this.mapCardToCausa(hijo)),
    };
  }

  mapJsonInverse(
    inputMedios: any,
    inputFines: any,
    problemaCentral: string
  ): any {
    let medios: any[] = [];
    let fines: any[] = [];
    for (let i in inputMedios) {
      medios.push(this.mapCardToCausa(inputMedios[i].cards[0]));
    }
    for (let i in inputFines) {
      fines.push(this.mapCardToCausa(inputFines[i].cards[0]));
    }
    return {
      idAnhio: this.dataP016ObjetiveTree.idAnhio,
      problemaCentral,
      medios,
      fines,
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
    //this._boardService.canAdd = true;
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
