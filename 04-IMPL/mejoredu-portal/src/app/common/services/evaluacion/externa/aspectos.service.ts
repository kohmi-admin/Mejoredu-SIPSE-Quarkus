import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IAspectoResponse,
  IAspectosPayload,
} from '@common/interfaces/evaluacion/externa/aspectos.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AspectosService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.evaluacion.host}${environment.endpoints.evaluacion.evaluacionExterna.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createAspecto(data: IAspectosPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionExterna.aspectosMejRegistrar
      )}`,
      data,
      { headers }
    );
  }

  getAspectos(anhio: string) {
    const headers = this.getHeaders();
    return this.http.get<IAspectoResponse>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionExterna.aspectosMejConsultar
      )}?anio=${anhio}`,
      {
        headers,
      }
    );
  }

  deleteAspecto(idAspecto: number) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionExterna.aspectosMejEliminar.replace(
          '{id}',
          `${idAspecto}`
        )
      )}`,
      {
        headers,
      }
    );
  }
}
