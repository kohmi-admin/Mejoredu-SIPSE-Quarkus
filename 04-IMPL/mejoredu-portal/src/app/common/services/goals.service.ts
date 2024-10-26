import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import {
  IGoalPayload,
  IGoalsResponse,
} from '@common/interfaces/goals.interface';
import {
  IMessageApi,
  IResponseApi,
} from '@common/interfaces/response-api.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.medianoPlazo.host}${environment.endpoints.planeacion.medianoPlazo.objetivo.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createGoal(data: IGoalPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.objetivo.registrar
      )}`,
      data,
      { headers }
    );
  }

  getGoalById(idGoal: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.objetivo.consultarPorID
      )}${idGoal}`,
      {
        headers,
      }
    );
  }

  getGoals() {
    const headers = this.getHeaders();
    return this.http.get<IGoalsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.objetivo.consultarActivos
      )}`,
      {
        headers,
      }
    );
  }

  updateGoal(data: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.objetivo.modificar
      )}`,
      data,
      {
        headers,
      }
    );
  }

  deleteGoal(idGoal: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.objetivo.eliminar
      )}${idGoal}/${cveUsuario}`,
      {},
      { headers }
    );
  }

  async getCatalogObjetivo(year: string) {
    const headers = this.getHeaders();
    return await lastValueFrom(
      this.http.get<ICatalogResponse>(
        `${this.basePath}${environment.endpoints.planeacion.medianoPlazo.objetivo.consultarCatalogoObjetivos}${year}`,
        {
          headers,
        }
      )
    );
  }
}
