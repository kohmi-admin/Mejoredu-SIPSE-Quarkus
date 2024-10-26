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
export class GestionReportesService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.reportes.numeralia.host}${environment.endpoints.reportes.numeralia.archivoSeccion.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createArchivo(data: IGestionReportesPayload) {
    const headers = this.getHeaders();
    return this.http.post<IMessageApi>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.archivoSeccion.registrar
      )}`,
      data,
      { headers }
    );
  }

  getArchivos(anhio: string) {
    const headers = this.getHeaders();
    return this.http.get<IGestionReportesResponse>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.archivoSeccion.consultaPorAnhio
      )}${anhio}`,
      {
        headers,
      }
    );
  }
}
