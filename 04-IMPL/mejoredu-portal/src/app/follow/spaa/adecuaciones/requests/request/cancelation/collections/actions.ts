import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { Validators } from '@angular/forms';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { projectsQuestions } from './projects';

export const actionsQuestions: QuestionBase<any>[] = [
  ...projectsQuestions,
  new DropdownQuestion({
    nane: 'nombreActividad',
    label: 'Nombre de la Actividad',
    disabled: true,
    filter: true,
    validators: [Validators.required, Validators.maxLength(200)],
  }),
  new DropdownQuestion({
    nane: 'nombreProducto',
    label: 'Nombre del Producto',
    disabled: true,
    filter: true,
    validators: [Validators.required],
  }),
  new TextboxQuestion({
    nane: 'claveAccion',
    label: 'Clave de la Acción',
    disabled: true,
    validators: [Validators.required],
  }),
  new DropdownQuestion({
    nane: 'nombreAccion',
    label: 'Nombre de la Acción',
    disabled: true,
    filter: true,
    validators: [Validators.required, Validators.maxLength(90)],
  }),
  new TextboxQuestion({
    nane: 'claveNivelEducativo',
    label: 'Clave del Nivel Educativo',
    disabled: true,
    validators: [Validators.required, Validators.maxLength(100)],
  }),
  new TextboxQuestion({
    nane: 'claveUnidad',
    label: 'Clave de Unidad',
    disabled: true,
    validators: [Validators.required, Validators.maxLength(100)],
  }),
];
