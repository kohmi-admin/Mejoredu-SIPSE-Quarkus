import { Component } from '@angular/core';
import { CommonStructure } from '../classes/common-structure.class';
import { TableColumn } from '@common/models/tableColumn';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { Validators } from '@angular/forms';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { StateViewService } from '../../../services/state-view.service';

@Component({
  selector: 'app-specific-actions',
  templateUrl: './specific-actions.component.html',
  styleUrls: ['./specific-actions.component.scss', '../structure.component.scss']
})
export class SpecificActionsComponent extends CommonStructure {
  override columns: TableColumn[] = [
    { columnDef: 'name', header: 'Objetivos Prioritarios', alignLeft: true },
    { columnDef: 'Estrategia', header: 'Estrategia Prioritaria', alignLeft: true },
    { columnDef: 'Acción', header: 'Acción Puntual', alignLeft: true },
  ];

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
  ) {
    super();
    this.questions = [
      new DropdownQuestion({
        nane: 'Acciones',
        label: 'Objetivos Prioritarios',
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'Estrategia Prioritaria',
        label: 'Estrategia Prioritaria',
        validators: [Validators.required],
      }),
      new TextboxQuestion({
        nane: 'Número',
        label: 'Número',
        disabled: true,
        validators: [Validators.required],
      }),
      new TextboxQuestion({
        nane: 'Acción Puntual',
        label: 'Acción Puntual',
        validators: [Validators.required, Validators.maxLength(200)],
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
  }
}
