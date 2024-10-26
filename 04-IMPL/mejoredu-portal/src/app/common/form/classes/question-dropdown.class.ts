import { QuestionBase } from './question-base.class';

export class DropdownQuestion extends QuestionBase<any> {
  override controlType = 'dropdown';
}
