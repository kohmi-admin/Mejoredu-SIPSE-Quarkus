import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createActivity(data: any) {
    const headers = this.getHeaders();
    return this.http.post<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.actividades.registrar
      )}`,
      data,
      { headers }
    );
  }

  getActivityByProjectId(idProject: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.actividades
          .consultarPorProyecto
      )}${idProject}`,
      {
        headers,
      }
    );
  }

  updateActivity(idActividad: string, data: any) {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.actividades.modificar
      )}${idActividad}`,
      data,
      { headers }
    );
  }

  deleteActivity(idActividad: number, data: any) {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.actividades.eliminar
      )}${idActividad}`,
      data,
      { headers }
    );
  }
}
