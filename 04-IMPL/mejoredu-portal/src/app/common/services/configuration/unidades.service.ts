import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUnidadesResponse, IUnidadPayload, IUnidadResponse } from '@common/interfaces/configuration/unidades.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.catalogs.host}${environment.endpoints.catalogs.configuration.unidades.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  agregarUnidad(data: IUnidadPayload){
    const headers = this.getHeaders();
    return this.http.post<IUnidadResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.unidades.agregarUnidad
      )}`,
      data,
      { headers }
    );
  }

  consultarActivos() {
    const headers = this.getHeaders();
    return this.http.get<IUnidadesResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.unidades.consultarActivos
      )}`,
      {
        headers,
      }
    );
  }

  actualizarUnidad(idUnidad?: number, data?: IUnidadPayload) {
    const headers = this.getHeaders();
    return this.http.put<IUnidadesResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.unidades.actualizarUnidad
      )}idUnidad=${idUnidad}`,
      data,
      { headers }
    );
  }

  eliminarUnidad(idUnidad: number) {
    const headers = this.getHeaders();
    return this.http.put<IUnidadesResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.unidades.eliminarUnidad
      )}${idUnidad}`,
      { headers }
    );
  }
}
