import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IMessageApi,
  IResponseApi,
} from '@common/interfaces/response-api.interface';
import { IConsultaPorFiltrosPayload } from '@common/interfaces/seguimiento/consultaPorFiltros.interface';
import { IConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';
import { IRegisterSolicitudResponse, IRegistrarSolicitudPayload } from '@common/interfaces/seguimiento/registrarSolicitud';

import { ISecuencialSeguimientoResponse } from '@common/interfaces/seguimiento/secuencialSeguimiento';
import { ISolSeguimientoResponse } from '@common/interfaces/seguimiento/solicitudSeguimiento';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudSeguimientoService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.solicitudSeguimiento.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  consultaPorFiltros(cveUsuario: string, filtros: IConsultaPorFiltrosPayload) {
    const headers = this.getHeaders();
    return this.http.patch<ISolSeguimientoResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudSeguimiento
          .consultaPorUsuario
      )}${cveUsuario}`,
      filtros,
      {
        headers,
      }
    );
  }

  registrarSolicitud(data: IRegistrarSolicitudPayload) {
    const headers = this.getHeaders();
    return this.http.post<IRegisterSolicitudResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudSeguimiento
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  actualizarSolicitud(idSolicitud: number, data: IRegistrarSolicitudPayload) {
    const headers = this.getHeaders();
    return this.http.put<IMessageApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudSeguimiento
          .actualizaPorIdSolicitud
      )}${idSolicitud}`,
      data,
      { headers }
    );
  }

  getSecuencialSeguimiento(cveUnidad: string) {
    const headers = this.getHeaders();
    return this.http.get<ISecuencialSeguimientoResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudSeguimiento
          .secuencialPorAnhio
      )}${cveUnidad}`,
      {
        headers,
      }
    );
  }

  consultaPorIdSolicitud(idSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<IConsultaSolicitudResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudSeguimiento
          .consultaPorIdSolicitud
      )}${idSolicitud}`,
      {
        headers,
      }
    );
  }

  cambiarEstatusSolicitud(
    idEstatus: number,
    idSolicitud: number,
    cveUsuario: string
  ) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudSeguimiento
          .cambiarEstatus
      )}${idEstatus}/${idSolicitud}/${cveUsuario}`,
      {},
      {
        headers,
      }
    );
  }
}
