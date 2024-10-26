import { Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { projectsQuestions } from './projects';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';

export const activitiesQuestions: QuestionBase<any>[] = [
  ...projectsQuestions,
  new TextboxQuestion({
    nane: 'claveProyecto',
    label: 'Clave del Proyecto',
    disabled: true,
    type: 'text',
  }),
  new TextboxQuestion({
    nane: 'claveActividad',
    label: 'Clave de la Actividad',
    disabled: true,
    type: 'text',
  }),
  new DropdownQuestion({
    nane: 'nombreActividad',
    label: 'Nombre de la Actividad',
    disabled: true,
    type: 'text',
    validators: [Validators.required],
  }),
];
