import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TableColumn } from '@common/models/tableColumn';
import { CommonStructure } from '../classes/common-structure.class';
import { StateViewService } from '../../../services/state-view.service';

@Component({
  selector: 'app-public-problems',
  templateUrl: './public-problems.component.html',
  styleUrls: ['./public-problems.component.scss', '../structure.component.scss']
})
export class PublicProblemsComponent extends CommonStructure {
  override columns: TableColumn[] = [
    { columnDef: 'name', header: 'Problema Público', alignLeft: true },
  ]

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
  ) {
    super();
    this.questions = [
      new TextareaQuestion({
        nane: 'ProblemasP',
        label: 'Problemas Públicos',
        icon: 'help',
        message: 'Alfanumérico, 3400 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this._stateViewService.editable) {
      this.form.disable();
      this.actions = undefined;
      this.editable = false;
    }
    this.validation = this._stateViewService.validation;
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.data = [...this.data, {
      record: this.form.getRawValue().ProblemasP
    }];
    this.form.reset();
  }
}
