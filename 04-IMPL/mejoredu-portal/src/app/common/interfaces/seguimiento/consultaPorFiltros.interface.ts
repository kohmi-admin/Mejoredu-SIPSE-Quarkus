export interface IConsultaPorFiltrosPayload {
  fechaSolicitud?: string;
  fechaAutorizacion?: string;
  idCatalogoUnidad?: number;
  idCatalogoAnhio?: number;
  idCatalogoAdecuacion?: number;
  idCatalogoModificacion?: number[];
  idCatalogoEstatus?: number;
  cambiaIndicadores?: boolean;
}
