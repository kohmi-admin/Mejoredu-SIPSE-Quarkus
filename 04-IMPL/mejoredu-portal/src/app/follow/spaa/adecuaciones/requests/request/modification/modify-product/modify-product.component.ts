import { Component, Input } from '@angular/core';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.scss']
})
export class ModifyProductComponent {
  @Input() catCategoriaR!: ICatalogResponse;
  @Input() catTipoProductoR!: ICatalogResponse;
  @Input() catNombreIndicadorMIRR!: ICatalogResponse;
  @Input() catIndicadorPIR!: ICatalogResponse;
  @Input() catObjetivosPrioritarioR!: ICatalogResponse;
  @Input() catContinuidadOtrosProductosAnhosAnterioresR!: ICatalogResponse;
  @Input() catAnhoPublicarR!: ICatalogResponse;
  @Input() catNivelEducativoR!: ICatalogResponse;
}
