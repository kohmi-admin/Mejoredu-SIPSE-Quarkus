import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IActionDeletePayload,
  IActionPayload,
  IActionsResponse,
} from '@common/interfaces/actions.interface';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.medianoPlazo.host}${environment.endpoints.planeacion.medianoPlazo.acciones.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createAction(data: IActionPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.acciones.registrar
      )}`,
      data,
      { headers }
    );
  }

  getActionById(idStrategie: number) {
    const headers = this.getHeaders();
    return this.http.get<IActionsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.acciones.consultarPorID
      )}${idStrategie}`,
      {
        headers,
      }
    );
  }

  getActionByIdEstrategia(idEstrategia: number) {
    const headers = this.getHeaders();
    return this.http.get<IActionsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.acciones
          .consultarActivosPorEstrategia
      )}${idEstrategia}`,
      {
        headers,
      }
    );
  }

  updateAction(data: IActionPayload) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.acciones.modificar
      )}`,
      data,
      {
        headers,
      }
    );
  }

  deleteAction(data: IActionDeletePayload) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.acciones.eliminar
      )}`,
      data,
      { headers }
    );
  }

  async getCatalogAccion(year: string) {
    const headers = this.getHeaders();
    return await lastValueFrom(
      this.http.get<ICatalogResponse>(
        `${this.basePath}${environment.endpoints.planeacion.medianoPlazo.acciones.consultarCatalogoAcciones}${year}`,
        {
          headers,
        }
      )
    );
  }
}
