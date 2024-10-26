import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

@Injectable()
export class MatPaginatorIntlSpanish extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por Página:';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primera Página';
  override lastPageLabel = 'Última Página';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const start = page * pageSize + 1;
    const end = (page + 1) * pageSize > length ? length : (page + 1) * pageSize;
    return `${start} - ${end} de ${length}`;
  }
}
