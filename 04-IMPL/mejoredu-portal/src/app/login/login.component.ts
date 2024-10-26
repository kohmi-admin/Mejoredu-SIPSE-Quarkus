import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '@common/modal/modal.service';
import * as SecureLS from 'secure-ls';
import { AlfrescoService } from '@common/services/alfresco.service';
import { AuthService } from '@common/services/auth.service';
import {
  IDatosUsuario,
  ILoginPayload,
  ILoginResponse,
} from '@common/interfaces/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  ls = new SecureLS({ encodingType: 'aes' });
  loading: boolean = false;
  loginForm!: FormGroup;
  aboutForm!: FormGroup;
  showAboutModal: boolean = false;
  questions: QuestionBase<string>[] = [];
  bodyPdf;
  aboutQuestions: QuestionBase<string>[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _router: Router,
    public dialog: MatDialog,
    public _modal: ModalService,
    private alfService: AlfrescoService,
    private loginService: AuthService
  ) {
    this.questions = [
      new TextboxQuestion({
        nane: 'userName',
        label: 'Usuario',
        icon: 'person',
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        nane: 'password',
        label: 'Contraseña',
        type: 'password',
        icon: 'key',
        validators: [Validators.required],
      }),
    ];

    this.loginForm = this._formBuilder.toFormGroup(this.questions);
  }

  async ngOnInit(): Promise<void> {
    this.buildAboutForm();
  }

  buildAboutForm(): void {
    this.aboutQuestions = [
      new TextboxQuestion({
        nane: 'name',
        label: 'Nombre',
        validators: [Validators.required],
      }),
      new TextboxQuestion({
        nane: 'email',
        label: 'Correo Electrónico',
        validators: [Validators.required, Validators.email],
      }),
      new TextboxQuestion({
        nane: 'subject',
        label: 'Asunto',
        validators: [Validators.required],
      }),
      new TextareaQuestion({
        nane: 'message',
        label: 'Mensaje',
        validators: [Validators.required],
      }),
    ];
    this.aboutForm = this._formBuilder.toFormGroup(this.aboutQuestions);
  }

  async submit(): Promise<void> {
    if (!this.loginForm.valid) return;
    this.loading = true;
    this.loginForm.disable();
    const { userName, password } = this.loginForm.getRawValue();
    try {
      const data: ILoginPayload = {
        clave: userName,
        contrasenha: password,
      };
      this.loginService.login(data).subscribe({
        next: (value: ILoginResponse) => {
          if (value.datosUsuario?.csStatus === 'A') {
            this.loginAlfresco();
            this._router.navigate(['/']);
            const dataStorage: IDatosUsuario = value.datosUsuario;
            this.ls.set('dUaStEaR', dataStorage);
          } else {
            this.loading = false;
            this.loginForm.enable();
            this._modal.openGenericModal({
              idModal: 'modal-disabled',
              component: 'generic',
              data: {
                text: 'La autenticación ha fallado. Comuniquese a la extensión #999.',
                labelBtnPrimary: 'Aceptar',
              },
            });
          }
        },
        error: (err) => {
          this.loading = false;
          this.loginForm.enable();
        },
      });
    } catch (error: any) { }
  }

  loginAlfresco() {
    this.alfService.loginAlfService().subscribe((response) => {
      this.ls.set('dataAlf', response);
    });
  }

  async submitHelp(): Promise<void> { }

  toggleAboutModal(): void {
    this.showAboutModal = !this.showAboutModal;
  }
}
