import { QuestionBase } from './question-base.class';

export class NumberQuestion extends QuestionBase<any> {
  override controlType = 'number';
}
