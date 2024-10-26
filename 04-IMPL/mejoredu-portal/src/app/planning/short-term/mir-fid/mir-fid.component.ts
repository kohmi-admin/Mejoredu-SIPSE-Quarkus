import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-mir-fid',
  templateUrl: './mir-fid.component.html',
  styleUrls: ['./mir-fid.component.scss'],
})
export class MirFidComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tbl') table!: ElementRef;
  private _body = document.querySelector('body');

  constructor() {
    this._body?.classList.add('hideW');
  }

  ngAfterViewInit(): void {
    const table = this.table.nativeElement;
    const td = table.querySelectorAll('td.editable');
    for (let i = 0; i < td.length; i++) {
      td[i].addEventListener('click', (item: any) => {
        const isWrapper = item.target.classList.contains('editable');
        if (isWrapper) {
          const div = td[i].getElementsByTagName('div');
          if (div) {
            div[0].focus();
          }
        }
      });
      const divs = td[i].getElementsByTagName('div');
      if (divs) {
        const div = divs[0];
        div.addEventListener('focus', (item: any) => {
          this.focusEnd(div);
        });
      }
    }
  }

  focusEnd(content: any): void {
    try {
      var selected: any = window.getSelection();
      var range = document.createRange();
      if (!content.childNodes[0]) {
        const newtext = document.createTextNode('');
        content.appendChild(newtext);
      }
      let position = content.innerText.length + 1;
      if (position > content.childNodes[0].length) {
        position = content.innerText.length;
      }
      range.setStart(content.childNodes[0], position);
      range.collapse(true);
      selected.removeAllRanges();
      selected.addRange(range);
    } catch (error) { }
    content.focus();
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }
}
