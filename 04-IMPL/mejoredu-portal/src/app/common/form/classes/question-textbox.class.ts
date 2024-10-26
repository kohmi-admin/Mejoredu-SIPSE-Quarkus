import { QuestionBase } from './question-base.class';

export class TextboxQuestion extends QuestionBase<any> {
  override controlType = 'textbox';
}
