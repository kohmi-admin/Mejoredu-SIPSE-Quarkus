import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IGestionReportesPayload,
  IGestionReportesResponse,
} from '@common/interfaces/reportes/gestion-reportes.interface';
import { IMessageApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GestionArchivosService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.seguimientoMedianoPlazo.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createArchivo(data: IGestionReportesPayload) {
    const headers = this.getHeaders();
    return this.http.post<IMessageApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual
          .seguimientoMedianoPlazo.registrar
      )}`,
      data,
      { headers }
    );
  }

  getArchivos(anhio: string) {
    const headers = this.getHeaders();
    return this.http.get<IGestionReportesResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual
          .seguimientoMedianoPlazo.consultaPorAnhio
      )}${anhio}`,
      {
        headers,
      }
    );
  }
}
