import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {
  @Input() icon: string = 'search';
  @Input() title: string = 'Ttile';
  @Input() imgIcon?: string;
  first: string = '';
  @Input() active: boolean = false;
  @Input() description: string = 'Description';
  @Input() enable: boolean = true;
  @Input() finish: boolean = false;
  @Input() canDownload: boolean = false;
  @Output() click: EventEmitter<void> = new EventEmitter();
  @Output() download: EventEmitter<void> = new EventEmitter();

  emmitDownload(event: any): void {
    event.stopPropagation();
    this.download.emit();
  }

  constructor() {
  }
  ngOnInit(): void {
    this.first = this.title.charAt(0);
    this.title = this.title.slice(1);
  }
}
