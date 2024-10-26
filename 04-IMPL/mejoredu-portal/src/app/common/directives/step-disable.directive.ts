import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[step-disable]'
})
export class StepDisableDirective implements OnChanges {
  @Input() public disabled: boolean = true;

 public ngOnChanges(changes: SimpleChanges): void {
   this.disabled? this.disable() : this.enable();
 }
   
  private enable(): void {
    const el:HTMLElement  = this.getElement();
    el.classList.add('mat-step-disabled');
  }

  private disable(): void {
    const el:HTMLElement  = this.getElement();
    el.classList.remove('mat-step-disabled');
  }

  private getElement(): HTMLElement {
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('mat-step-header');
    const matStepHeader = elements[0] as HTMLElement;    // Take the first step, you want to pass your index via an Input parameter
    return matStepHeader;
  }    
}
