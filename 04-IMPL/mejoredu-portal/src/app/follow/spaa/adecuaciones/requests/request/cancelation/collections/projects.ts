import { Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';

export const projectsQuestions: QuestionBase<any>[] = [
  new DropdownQuestion({
    nane: 'nombreProyecto',
    label: 'Nombre del Proyecto',
    filter: true,
    validators: [Validators.required],
  }),
];
