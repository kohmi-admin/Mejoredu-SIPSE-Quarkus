import { ValidatorFn } from '@angular/forms';
import { OptionI } from '../interfaces/option.interface';
import { EventEmitter } from '@angular/core';

export class QuestionBase<T> {
  value: any;
  nane: string;
  label: string;
  controlType: string;
  type: string;
  icon: string;
  multiple: boolean;
  disabled: boolean;
  message: string;
  readonly: boolean;
  validators: ValidatorFn[];
  optionsArray: OptionI[];
  filter: boolean;
  visible: boolean;
  onlyLabel: boolean = false;
  idElement: number;
  isRubric: boolean;
  rows: number | null;
  public optionsUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    options: {
      value?: T;
      nane?: string;
      label?: string;
      controlType?: string;
      type?: string;
      icon?: string;
      multiple?: boolean;
      disabled?: boolean;
      message?: string;
      readonly?: boolean;
      validators?: ValidatorFn[];
      options?: { id: any; value: string }[];
      filter?: boolean;
      visible?: boolean;
      onlyLabel?: boolean;
      idElement?: number;
      isRubric?: boolean;
      rows?: number | null;
    } = {}
  ) {
    this.value = options.value;
    this.nane = options.nane || '';
    this.label = options.label || '';
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.icon = options.icon || '';
    this.multiple = options.multiple || false;
    this.disabled = options.disabled || false;
    this.message = options.message || '';
    this.readonly = options.readonly || false;
    this.validators = options.validators || [];
    this.optionsArray = options.options || [];
    this.filter = options.filter || false;
    this.visible = options.visible === undefined ? true : options.visible;
    this.onlyLabel = options.onlyLabel || false;
    this.idElement = options.idElement || 0;
    this.isRubric = options.isRubric || false;
    this.rows = options.rows || null;
  }

  public set options(options: OptionI[]) {
    this.optionsArray = options;
    this.optionsUpdate.emit();
  }
}
