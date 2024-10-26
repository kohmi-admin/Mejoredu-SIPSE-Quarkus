import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoalsWellBeingService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.medianoPlazo.host}${environment.endpoints.planeacion.medianoPlazo.metasBienestar.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createGoalsWellBeing(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.metasBienestar.registrar
      )}`,
      data,
      { headers }
    );
  }

  getGoalsWellBeingByIdStructure(idEstructura: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.metasBienestar.consultarPorEstructura
      )}${idEstructura}`,
      {
        headers,
      }
    );
  }

  getGoalsWellBeingByIdMetas(idMetas: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.metasBienestar.consultarPorIdMetas
      )}${idMetas}`,
      {
        headers,
      }
    );
  }

  updateGoalsWellBeing(idMetas: number, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.metasBienestar.modificar
      )}`,
      data,
      { headers }
    );
  }

  deleteGoalsWellBeing(idMetas: number, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.metasBienestar.eliminar
      )}${idMetas}/${cveUsuario}`,
      {},
      { headers }
    );
  }

}
