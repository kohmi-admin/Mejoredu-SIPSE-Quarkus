import { QuestionBase } from './question-base.class';

export class DateQuestion extends QuestionBase<any> {
  override controlType = 'date';
}
