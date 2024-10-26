import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { EnviarCorreoPayload } from '@common/interfaces/configuration/notificador.interface';
import { AlertService } from '@common/services/alert.service';
import { NotificacionesService } from '@common/services/configuration/notificaciones.service';
import { UsuariosService } from '@common/services/configuration/usuarios.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: [
    '../configuration.component.scss',
    './notificaciones.component.scss',
  ],
})
export class NotificacionesComponent {
  editable: boolean = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];

  loading: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private alertService: AlertService,
    private usuariosService: UsuariosService,
    private notificacionesService: NotificacionesService
  ) {
    this.buildForm();
    this.getData();
  }

  buildForm() {
    this.questions = [
      new DropdownQuestion({
        nane: 'sentTo',
        label: 'Enviar a',
        filter: true,
        validators: [Validators.required, Validators.maxLength(100)],
        multiple: true,
      }),
      new TextboxQuestion({
        nane: 'otros',
        label: 'Otros Correos',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      new TextboxQuestion({
        nane: 'title',
        label: 'Título',
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      new TextareaQuestion({
        nane: 'message',
        label: 'Mensaje',
        validators: [Validators.required, Validators.maxLength(400)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('sentTo')?.valueChanges.subscribe((value) => {
      if (value?.includes('Otro')) {
        this.form.get('otros')?.enable();
      } else {
        this.form.get('otros')?.disable();
      }
    });
  }

  getData() {
    this.usuariosService.getAllUsuarios().subscribe({
      next: (value) => {
        let correos = value.map((usuario) => ({
          id: usuario.correo,
          value: usuario.correo,
        }));
        correos.push({ id: 'Otro', value: 'Otro (s)' });
        this.questions[0].options = correos;
      },
    });
  }

  validateEmeil(email: string) {
    return /^[^\s@]{1,50}@[^\s@]{1,50}\.[^\s@]{2,10}$/.test(email);
  }

  buildEmailsList() {
    let emails: string[] = this.form
      .get('sentTo')
      ?.value?.filter((i) => i !== 'Otro');
    let emailsOthers: string[] = this.form.get('otros')?.value?.split(',');
    emailsOthers?.map((item) => (item ? emails.push(item.trim()) : true));

    const tmpEmail: { error: string[]; success: string[] } = {
      error: [],
      success: [],
    };

    for (const item of emails ?? []) {
      if (this.validateEmeil(item)) {
        tmpEmail.success.push(item);
      } else {
        tmpEmail.error.push(item);
      }
    }
    return tmpEmail;
  }

  clearForm() {
    this.form.reset();
  }

  disableForm() {
    this.form.disable();
  }

  enableForm() {
    this.form.enable();
  }

  submit() {
    const emailsList = this.buildEmailsList();
    const { message, title } = this.form.getRawValue();

    if (emailsList.error.length) {
      this.loading = false;
      this.alertService.showAlert(
        'Uno o más Correos no son Validos, por Favor Reviselos para Poder Continuar.'
      );
    } else if (message && title && emailsList.success.length) {
      this.loading = true;
      let payload: EnviarCorreoPayload = {
        asunto: title,
        cuerpo: message,
        correos: emailsList.success,
      };
      this.notificacionesService.enviarCorreo(payload).subscribe({
        next: (value) => {
          if (value.mensaje.codigo == '200') {
            this.alertService.showAlert('Se Envió Correctamente');
            this.clearForm();
            this.loading = false;
          }
        },
        error: (err) => {
          this.loading = false;
        },
      });
    }
  }
}
