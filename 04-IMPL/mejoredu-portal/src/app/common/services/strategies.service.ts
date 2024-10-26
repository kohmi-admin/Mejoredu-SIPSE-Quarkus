import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import { IGoalsResponse } from '@common/interfaces/goals.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import {
  IStrategieDeletePayload,
  IStrategiePayload,
  IStrategiesResponse,
} from '@common/interfaces/strategies.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StrategiesService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.medianoPlazo.host}${environment.endpoints.planeacion.medianoPlazo.estrategia.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createStrategie(data: IStrategiePayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.estrategia.registrar
      )}`,
      data,
      { headers }
    );
  }

  getStrategieById(idStrategie: number) {
    const headers = this.getHeaders();
    return this.http.get<IStrategiesResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.estrategia.consultarPorID
      )}${idStrategie}`,
      {
        headers,
      }
    );
  }

  getStrategiesByIdObjetivo(ixObjetivo: number) {
    const headers = this.getHeaders();
    return this.http.get<IStrategiesResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.estrategia
          .consultarActivos
      )}${ixObjetivo}`,
      {
        headers,
      }
    );
  }

  updateStrategie(data: IStrategiePayload) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.estrategia.modificar
      )}`,
      data,
      {
        headers,
      }
    );
  }

  deleteStrategie(data: IStrategieDeletePayload) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.estrategia.eliminar
      )}`,
      data,
      { headers }
    );
  }

  async getCatalogEstrategia(year: string) {
    const headers = this.getHeaders();
    return await lastValueFrom(
      this.http.get<ICatalogResponse>(
        `${this.basePath}${environment.endpoints.planeacion.medianoPlazo.estrategia.consultarCatalogoObjetivos}${year}`,
        {
          headers,
        }
      )
    );
  }
}
