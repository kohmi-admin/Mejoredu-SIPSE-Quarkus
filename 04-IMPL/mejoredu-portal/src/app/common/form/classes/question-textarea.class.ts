import { QuestionBase } from './question-base.class';

export class TextareaQuestion extends QuestionBase<any> {
  override controlType = 'textarea';
}
