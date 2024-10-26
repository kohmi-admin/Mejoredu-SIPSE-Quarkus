import { QuestionBase } from "@common/form/classes/question-base.class";
import { projectsQuestions } from "./projects";
import { TextboxQuestion } from "@common/form/classes/question-textbox.class";
import { Validators } from "@angular/forms";
import { DropdownQuestion } from "@common/form/classes/question-dropdown.class";

export const productsQuestions: QuestionBase<any>[] = [
  ...projectsQuestions,
  new DropdownQuestion({
    nane: 'nombreActividad',
    label: 'Nombre de la Actividad',
    disabled: true,
    type: 'text',
    validators: [Validators.required],
  }),
  new TextboxQuestion({
    nane: 'numeroProducto',
    label: 'Número del Producto',
    disabled: true,
    type: 'text',
  }),
  new TextboxQuestion({
    nane: 'claveProducto',
    label: 'Clave del Producto',
    disabled: true,
    type: 'text',
  }),
  new DropdownQuestion({
    nane: 'nombreProducto',
    label: 'Nombre del Producto',
    disabled: true,
    type: 'text',
    validators: [Validators.required],
  }),
];
