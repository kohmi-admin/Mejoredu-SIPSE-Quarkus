import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IJustifiacionActividadPayload,
  IJustifiacionIndicadorPayload,
  IJustificacionActividadResponse,
  IJustificacionIndicadorResponse,
  JustificacionActividadResponse,
  JustificacionIndicadorResponse,
} from '@common/interfaces/seguimientoMirFid/justificacion.interface';
import { IConsultaMirPorAnhioResponse } from '@common/interfaces/seguimientoMirFid/mirFid.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class P016Service {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  getMirByAnhio(anhio: number) {
    const headers = this.getHeaders();
    return this.http.get<IConsultaMirPorAnhioResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID
          .consultaMirPorAnhio
      )}${anhio}`,
      {
        headers,
      }
    );
  }

  justificacionActividad(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IJustificacionActividadResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID
          .justificacionActividad
      )}`,
      data,
      {
        headers,
      }
    );
  }

  consultajustificaciones(anhio: number | string, trimestre: number) {
    const headers = this.getHeaders();
    return this.http.get<IJustificacionActividadResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID
          .consultaJustifiaciones
      )}${anhio}/${trimestre}`,
      {
        headers,
      }
    );
  }

  justificacionIndicador(data: IJustifiacionIndicadorPayload) {
    const headers = this.getHeaders();
    return this.http.post<IJustificacionIndicadorResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID
          .justificacionIndicador
      )}`,
      data,
      {
        headers,
      }
    );
  }

  getJustificacionIndicador(indicador: number) {
    const headers = this.getHeaders();
    return this.http.get<JustificacionIndicadorResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID
          .consultarJustificacionIndicador
      )}${indicador}`,
      {
        headers,
      }
    );
  }

  getJustificacionActividad(actividad: number, trimestre: number) {
    const headers = this.getHeaders();
    return this.http.get<JustificacionActividadResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID
          .consultarJustificacionActividad
      )}${actividad}/${trimestre}`,
      {
        headers,
      }
    );
  }
}
