import { Component } from '@angular/core';
import { CommonStructure } from '../classes/common-structure.class';
import { TableColumn } from '@common/models/tableColumn';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { Validators } from '@angular/forms';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { StateViewService } from '../../../services/state-view.service';

@Component({
  selector: 'app-relevance-priority-objectives',
  templateUrl: './relevance-priority-objectives.component.html',
  styleUrls: ['./relevance-priority-objectives.component.scss', '../structure.component.scss']
})
export class RelevancePriorityObjectivesComponent extends CommonStructure {
  override columns: TableColumn[] = [
    { columnDef: 'name', header: 'Objetivos Prioritarios', alignLeft: true },
    { columnDef: 'Relevancia', header: 'Relevancia', alignLeft: true },
  ]

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
  ) {
    super();
    this.questions = [
      new DropdownQuestion({
        nane: 'Objetivo Prioritario',
        label: 'Objetivo Prioritario',
        options: [
          {
            id: 1,
            value: 'Opción 1'
          }
        ],
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
      new TextareaQuestion({
        nane: 'Relevancia',
        label: 'Relevancia de los Objetivos Prioritarios',
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
  }
}