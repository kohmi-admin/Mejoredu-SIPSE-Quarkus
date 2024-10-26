import { Component, Input } from '@angular/core';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';

@Component({
  selector: 'app-modify-activity',
  templateUrl: './modify-activity.component.html',
  styleUrls: ['./modify-activity.component.scss']
})
export class ModifyActivityComponent {
  @Input() catObjetivosPrioritarioR!: ICatalogResponse;
  @Input() catEstrategiaPrioritariaR!: ICatalogResponse;
  @Input() catAccionPuntualPIR!: ICatalogResponse;
  @Input() catAlcanceR!: ICatalogResponse;
}
