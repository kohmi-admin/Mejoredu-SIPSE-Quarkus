import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-module-btn',
  templateUrl: './module-btn.component.html',
  styleUrls: ['./module-btn.component.scss']
})
export class ModuleBtnComponent {
  @Input() imgIcon?: string;
  @Input() icon: string = 'search';
  @Input() title: string = 'Ttile';
  @Input() active: boolean = false;
  @Input() horizontal: boolean = false;
  @Input() description: string = 'Description';
  @Input() enable: boolean = true;
  @Input() finish: boolean = false;
  @Input() canDownload: boolean = false;
  @Input() color: string = 'white';
  @Output() click: EventEmitter<void> = new EventEmitter();
  @Output() download: EventEmitter<void> = new EventEmitter();

  emmitDownload(event: any): void {
    event.stopPropagation();
    this.download.emit();
  }
}
