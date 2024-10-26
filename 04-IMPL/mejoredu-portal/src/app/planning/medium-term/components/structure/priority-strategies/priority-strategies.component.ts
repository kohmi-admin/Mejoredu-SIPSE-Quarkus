import { Component } from '@angular/core';
import { CommonStructure } from '../classes/common-structure.class';
import { TableColumn } from '@common/models/tableColumn';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { FormGroup, Validators } from '@angular/forms';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { StateViewService } from '../../../services/state-view.service';
import { GoalsService } from '@common/services/goals.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { IItemGoalResponse } from '@common/interfaces/goals.interface';
import { StrategiesService } from '@common/services/strategies.service';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import {
  IItemStrategieResponse,
  IStrategiePayload,
} from '@common/interfaces/strategies.interface';
import { ModalService } from '@common/modal/modal.service';
import { AlertService } from '@common/services/alert.service';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { ActionsService } from '@common/services/actions.service';
import {
  IActionPayload,
  IItemActionPayload,
} from '@common/interfaces/actions.interface';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import { IGestorResponse } from '@common/interfaces/medium-term/principal.interface';

@Component({
  selector: 'app-priority-strategies',
  templateUrl: './priority-strategies.component.html',
  styleUrls: [
    './priority-strategies.component.scss',
    '../structure.component.scss',
  ],
})
export class PriorityStrategiesComponent extends CommonStructure {
  formStrategies!: FormGroup;
  formActions!: FormGroup;
  questionsStrategies: QuestionBase<string>[] = [];
  questionsActions: QuestionBase<string>[] = [];
  dataStrategies: any[] = [];
  dataActions: any[] = [];
  isCleanFormStrategy: boolean = false;
  isCleanFormAccion: boolean = false;
  columnsStrategies: TableColumn[] = [
    { columnDef: 'nombreObjetivo', header: 'Objetivo', alignLeft: true },
    {
      columnDef: 'cdEstrategia',
      header: 'Estrategia Prioritaria',
      alignLeft: true,
    },
  ];
  columnsActions: TableColumn[] = [
    { columnDef: 'objetivo', header: 'Objetivo', alignLeft: true },
    {
      columnDef: 'estrategia',
      header: 'Estrategia Prioritaria',
      alignLeft: true,
    },
    {
      columnDef: 'cdAccion',
      header: 'Acción',
      alignLeft: true,
    },
  ];
  actionsStrategies: TableActionsI | undefined = {
    view: true,
    edit: true,
    delete: true,
  };
  actionsActions: TableActionsI | undefined = {
    view: true,
    edit: true,
    delete: true,
  };

  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  disabledSubmitingStrategies: boolean = false;
  disabledSubmitingActions: boolean = false;
  isSubmitingStrategies: boolean = false;
  isSubmitingActions: boolean = false;
  dataSelectedStrategies: any | undefined;
  dataSelectedActions: any | undefined;
  dataUser: IDatosUsuario;
  catObjetivoPrioritario: IItemGoalResponse[] = [];
  catStrategies: IItemStrategieResponse[] = [];
  objPrioriSelectedStrategie: IItemGoalResponse | undefined;
  objPrioriSelectedAction: IItemGoalResponse | undefined;
  estraPrioSelectedAction: IItemStrategieResponse | undefined;
  viewType: 'registro' | 'consulta' | 'actualizacion' | 'validar' = 'registro';
  idSaveValidar: number = 0;
  selectedValidatePI: any = null;
  selectedAjustesPI: any = null;
  canEdit: boolean = true;
  yearNav: string;
  dataEstructura!: IGestorResponse;

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    private goalsService: GoalsService,
    private strategiesService: StrategiesService,
    private modalService: ModalService,
    private alertService: AlertService,
    private actionsService: ActionsService,
    private principalService: PrincipalService
  ) {
    super();
    this.selectedValidatePI = this.ls.get('selectedValidatePI');
    this.selectedAjustesPI = this.ls.get('selectedAjustesPI');
    this.canEdit = this.ls.get('canEdit');
    this.viewType = this.ls.get('recordViewType');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.questionsStrategies = [
      new DropdownQuestion({
        nane: 'numero',
        label: 'Número',
        filter: true,
        options: [],
        validators: [Validators.required, Validators.maxLength(250)],
      }),
      new DropdownQuestion({
        nane: 'objetivoprioritario',
        label: 'Objetivo Prioritario',
        filter: true,
        options: [],
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
      new TextboxQuestion({
        nane: 'numero2',
        label: 'Número',
        disabled: true,
        value: '0.0',
        validators: [Validators.required, Validators.maxLength(250)],
      }),
      new TextboxQuestion({
        nane: 'estrategiaPrioritaria',
        label: 'Estrategia Prioritaria',
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
    ];
    this.questionsActions = [
      // new TextboxQuestion({
      new DropdownQuestion({
        nane: 'numero',
        label: 'Número',
        disabled: false,
        value: '',
        options: [],
        validators: [Validators.required, Validators.maxLength(250)],
      }),
      new DropdownQuestion({
        nane: 'objetivoprioritario',
        label: 'Objetivo Prioritario',
        filter: true,
        value: '',
        options: [],
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
      new DropdownQuestion({
        nane: 'numero2',
        label: 'Número',
        filter: true,
        // value: '0.0',
        value: '',
        options: [],
        validators: [Validators.required, Validators.maxLength(250)],
      }),
      new DropdownQuestion({
        nane: 'estrategiaPrioritaria',
        label: 'Estrategia Prioritaria',
        filter: true,
        value: '',
        options: [],
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
      new TextboxQuestion({
        nane: 'numero3',
        label: 'Número',
        disabled: true,
        value: '0.0.0',
        validators: [Validators.required, Validators.maxLength(250)],
      }),
      new TextboxQuestion({
        nane: 'accionPuntual',
        label: 'Acción Puntual',
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
    ];
    this.formStrategies = this._formBuilder.toFormGroup(
      this.questionsStrategies
    );
    this.formActions = this._formBuilder.toFormGroup(this.questionsActions);
    if (this.viewType !== 'validar' && !this._stateViewService.editable) {
      this.formStrategies.disable();
      this.actionsStrategies = undefined;
      this.formActions.disable();
      this.actionsActions = undefined;
    }
    this.getGestorPorAnhio();
    this.validation = this._stateViewService.validation;
  }

  ngOnInit() {
    this.subscribesForm();
  }

  getGestorPorAnhio() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta) {
            this.dataEstructura = value.respuesta;
            if (value.respuesta.estatus === 'O') {
              this.canEdit = false;
              this.alertService.showAlert('La Estructura está Aprobada.');
            } else if (
              this.canEdit &&
              value.respuesta.estatus !== 'C' &&
              value.respuesta.estatus !== 'I' &&
              !this.selectedValidatePI &&
              !this.selectedAjustesPI
            ) {
              this.canEdit = false;
              if (value.respuesta.estatus !== 'T') {
                this.alertService.showAlert(
                  'La Estructura está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
                );
              }
            }
          }
          this.getGoals();
        },
      });
  }

  getActionsTableStrategies() {
    const actionsTmp = {
      ...this.actionsStrategies,
    };
    if (
      this.viewType === 'consulta' ||
      this.viewType === 'validar' ||
      !this.canEdit
    ) {
      actionsTmp.edit = false;
      actionsTmp.delete = false;
    }
    return actionsTmp;
  }

  getActionsTableActions() {
    const actionsTmp = {
      ...this.actionsActions,
    };
    if (
      this.viewType === 'consulta' ||
      this.viewType === 'validar' ||
      !this.canEdit
    ) {
      actionsTmp.edit = false;
      actionsTmp.delete = false;
    }
    return actionsTmp;
  }

  questionsToValidate(): QuestionBase<any>[] {
    return [
      new DropdownQuestion({
        idElement: 9,
        nane: 'estrategiaPrioritaria',
        label: 'Estrategia Prioritaria',
        filter: true,
        value: '',
        options: [],
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
      new TextboxQuestion({
        idElement: 10,
        nane: 'accionPuntual',
        label: 'Acción Puntual',
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
    ].filter((question) => {
      return question.label !== 'Número';
    });
  }

  subscribesForm() {
    this.formStrategies
      .get('numero')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { objetivoprioritario } = this.formStrategies.getRawValue();

        if (value && !this.dataSelectedStrategies) {
          const finded = this.catObjetivoPrioritario.filter(
            (item) => item.idObjetivo === value
          );
          if (finded?.length > 0) {
            this.objPrioriSelectedStrategie = finded[0];
            if (
              objetivoprioritario !== this.objPrioriSelectedStrategie.idObjetivo
            ) {
              this.formStrategies
                .get('objetivoprioritario')
                ?.setValue(this.objPrioriSelectedStrategie.idObjetivo);
              this.getEstrategias(
                'strategies',
                this.objPrioriSelectedStrategie.ixObjetivo
              );
            }
          }
        }
      });
    this.formStrategies
      .get('objetivoprioritario')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { numero } = this.formStrategies.getRawValue();

        if (value && !this.dataSelectedStrategies) {
          const finded = this.catObjetivoPrioritario.filter(
            (item) => item.idObjetivo === value
          );
          if (finded?.length > 0) {
            this.objPrioriSelectedStrategie = finded[0];
            if (numero !== this.objPrioriSelectedStrategie.idObjetivo) {
              this.formStrategies
                .get('numero')
                ?.setValue(this.objPrioriSelectedStrategie.idObjetivo);
              this.getEstrategias(
                'strategies',
                this.objPrioriSelectedStrategie.ixObjetivo
              );
            }
          }
        }
      });
    this.formActions
      .get('numero')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { objetivoprioritario } = this.formActions.getRawValue();
        if (value && !this.dataSelectedActions) {
          const finded = this.catObjetivoPrioritario.filter(
            (item) => item.idObjetivo === value
          );
          if (finded?.length > 0) {
            this.objPrioriSelectedAction = finded[0];
            if (
              objetivoprioritario !== this.objPrioriSelectedAction.idObjetivo
            ) {
              this.formActions
                .get('objetivoprioritario')
                ?.setValue(this.objPrioriSelectedAction.idObjetivo);
              this.getEstrategias(
                'actions',
                this.objPrioriSelectedAction.ixObjetivo
              );
            }
          }
        }
      });
    this.formActions
      .get('objetivoprioritario')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { numero } = this.formActions.getRawValue();
        if (value && !this.dataSelectedActions) {
          const finded = this.catObjetivoPrioritario.filter(
            (item) => item.idObjetivo === value
          );
          if (finded?.length > 0) {
            this.objPrioriSelectedAction = finded[0];
            if (numero !== this.objPrioriSelectedAction.idObjetivo) {
              this.formActions
                .get('numero')
                ?.setValue(this.objPrioriSelectedAction.idObjetivo);
              this.getEstrategias(
                'actions',
                this.objPrioriSelectedAction.ixObjetivo
              );
            }
          }
        }
      });

    this.formActions
      .get('numero2')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { estrategiaPrioritaria } = this.formActions.getRawValue();
        if (value && !this.dataSelectedActions) {
          const finded = this.catStrategies.filter(
            (item) => item.idEstrategia === value
          );
          if (finded?.length > 0) {
            this.estraPrioSelectedAction = finded[0];
            if (
              estrategiaPrioritaria !==
              this.estraPrioSelectedAction.idEstrategia
            ) {
              this.formActions
                .get('estrategiaPrioritaria')
                ?.setValue(this.estraPrioSelectedAction.idEstrategia);
            }
          }
        }
      });
    this.formActions
      .get('estrategiaPrioritaria')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value && !this.dataSelectedActions) {
          const finded = this.catStrategies.filter(
            (item) => item.idEstrategia === value
          );
          if (finded?.length > 0) {
            this.estraPrioSelectedAction = finded[0];
            this.formActions
              .get('numero2')
              ?.setValue(this.estraPrioSelectedAction.idEstrategia);
            this.getActions(+finded[0].cveEstrategia);
          }
        }
      });
  }

  onUpdateTableEstrategies() {
    const id: number = +(this.objPrioriSelectedStrategie?.ixObjetivo ?? 0);
    if (id !== 0) {
      this.getEstrategias('strategies', id);
    }
  }

  onUpdateTableActions() {
    const id: number = +(this.estraPrioSelectedAction?.cveEstrategia ?? 0);
    if (id !== 0) {
      this.getActions(id);
    }
  }

  getEstrategias(from: 'strategies' | 'actions', idObjetivo: number) {
    this.strategiesService
      .getStrategiesByIdObjetivo(idObjetivo)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (value.respuesta?.length > 0) {
              if (from === 'strategies') {
                const arrClaves: number[] = [];
                const tmpData: any[] = [];
                const tmpCatStrategiasCve: any[] = [];
                const tmpCatStrategias: any[] = [];
                for (const item of value.respuesta) {
                  arrClaves.push(+item.cveEstrategia);
                  tmpData.push({
                    ...item,
                    nombreObjetivo: this.objPrioriSelectedStrategie?.cdObjetivo,
                  });

                  tmpCatStrategias.push({
                    id: item.idEstrategia,
                    value: item.cdEstrategia,
                  });
                  tmpCatStrategiasCve.push({
                    id: item.idEstrategia,
                    value: item.cveEstrategia,
                  });
                }
                const maxClave = Math.max(...arrClaves);
                const arrMaxClave = String(maxClave).split('.');
                arrMaxClave[1] = String(+arrMaxClave[1] + 1);
                this.formStrategies
                  .get('numero2')
                  ?.setValue(arrMaxClave.join('.'));
                this.dataStrategies = tmpData;
                if (
                  this.objPrioriSelectedStrategie?.idObjetivo ===
                  this.objPrioriSelectedAction?.idObjetivo
                ) {
                  this.questionsActions[2].options = tmpCatStrategiasCve;
                  this.questionsActions[3].options = tmpCatStrategias;
                }
              }
              if (from === 'actions') {
                const tmpCatStrategias: any[] = [];
                const tmpCatStrategiasCve: any[] = [];
                for (const item of value.respuesta) {
                  tmpCatStrategias.push({
                    id: item.idEstrategia,
                    value: item.cdEstrategia,
                  });
                  tmpCatStrategiasCve.push({
                    id: item.idEstrategia,
                    value: item.cveEstrategia,
                  });
                }
                this.questionsActions[2].options = tmpCatStrategiasCve;
                this.questionsActions[3].options = tmpCatStrategias;
                this.catStrategies = value.respuesta;
              }
            } else {
              if (from === 'strategies') {
                this.dataStrategies = [];
                this.formStrategies
                  .get('numero2')
                  ?.setValue(
                    (this.objPrioriSelectedStrategie?.ixObjetivo ?? 0) + 0.1
                  );
              }
              if (from === 'actions') {
                this.dataActions = [];
              }
            }
          }
        },
        error: (err) => { },
      });
  }

  getActions(idStrategia: number) {
    this.actionsService
      .getActionByIdEstrategia(idStrategia)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (value.respuesta?.length > 0) {
              const arrClaves: number[] = [];
              const tmpData: any[] = [];
              for (const item of value.respuesta) {
                const arrcveAccion = item.cveAccion.split('.');
                arrClaves.push(+arrcveAccion[2]);
                tmpData.push({
                  ...item,
                  objetivo: this.objPrioriSelectedAction?.cdObjetivo,
                  estrategia: this.estraPrioSelectedAction?.cdEstrategia,
                });
              }
              const maxClave = Math.max(...arrClaves);
              this.formActions
                .get('numero3')
                ?.setValue(
                  `${this.estraPrioSelectedAction?.cveEstrategia}.${maxClave + 1
                  }`
                );
              this.dataActions = tmpData;
            } else {
              this.dataActions = [];
              this.formActions
                .get('numero3')
                ?.setValue(`${this.estraPrioSelectedAction?.cveEstrategia}.1`);
            }
          }
        },
        error: (err) => { },
      });
  }

  getGoals() {
    this.goalsService
      .getGoals()
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.catObjetivoPrioritario = value.respuesta;
            const tmpDataCat: any[] = [];
            const tmpDataCatCve: any[] = [];
            for (const item of value.respuesta) {
              tmpDataCat.push({
                id: item.idObjetivo,
                value: String(item.cdObjetivo),
              });
              tmpDataCatCve.push({
                id: item.idObjetivo,
                value: String(item.ixObjetivo),
              });
            }
            this.questionsStrategies[0].options = tmpDataCatCve;
            this.questionsStrategies[1].options = tmpDataCat;
            this.questionsActions[0].options = tmpDataCatCve;
            this.questionsActions[1].options = tmpDataCat;
          }

          if (!this.canEdit) {
            this.formStrategies
              .get('estrategiaPrioritaria')
              ?.disable({ emitEvent: false });
            this.formActions
              .get('accionPuntual')
              ?.disable({ emitEvent: false });
          }
          if (this.viewType === 'validar') {
            this.formStrategies.get('numero')?.enable();
            this.formStrategies.get('objetivoprioritario')?.enable();
            this.formStrategies.get('numero2')?.disable();
            this.formStrategies.get('estrategiaPrioritaria')?.disable();
            this.formActions.get('numero')?.enable();
            this.formActions.get('objetivoprioritario')?.enable();
            this.formActions.get('numero2')?.enable();
            this.formActions.get('estrategiaPrioritaria')?.enable();
            this.formActions.get('numero3')?.disable();
            this.formActions.get('accionPuntual')?.disable();
          }
        },
        error: (err) => { },
      });
  }

  async onTableActionStrategies(event: TableButtonAction) {
    const dataAction: IItemStrategieResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.dataSelectedStrategies = dataAction;
        this.resetAllFormStrategies();
        this.isCleanFormStrategy = true;
        setTimeout(() => {
          this.uploadDataToFormStrategies(dataAction);
          if (this.viewType !== 'validar') {
            this.formStrategies.disable();
          }
          this.disabledSubmitingStrategies = true;
          if (
            this.viewType === 'validar' ||
            this.viewType === 'actualizacion'
          ) {
            this.validateWhereComeFrom(dataAction.idEstrategia);
          }
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this.dataSelectedStrategies = dataAction;
        this.resetAllFormStrategies();
        this.isCleanFormStrategy = true;
        setTimeout(() => {
          this.uploadDataToFormStrategies(dataAction);
          this.formStrategies.enable();
          this.formStrategies.get('numero2')?.disable();
          this.disabledSubmitingStrategies = false;
          if (
            this.viewType === 'validar' ||
            this.viewType === 'actualizacion'
          ) {
            this.validateWhereComeFrom(dataAction.idEstrategia);
          }
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this.alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la estrategia?',
          });
          if (confirm) {
            this.strategiesService
              .deleteStrategie({
                idEstrategia: dataAction.idEstrategia,
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
                    this.getEstrategias(
                      'strategies',
                      this.objPrioriSelectedStrategie?.ixObjetivo ?? 0
                    );
                    this.resetAllFormStrategies('new');
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  async onTableActionActions(event: TableButtonAction) {
    const dataAction: IItemActionPayload = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.dataSelectedActions = dataAction;
        this.resetAllFormActions();
        this.isCleanFormAccion = true;
        setTimeout(() => {
          this.uploadDataToFormActions(dataAction);
          this.formActions.disable();
          this.disabledSubmitingActions = true;
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this.dataSelectedActions = dataAction;
        this.resetAllFormActions();
        this.isCleanFormAccion = true;
        setTimeout(() => {
          this.uploadDataToFormActions(dataAction);
          this.formActions.enable();
          // this.formActions.get('numero2')?.disable();
          this.formActions.get('numero3')?.disable();
          this.disabledSubmitingActions = false;
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this.alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la estrategia?',
          });
          if (confirm) {
            this.actionsService
              .deleteAction({
                idAccion: dataAction.idAccion,
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
                    this.getActions(
                      +(this.estraPrioSelectedAction?.cveEstrategia ?? 0)
                    );
                    this.resetAllFormActions('new');
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  validateWhereComeFrom(idSave: number) {
    this.idSaveValidar = idSave;
  }

  submitStrategies() {
    const { numero, objetivoprioritario, numero2, estrategiaPrioritaria } =
      this.formStrategies.getRawValue();

    if (this.formStrategies.valid) {
      this.isSubmitingStrategies = true;
      if (!this.dataSelectedStrategies) {
        const dataCreateGoal: IStrategiePayload = {
          idEstrategia: null,
          cveObjetivo: String(this.objPrioriSelectedStrategie?.ixObjetivo),
          cdEstrategia: estrategiaPrioritaria,
          cveEstrategia: String(numero2),
          usuario: this.dataUser.cveUsuario,
          idEstructura: this.dataEstructura.idPrograma,
        };
        this.strategiesService
          .createStrategie(dataCreateGoal)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmitingStrategies = false;
              if (value.mensaje.codigo === '200') {
                this.getEstrategias(
                  'strategies',
                  this.objPrioriSelectedStrategie?.ixObjetivo ?? 0
                );
                this.resetAllFormStrategies('new');
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
              this.isSubmitingStrategies = false;
            },
          });
      } else {
        const dataUpdateProyecto: IStrategiePayload = {
          idEstrategia: this.dataSelectedStrategies.idEstrategia,
          cveObjetivo: String(this.objPrioriSelectedStrategie?.ixObjetivo),
          cdEstrategia: estrategiaPrioritaria,
          cveEstrategia: String(numero2),
          usuario: this.dataUser.cveUsuario,
          idEstructura: this.dataEstructura.idPrograma,
        };
        this.strategiesService
          .updateStrategie(dataUpdateProyecto)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmitingStrategies = false;
              if (value.mensaje.codigo === '200') {
                this.getEstrategias(
                  'strategies',
                  this.objPrioriSelectedStrategie?.ixObjetivo ?? 0
                );
                this.resetAllFormStrategies('new');
                this.modalService.openGenericModal({
                  idModal: 'modal-disabled',
                  component: 'generic',
                  data: {
                    text: 'Se modificó correctamente.',
                    labelBtnPrimary: 'Aceptar',
                  },
                });
              } else {
                this.modalService.openGenericModal({
                  idModal: 'modal-disabled',
                  component: 'generic',
                  data: {
                    text: 'Error al modificar, intente más tarde.',
                    labelBtnPrimary: 'Aceptar',
                  },
                });
              }
            },
            error: (error) => {
              this.isSubmitingStrategies = false;
            },
          });
      }
    }
  }

  submitActions() {
    const { numero2, numero3, accionPuntual } = this.formActions.getRawValue();
    let cveNumero2 = '';
    const finded = this.catStrategies.filter(
      (item) => item.idEstrategia === numero2
    );
    if (finded?.length > 0) {
      cveNumero2 = finded[0].cveEstrategia;
    }

    if (this.formActions.valid) {
      this.isSubmitingActions = true;
      if (!this.dataSelectedActions) {
        const dataCreateGoal: IActionPayload = {
          cdAccion: accionPuntual,
          cveAccion: numero3,
          idAccion: 0,
          idEstrategia: this.estraPrioSelectedAction?.idEstrategia ?? 0,
          cveEstrategia: String(cveNumero2),
          usuario: this.dataUser.cveUsuario,
          idEstructura: this.dataEstructura.idPrograma,
        };
        this.actionsService
          .createAction(dataCreateGoal)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmitingActions = false;
              if (value.mensaje.codigo === '200') {
                this.getActions(
                  +(this.estraPrioSelectedAction?.cveEstrategia ?? 0)
                );
                this.resetAllFormActions('new');
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
              this.isSubmitingActions = false;
            },
          });
      } else {
        const dataUpdateProyecto: IActionPayload = {
          cdAccion: accionPuntual,
          cveAccion: numero3,
          idAccion: this.dataSelectedActions.idAccion,
          idEstrategia: this.estraPrioSelectedAction?.idEstrategia ?? 0,
          cveEstrategia: String(cveNumero2),
          usuario: this.dataUser.cveUsuario,
          idEstructura: this.dataEstructura.idPrograma,
        };
        this.actionsService
          .updateAction(dataUpdateProyecto)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmitingActions = false;
              if (value.mensaje.codigo === '200') {
                this.getActions(
                  +(this.estraPrioSelectedAction?.cveEstrategia ?? 0)
                );
                this.resetAllFormActions('new');
                this.modalService.openGenericModal({
                  idModal: 'modal-disabled',
                  component: 'generic',
                  data: {
                    text: 'Se modificó correctamente.',
                    labelBtnPrimary: 'Aceptar',
                  },
                });
              }
            },
            error: (error) => {
              this.isSubmitingActions = false;
            },
          });
      }
    }
  }

  newStrategie() {
    this.resetAllFormStrategies();
    this.formStrategies.enable();
    this.formStrategies.get('numero')?.setValue('0');
    this.formStrategies.get('numero2')?.disable();
    this.formStrategies.get('numero2')?.setValue('0.0');
    this.dataSelectedStrategies = undefined;
    this.dataStrategies = [];
    this.objPrioriSelectedStrategie = undefined;
    this.isCleanFormStrategy = false;
  }

  newAction() {
    this.resetAllFormActions();
    this.formActions.enable();
    this.formActions.get('numero')?.setValue('0');
    this.formActions.get('numero2')?.setValue('0.0');
    this.formActions.get('numero3')?.disable();
    this.formActions.get('numero3')?.setValue('0.0.0');
    this.dataSelectedActions = undefined;
    this.dataActions = [];
    this.questionsActions[3].options = [];
    this.objPrioriSelectedAction = undefined;
    this.estraPrioSelectedAction = undefined;
    this.isCleanFormAccion = false;
  }

  resetAllFormStrategies(from?: string) {
    this.formStrategies.reset();
    this.disabledSubmitingStrategies = false;
    if (from === 'new') {
      this.formStrategies
        .get('numero')
        ?.setValue(this.objPrioriSelectedStrategie?.ixObjetivo);
      this.formStrategies
        .get('objetivoprioritario')
        ?.setValue(this.objPrioriSelectedStrategie?.idObjetivo);
    }
  }

  resetAllFormActions(from?: string) {
    this.formActions.reset();
    this.disabledSubmitingActions = false;
    if (from === 'new') {
      this.formActions
        .get('numero')
        ?.setValue(this.objPrioriSelectedAction?.ixObjetivo);
      this.formActions
        .get('objetivoprioritario')
        ?.setValue(this.objPrioriSelectedAction?.idObjetivo);
      this.formActions
        .get('numero2')
        ?.setValue(this.estraPrioSelectedAction?.cveEstrategia);
      this.formActions
        .get('estrategiaPrioritaria')
        ?.setValue(this.estraPrioSelectedAction?.idEstrategia);
    }
  }

  uploadDataToFormStrategies(dataAction: IItemStrategieResponse) {
    this.formStrategies.controls['numero'].setValue(
      this.objPrioriSelectedStrategie?.idObjetivo
    );
    const finded = this.catObjetivoPrioritario.filter(
      (item) => String(item.ixObjetivo) == dataAction.cveObjetivo
    );
    if (finded?.length > 0) {
      this.formStrategies.controls['objetivoprioritario'].setValue(
        finded[0].idObjetivo
      );
    }
    this.formStrategies.controls['numero2'].setValue(dataAction.cveEstrategia);
    this.formStrategies.controls['estrategiaPrioritaria'].setValue(
      dataAction.cdEstrategia
    );
  }

  uploadDataToFormActions(dataAction: IItemActionPayload) {
    this.formActions.controls['numero'].setValue(
      this.objPrioriSelectedAction?.idObjetivo
    );
    this.formActions.controls['objetivoprioritario'].setValue(
      this.objPrioriSelectedAction?.idObjetivo
    );
    this.formActions.controls['numero2'].setValue(
      this.estraPrioSelectedAction?.idEstrategia
    );
    this.formActions.controls['estrategiaPrioritaria'].setValue(
      this.estraPrioSelectedAction?.idEstrategia
    );
    this.formActions.controls['numero3'].setValue(dataAction.cveAccion);
    this.formActions.controls['accionPuntual'].setValue(dataAction.cdAccion);
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
