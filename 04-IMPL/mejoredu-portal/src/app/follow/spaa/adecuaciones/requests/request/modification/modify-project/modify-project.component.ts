import { Component, Input } from '@angular/core';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';

@Component({
  selector: 'app-modify-project',
  templateUrl: './modify-project.component.html',
  styleUrls: ['./modify-project.component.scss'],
})
export class ModifyProjectComponent {
  @Input() catClaveNombreUnidadResponsableR!: ICatalogResponse;
  @Input() catObjetivosPrioritarioR!: ICatalogResponse;
  @Input() catContribucionProgramasEspecialesR!: ICatalogResponse;
  @Input() catContribucionPNCCIMGPR!: ICatalogResponse;
}
