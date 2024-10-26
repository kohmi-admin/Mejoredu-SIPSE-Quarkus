import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessageApi, IResponseApi } from '@common/interfaces/response-api.interface';
import {
  IAccionFollowPayload,
  IAccionFollowResponse,
  ICreateAccionResponse,
  IGetAcccionModByIdAdecuacionResponse,
  IGetAccionByIdResponse,
} from '@common/interfaces/seguimiento/actions.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActionsFollowService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.acciones.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createAction(data: IAccionFollowPayload) {
    const headers = this.getHeaders();
    return this.http.post<ICreateAccionResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones.registrar
      )}`,
      data,
      { headers }
    );
  }

  getActions(
    idProduct: number,
    excluirCortoPlazo: boolean,
    idSolicitud: number
  ) {
    const params = `excluirCortoPlazo=${excluirCortoPlazo}&idProducto=${idProduct}&idSolicitud=${idSolicitud}`;
    const headers = this.getHeaders();
    return this.http.get<IAccionFollowResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones
          .consultarAcciones
      )}${params}`,
      {
        headers,
      }
    );
  }

  getActionById(idAccion: number) {
    const headers = this.getHeaders();
    const params: any = {
      idAccion: idAccion,
    };
    return this.http.get<IGetAccionByIdResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones
          .consultarAccionesPorId
      )}${idAccion}`,
      {
        headers,
        params,
      }
    );
  }

  getSecuencialPorProducto(idProduct: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones
          .secuencialPorProducto
      )}${idProduct}`,
      {
        headers,
      }
    );
  }

  updateAction(idAccion: number | any, data: IAccionFollowPayload) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones.modificar
      )}${idAccion}`,
      data,
      { headers }
    );
  }

  deleteAccion(idAccion: number) {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones.eliminar
      )}${idAccion}`,
      { headers }
    );
  }

  cancelAccion(data: {
    idAdecuacionSolicitud: number;
    idAccionReferencia: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones.cancelar
      )}`,
      data,
      { headers }
    );
  }

  getAcccionModiByIdAdecuacionSolicitud(idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetAcccionModByIdAdecuacionResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones
          .consultarAccionesModificacion
      )}${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  getAcccionCancelacion(idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones
          .consultarAccionesCancelacion
      )}${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  deleteAdecuacion(data: {
    idReferencia: number;
    idAdecuacionSolicitud: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.acciones
          .eliminarAdecuacion
      )}`,
      data,
      { headers }
    );
  }
}
