import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { Validators } from '@angular/forms';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { projectsQuestions } from './projects';

export const budgetsQuestions: QuestionBase<any>[] = [
  ...projectsQuestions,
  new DropdownQuestion({
    nane: 'nombreActividad',
    label: 'Nombre de la Actividad',
    filter: true,
    validators: [Validators.required, Validators.maxLength(200)],
  }),
  new DropdownQuestion({
    nane: 'nombreProducto',
    label: 'Nombre del Producto',
    filter: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    nane: 'nombreAccion',
    label: 'Nombre de la Acción',
    validators: [Validators.required, Validators.maxLength(90)],
  }),
];
