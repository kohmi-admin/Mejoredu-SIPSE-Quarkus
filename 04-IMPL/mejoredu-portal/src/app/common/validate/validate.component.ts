import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as SecureLS from 'secure-ls';
import { Subject, takeUntil } from 'rxjs';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { AlertService } from '@common/services/alert.service';
import { AlfrescoService } from '@common/services/alfresco.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ValidadorService } from '@common/services/validador.service';
import {
  IRevisionPayload,
  IRubricaComponent,
  IRubricaPayload,
  IValidationPayload,
} from '@common/interfaces/validation.interface';
import { Router } from '@angular/router';
import { getTotalRubrics } from '@common/utils/Utils';
import { AuthService } from '@common/services/auth.service';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss'],
})
export class ValidateComponent implements AfterViewInit, OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Input('questions') originalQuestions: QuestionBase<any>[] = [];
  @Input() title: string = 'Validación';
  @Input() canSign: boolean = false;
  @Input() disable: boolean = false;
  @Input() whenFinishGoTo: string = '';
  @Input() statusToFinish: string = '';
  @Input() textIdSaveEmpty: string = '';
  @Input() apartado: string = '';
  @Input() totalRubric: string = '';
  @Input() idSave: number = 0;
  @Input() idRechazar: number = 0;
  @Input() idAprobar: number = 0;
  @Input() listRubrics: IRubricaPayload[] = [];
  @Input() fromModule: 'cp' | 'mp' | 'ap' | 'pp' = 'cp';
  @Input() canFinish: boolean = false;
  @Input() canSave: boolean = true;
  @Input() showActions: boolean = false;
  @Input() selectedActividad: any = null;
  @Input() selectedProducto: any = null;
  @Input() docAnalitico: any = null;
  @Input() extraDataRevision: IRevisionPayload[] = [];
  @Input() withOutputValueChange: boolean = false;
  @Input() customSaveStr: string = 'Guardar Comentarios';
  @Input() idActividad: number = 0;
  @Input() trimestre: number = 2;
  @Output() onAction: EventEmitter<any> = new EventEmitter<void>();
  @Output() onHasComments: EventEmitter<any> = new EventEmitter<void>();
  @Output() valueChange: EventEmitter<IRevisionPayload[]> = new EventEmitter();
  questions: QuestionBase<any>[] = [];
  form!: FormGroup;
  notifier = new Subject();
  filesToSign: any[] = [];
  isUploadFile: boolean = false;
  dataUser: IDatosUsuario;
  submitingAprobar: boolean = false;
  submitingRechazar: boolean = false;
  noComments: boolean = false;
  loading: boolean = false;
  showRubric: boolean = false;
  showFirma: boolean = false;

  constructor(
    private router: Router,
    private _alertService: AlertService,
    private _formBuilder: QuestionControlService,
    private alfrescoService: AlfrescoService,
    private validadorService: ValidadorService,
    private authService: AuthService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    document.querySelector('.can-validate')?.classList.add('validate');
    document.querySelector('footer')?.classList.add('validate');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idSave']) {
      this.noComments = false;
      const currentValue = changes['idSave'].currentValue;
      if (currentValue !== 0) {
        this.buildQuestions();
        this.consultarRevison();
      }
    }
  }

  ngAfterViewInit(): void {
    this.buildQuestions();
    if (this.canSign && !this.dataUser.perfilLaboral.archivoFirma?.idArchivo) {
      this.showFirma = true;
    }
  }

  consultarRevison() {
    this.loading = true;
    this.validadorService
      .consultarRevision({
        apartado: this.apartado,
        fromModule: this.fromModule,
        idSave:
          this.fromModule == 'ap'
            ? String(this.idActividad)
            : String(this.idSave),
        tipoUsuario:
          this.fromModule === 'pp'
            ? this.dataUser.cveUsuario
            : this.dataUser.idTipoUsuario,
        trimestre: this.trimestre,
      })
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.loading = false;
          if (value.codigo === '200') {
            if (this.onHasComments) {
              this.onHasComments.emit({
                hasComments: true,
                respuesta: value.respuesta,
              });
            }
            for (const item of value.respuesta.revision) {
              if (
                (item.idElemento === 78 ||
                  item.idElemento === 79 ||
                  item.idElemento === 138) &&
                item.check === 0 &&
                item.comentarios &&
                this.disable &&
                this.apartado.includes('PRODUCTOS')
              ) {
                const findedQues = this.questions.filter(
                  (itemFilter) => itemFilter.idElement === item.idElemento
                );
                if (findedQues.length) {
                  findedQues[0].value = item.comentarios;
                }
              } else {
                const finded = this.originalQuestions.filter(
                  (itemQuestion) => itemQuestion.idElement === item.idElemento
                );
                if (finded?.length > 0) {
                  const find = finded[0];
                  this.form
                    .get(`${find.nane}-check`)
                    ?.setValue(item.check !== 0);
                  this.form
                    .get(`${find.nane}`)
                    ?.setValue(item.check === 0 ? item.comentarios : '');
                }
              }
            }
            if (this.disable) {
              this.listRubrics = value.respuesta.rubrica ?? [];
              if (this.listRubrics.length) {
                this.showRubric = true;
              }
              this.totalRubric = getTotalRubrics(value.respuesta.rubrica ?? []);
            }
          }
        },
        error: (err) => {
          if (this.onHasComments) {
            this.onHasComments.emit({
              hasComments: false,
            });
          }
          this.loading = false;
          if (this.disable) {
            this.noComments = true;
          }
        },
      });
  }

  buildQuestions(): void {
    const questions: any = [];
    let index = 0;
    for (const item of this.originalQuestions) {
      if (item.controlType !== 'checkbox') {
        if (!item.onlyLabel && !item.isRubric) {
          questions.push(
            new CheckboxQuestion({
              label: item.label,
              nane: `${item.nane}-check`,
              disabled: this.disable,
              value: true,
              idElement: item.idElement ?? 0,
            })
          );
          questions.push(
            new TextareaQuestion({
              label: 'Comentarios',
              readonly: this.disable,
              nane: item.nane,
              disabled: true,
              idElement: item.idElement ?? 0,
            })
          );
        } else {
          questions.push(
            new CheckboxQuestion({
              label: item.label,
              onlyLabel: item.onlyLabel,
              isRubric: item.isRubric,
              nane: `${item.nane}-check`,
              disabled: this.disable,
              value: item.value ?? true,
              idElement: item.idElement ?? 0,
            })
          );
        }
        index++;
      }
    }
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    for (const item of this.originalQuestions) {
      this.form.get(`${item.nane}-check`)?.valueChanges.subscribe((value) => {
        if (!value) {
          this.form.get(item.nane)?.enable();
        } else {
          this.form.get(item.nane)?.disable();
          this.form.get(item.nane)?.setValue(null);
        }
      });
    }

    if (this.withOutputValueChange) {
      this.valueChange.emit(this.getDataRevision('', 'emit').revision);
      this.form.valueChanges
        .pipe(takeUntil(this.notifier))
        .subscribe((value) => {
          if (value) {
            this.valueChange.emit(this.getDataRevision('', 'emit').revision);
          }
        });
    }
  }

  submit() {
    this.save();
  }

  save() {
    this.validadorService
      .guardar(this.getDataRevision('E', 'internal'), this.fromModule)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
            this.consultarRevison();
            this._alertService.showAlert('Información Guardada');
          }
        },
        error: (err) => { },
      });
  }

  async aprobar() {
    this.submitingAprobar = true;
    const result = await this._alertService.showConfirmation({
      message: '¿Está Seguro de Aprobar la Validación?',
    });
    if (result) {
      if (this.fromModule == 'ap') {
        this.validadorService
          .guardar(this.getDataRevision('D', 'internal'), this.fromModule)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.mensaje.codigo === '200') {
                this._alertService.showAlert('Información Guardada');
                window.location.reload();
              }
            },
            error: (err) => { },
          });
      } else {
        const netDataRevision: IValidationPayload = {
          ...this.getDataRevision('O', 'internal'),
        };
        if (this.idAprobar !== 0) netDataRevision.id = this.idAprobar;
        let consultarFirma: boolean = false;
        if (!this.dataUser.perfilLaboral?.archivoFirma?.idArchivo) {
          consultarFirma = true;
          const fileInAlf = await this.uploadToAlfresco(this.filesToSign);
          netDataRevision.archivos = [fileInAlf];
        } else {
          netDataRevision.archivos = this.fromModule === 'mp' ? [] : null;
        }
        this.validadorService
          .guardar(netDataRevision, this.fromModule)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.mensaje.codigo === '200') {
                if (this.whenFinishGoTo) {
                  this.router.navigate([this.whenFinishGoTo]);
                }
                const message = 'Se Aprobó con Éxito';
                this._alertService.showAlert(message);
                if (consultarFirma) {
                  this.authService
                    .consultarFirma(this.dataUser.cveUsuario)
                    .subscribe({
                      next: (value) => {
                        if (value.mensaje.codigo === '200') {
                          const dataStorage: IDatosUsuario = value.datosUsuario;
                          this.ls.set('dUaStEaR', dataStorage);
                          this.dataUser = dataStorage;
                        }
                      },
                    });
                }
              }
              this.submitingAprobar = false;
            },
            error: (err) => {
              this.submitingAprobar = false;
            },
          });
      }
    } else {
      this.submitingAprobar = false;
    }
  }

  async rechazar() {
    this.submitingRechazar = true;
    const result = await this._alertService.showConfirmation({
      message: '¿Está Seguro de Rechazar la Validación?',
    });
    if (result) {
      const netDataRevision: IValidationPayload = {
        ...this.getDataRevision('R', 'internal'),
        archivos: this.fromModule === 'mp' ? [] : null,
      };
      if (this.idRechazar !== 0) netDataRevision.id = this.idRechazar;

      this.validadorService
        .guardar(netDataRevision, this.fromModule)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200') {
              if (this.whenFinishGoTo) {
                this.router.navigate([this.whenFinishGoTo]);
              }
              const message = 'Se Rechazó con Éxito';
              this._alertService.showAlert(message);
            }
            this.submitingRechazar = false;
          },
          error: (err) => {
            this.submitingRechazar = false;
          },
        });
    } else {
      this.submitingRechazar = false;
    }
  }

  getDataRevision(estatus: string, from: 'internal' | 'emit'): any {
    let tmpRevision: any[] = [];
    for (const item of this.originalQuestions) {
      if (item.controlType !== 'checkbox' && item.idElement !== 0) {
        tmpRevision.push({
          idElemento: item.idElement,
          check: this.form.get(`${item.nane}-check`)?.value ? 1 : 0,
          comentarios:
            this.form.get(`${item.nane}`)?.value === ''
              ? null
              : this.form.get(`${item.nane}`)?.value,
        });
      }
    }

    if (this.extraDataRevision?.length > 0 && from === 'internal') {
      tmpRevision = tmpRevision.concat(this.extraDataRevision);
    }
    let dataRevision = {};
    if (this.fromModule == 'ap') {
      dataRevision = {
        apartado: this.apartado,
        id: this.idActividad,
        cveUsuario: this.dataUser.cveUsuario,
        estatus,
        revision: tmpRevision,
        rubrica: this.listRubrics,
        archivos: [],
        trimestre: this.trimestre,
      };
    } else {
      dataRevision = {
        apartado: this.apartado,
        id: this.idSave,
        cveUsuario: this.dataUser.cveUsuario,
        estatus,
        revision: tmpRevision,
        rubrica: this.listRubrics,
      };
    }

    return dataRevision;
  }

  responseFileUpload(files: any[]) {
    this.filesToSign = files;
  }

  uploadToAlfresco(files: any[]) {
    return new Promise<any>((resolve, reject) => {
      const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
      let fileTmp: any = null;
      if (files.length > 0) {
        this.isUploadFile = true;
        fileTmp = files[0];
        this.alfrescoService
          .uploadFileAlfService(dataAlf.uuidPlaneacion, fileTmp)
          .subscribe({
            next: (value) => {
              this.isUploadFile = false;
              resolve({
                idArchivo: null,
                csEstatus: 'A',
                cxNombre: fileTmp.name,
                cveUsuario: this.dataUser.cveUsuario,
                cxUuid: value.entry.id,
              });
            },
            error: (err) => {
              this.isUploadFile = false;
              reject(err);
            },
          });
      }
    });
  }

  openRubric(): void {
    const dataRubric: IRubricaComponent = {
      listRubrics: this.listRubrics,
      disable: true,
      docAnalitico: this.docAnalitico,
      totalRubric: this.totalRubric,
    };
    if (this.selectedActividad)
      this.ls.set('selectedActividad', this.selectedActividad);
    if (this.selectedProducto)
      this.ls.set('selectedProducto', this.selectedProducto);
    this.ls.set('selectedRubric', dataRubric);
    this.router.navigateByUrl(
      '/Planeación/Planeación a Corto Plazo/Revisión y Validación/Revisión Planeación/Rúbrica'
    );
  }

  ngOnDestroy(): void {
    document.querySelector('.can-validate')?.classList.remove('validate');
    document.querySelector('footer')?.classList.remove('validate');
    this.notifier.complete();
  }
}
