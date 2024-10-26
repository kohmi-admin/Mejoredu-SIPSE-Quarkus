import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IExtractorPayload, IExtractorResponse } from '@common/interfaces/reportes/extractores.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExtractoresService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.reportes.numeralia.host}${environment.endpoints.reportes.numeralia.extractores.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  consultaPaaAprobado(data: IExtractorPayload) {
    const headers = this.getHeaders();
    return this.http.patch<IExtractorResponse>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.extractores.paaaprobado
      )}`,
      data,
      {
        headers,
      }
    );
  }
}
