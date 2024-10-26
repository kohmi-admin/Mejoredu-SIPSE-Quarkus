import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDireccionesResponse, IDireccionPayload, IDireccionResponse } from '@common/interfaces/configuration/direcciones.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.catalogs.host}${environment.endpoints.catalogs.configuration.direcciones.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  agregarDireccion(data: IDireccionPayload){
    const headers = this.getHeaders();
    return this.http.post<IDireccionResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.direcciones.agregarDireccion
      )}`,
      data,
      { headers }
    );
  }

  listarDirecciones() {
    const headers = this.getHeaders();
    return this.http.get<IDireccionesResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.direcciones.listarDirecciones
      )}`,
      {
        headers,
      }
    );
  }

  actualizarDirecciones(idDireccion?: number, data?: IDireccionPayload){
    const headers = this.getHeaders();
    return this.http.put<IDireccionResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.direcciones.actualizarDirecciones
      )}${idDireccion}`,
      data,
      { headers }
    );
  }

  eliminarDireccion(idDireccion: number){
    const headers = this.getHeaders();
    return this.http.put<IDireccionResponse>(
      `${this.basePath.concat(
        environment.endpoints.catalogs.configuration.direcciones.eliminarDireccion
      )}${idDireccion}`,
      { headers }
    );
  }
}
