import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwitchI } from '../general-data/interfaces/switch.interface';
import { AlternSwitchService } from './services/altern-switch.service';
import { getModificationType } from '../general-data/utils/utils';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { TIPO_ADECUACION } from '../enum/tipoAdecuacion.enum';

@Component({
  selector: 'app-altern-switch',
  templateUrl: './altern-switch.component.html',
  styleUrls: ['./altern-switch.component.scss'],
})
export class AlternSwitchComponent implements OnInit {
  @Input() switch!: SwitchI;
  @Input() tipoAdecuacion: number = 0;
  value?: number;
  @Output() changeModification: EventEmitter<number> =
    new EventEmitter<number>();
  modificationTypeEnum = MODIFICATION_TYPE;
  tipoAdecuacionEnum = TIPO_ADECUACION;
  constructor(private _alternSwitchService: AlternSwitchService) { }

  ngOnInit(): void {
    this.value = getModificationType(this.switch);
    this.emmit();
    this.tipoAdecuacion = this._alternSwitchService.getAdecuation();
  }

  emmit() {
    this.changeModification.emit(this.value);
  }
}
