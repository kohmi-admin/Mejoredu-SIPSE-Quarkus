import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IProjectsResponse,
  IProyectoPayloadDelete,
} from '@common/interfaces/projects.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { ISecuenciaProyectoAnual } from '@common/interfaces/secuencia.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdecuacionService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.adecuacion.path}`;
  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  cambiarEstatus(idEstatus: number, idAdecuacion: number, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.adecuacion
          .cambiarEstatus
      )}${idEstatus}/${idAdecuacion}/${cveUsuario}`,
      {},
      {
        headers,
      }
    );
  }
}
