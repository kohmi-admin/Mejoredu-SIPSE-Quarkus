import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FromModalI } from './interfaces/form-modal.interface';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { ICatalogPayload, IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  title: string = '';
  action: string = '';
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  dataUser: IDatosUsuario;

  catalogHijo!: IItemCatalogoResponse;
  catalogPadre: IItemCatalogoResponse;

  isNew!: boolean;

  constructor(
    public dialogRef: MatDialogRef<FormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FromModalI,
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private catalogosService: CatalogsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.catalogPadre = this.data.catalogPadre;
    if (this.data?.catalogHijo) {
      this.title = 'Editar Registro';
      this.action = 'Editar';
      this.catalogHijo = this.data.catalogHijo;
      if (this.data.onlyView) {
        this.title = 'Visualizando Registro';
      }
    } else {
      this.title = 'Agregar Registro';
      this.action = 'Agregar';
      this.isNew = true;
    }

    this.questions = [
      new TextboxQuestion({
        nane: 'id',
        label: 'Clave',
        value: data?.id,
        validators: [Validators.required],
      }),
      new TextareaQuestion({
        nane: 'value',
        label: 'Descripción',
        value: data?.value,
        validators: [Validators.required],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (data?.onlyView) {
      this.form.disable();
    }
  }

  submit() {
    const { id, value } = this.form.getRawValue();
    const payload: ICatalogPayload = {
      cdOpcion: value,
      ccExterna: id,
      cveUsuario: this.dataUser.cveUsuario
    }
    if(this.isNew){
      payload.idCatalogoPadre = this.catalogPadre.idCatalogo;
      this.catalogosService.agregarRegistroCatalgo(payload)
        .subscribe({
          next: (value) => {
            if(value.codigo == '200'){
              this._alertService.showAlert('Se Guardó Correctamente');
              this.dialogRef.close(true);
            }
          }
        })
    } else {
      this.catalogosService.actualizarCatalogo(this.catalogHijo.idCatalogo, payload)
        .subscribe({
          next: (value) => {
            if(value.mensaje.codigo == '200'){
              this._alertService.showAlert('Se Actualizó Correctamente');
              this.dialogRef.close(true);
            }
          }
        })
    }
  }

}
