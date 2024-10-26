import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessageApi } from '@common/interfaces/response-api.interface';
import {
  ISectionFilesPayload,
  ISectionFilesResponse,
} from '@common/interfaces/section-files.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectionFilesService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}${environment.endpoints.planeacion.cortoPlazo.archivoSeccion.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  register(data: ISectionFilesPayload) {
    const headers = this.getHeaders();
    return this.http.post<IMessageApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.archivoSeccion.registrar
      )}`,
      data,
      { headers }
    );
  }

  getfilesByAnnio(annio: string, subSection: string) {
    const headers = this.getHeaders();
    return this.http.get<ISectionFilesResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.archivoSeccion
          .consultaPorAnhio
      )}${annio}/${subSection}`,
      {
        headers,
      }
    );
  }
}
