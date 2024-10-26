import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IEncuestaPayload,
  IEncuestasResponse,
} from '@common/interfaces/evaluacion/encuestas/encuestas.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.evaluacion.host}${environment.endpoints.evaluacion.encuestas.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createEncuesta(data: IEncuestaPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.encuestas.registrar
      )}`,
      data,
      { headers }
    );
  }

  getEncuestas(anhio: string) {
    const headers = this.getHeaders();
    return this.http.get<IEncuestasResponse>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.encuestas.consultar
      )}?anio=${anhio}`,
      {
        headers,
      }
    );
  }

  deleteEncuesta(idEncuesta: number) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.encuestas.eliminar.replace(
          '{id}',
          `${idEncuesta}`
        )
      )}`,
      {
        headers,
      }
    );
  }
}
