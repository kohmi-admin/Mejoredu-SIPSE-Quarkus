import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessageApi, IResponseApi } from '@common/interfaces/response-api.interface';
import { IRegistrarComentarioPayload, IRegistrarComentarioResponse } from '@common/interfaces/seguimiento/registrarComentario.interface';
import { IRegisterSolicitudResponse } from '@common/interfaces/seguimiento/registrarSolicitud';
import { ISecuencialSeguimientoResponse } from '@common/interfaces/seguimiento/secuencialSeguimiento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudComentariosService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.solicitudComentarios.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  getComentarioPorId(idComentario: number) {
    const headers = this.getHeaders();
    return this.http.get<IRegistrarComentarioResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudComentarios
          .consultaPorId
      )}${idComentario}`,
      {
        headers,
      }
    );
  }

  getComentarioPorIdSolicitud(idSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<IRegistrarComentarioResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudComentarios
          .consultaPorIdSolicitud
      )}${idSolicitud}`,
      {
        headers,
      }
    );
  }

  registrarComentario(data: IRegistrarComentarioPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudComentarios
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  actualizarComentario(
    idComentario: number,
    data: IRegistrarComentarioPayload
  ) {
    const headers = this.getHeaders();
    return this.http.put<IMessageApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudComentarios
          .actualizaPorId
      )}${idComentario}`,
      data,
      { headers }
    );
  }

  eliminarComentario(idComentario: number) {
    const headers = this.getHeaders();
    return this.http.delete<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudComentarios
          .eliminar
      )}${idComentario}`,
      { headers }
    );
  }
}
