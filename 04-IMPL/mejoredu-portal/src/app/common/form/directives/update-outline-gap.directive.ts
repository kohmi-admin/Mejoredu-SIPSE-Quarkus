import { AfterViewInit, Directive } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';


@Directive({
  selector: 'mat-form-field'
})
export class UpdateOutlineGapDirective {
  constructor(private formField: MatFormField) {
  }

  ngAfterViewInit() {
      document.fonts.ready.then(() => {
        if (!this.ensureParent()) {
          return;
        }
        const element = this.formField._elementRef.nativeElement;
        const label = element.querySelector('mat-label');
        const marker = element.querySelector('.mat-mdc-form-field-required-marker');

        let calc =  label.offsetWidth * (1 + (12.31 / 100));
        if (marker) {
          calc += marker.offsetWidth;
        }

        this.formField._labelWidth = calc;
      });
  }

  ensureParent() {
    const partent: any = this.formField._elementRef.nativeElement.offsetParent;
    if (partent?.className.includes('mat-mdc-dialog-surface')) {
      return true;
    }
    return false;
  }
}
