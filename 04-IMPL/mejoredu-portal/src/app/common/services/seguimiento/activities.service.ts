import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { IConsultaActividadPorIdResponse, IGetActiModByIdAdecuacionResponse } from '@common/interfaces/seguimiento/activities.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesFollowService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.actividades.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createActivity(data: any) {
    const headers = this.getHeaders();
    return this.http.post<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades.registrar
      )}`,
      data,
      { headers }
    );
  }

  getActivityByProjectId(idProject: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .consultarPorProyecto
      )}${idProject}`,
      {
        headers,
      }
    );
  }

  getActivityById(idActivity: number) {
    const headers = this.getHeaders();
    return this.http.get<IConsultaActividadPorIdResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .consultarPorID
      )}${idActivity}`,
      {
        headers,
      }
    );
  }

  getActiModiByIdAdecuacionSolicitud(idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetActiModByIdAdecuacionResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .consultarActividadModificacion
      )}${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  getActivityCancelation(idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .consultarActividadCancelacion
      )}${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  getSecuencialPorProyecto(idProject: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .secuencialPorProyecto
      )}${idProject}`,
      {
        headers,
      }
    );
  }

  getActivityByProjectIdSolicitud(idProject: number, excluirCortoPlazo: boolean, idSolicitud: number) {
    const params = `excluirCortoPlazo=${excluirCortoPlazo}&idProyecto=${idProject}&idSolicitud=${idSolicitud}`
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .consultaPorProyectoSolicitud
      )}${params}`,
      {
        headers,
      }
    );
  }

  updateActivity(idActividad: string, data: any) {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades.modificar
      )}${idActividad}`,
      data,
      { headers }
    );
  }

  deleteActivity(idActividad: number, data: any) {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades.eliminar
      )}${idActividad}`,
      data,
      { headers }
    );
  }

  cancelActivity(data: {
    idAdecuacionSolicitud: number;
    idActividadReferencia: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .cancelarActividad
      )}`,
      data,
      { headers }
    );
  }

  deleteAdecuacion(data: {
    idReferencia: number;
    idAdecuacionSolicitud: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.actividades
          .eliminarAdecuacion
      )}`,
      data,
      { headers }
    );
  }
}
