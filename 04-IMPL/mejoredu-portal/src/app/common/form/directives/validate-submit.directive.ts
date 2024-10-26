import { Directive, Self, HostListener } from '@angular/core';
  import { ControlContainer } from '@angular/forms';

  @Directive({
    selector: 'form[formGroup]'
  })
  export class ValidateSubmitDirective {
    constructor(
      @Self() private container: ControlContainer
    ) {}

    @HostListener('submit')
    public onSubmit(): void {
      this.container.control?.markAllAsTouched();
    }
  }