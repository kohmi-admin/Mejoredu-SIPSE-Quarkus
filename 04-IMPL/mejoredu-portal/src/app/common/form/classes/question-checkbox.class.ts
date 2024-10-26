import { QuestionBase } from './question-base.class';

export class CheckboxQuestion extends QuestionBase<boolean> {
  override controlType = 'checkbox';
}
