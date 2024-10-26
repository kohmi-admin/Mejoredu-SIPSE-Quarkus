import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import { IGetParamsByIdProyectoResponse } from '@common/interfaces/medium-term/params.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.medianoPlazo.host2}${environment.endpoints.planeacion.medianoPlazo.parametro.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createParams(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.parametro.registrar
      )}`,
      data,
      { headers }
    );
  }

  getParamsByIdStructure(idEstructura: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.parametro.consultarPorEstructura
      )}${idEstructura}`,
      {
        headers,
      }
    );
  }

  getParamsByIdParam(idParam: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.parametro.consultarPorIdParametro
      )}`,
      {
        headers,
      }
    );
  }

  getParamsByIdActividad(idActividad: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.parametro.consultarPorIdActividad
      )}${idActividad}`,
      {
        headers,
      }
    );
  }

  getParamsByIdProyecto(idProyecto: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetParamsByIdProyectoResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.parametro.consultarPorIdProyecto
      )}${idProyecto}`,
      {
        headers,
      }
    );
  }

  updateParam(idParam: number, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.parametro.modificar
      )}`,
      data,
      { headers }
    );
  }

  deleteParam(idParam: number, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.parametro.eliminar
      )}${idParam}/${cveUsuario}`,
      {},
      { headers }
    );
  }

  async getCatalogPi(year: string) {
    const headers = this.getHeaders();
    return await lastValueFrom(
      this.http.get<ICatalogResponse>(
        `${this.basePath}${environment.endpoints.planeacion.medianoPlazo.parametro.consultarCatalogoIndicadores}${year}`,
        {
          headers,
        }
      )
    );
  }
}
