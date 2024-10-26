import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  // IProjectsResponse,
  IProyectoPayloadDelete,
} from '@common/interfaces/projects.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { ISecuenciaProyectoAnual } from '@common/interfaces/secuencia.interface';
import { IConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import {
  IConsultaProyectoPorIdResponse,
  ICreateProjectSeguimientoResponse,
  IGetProModByIdAdecuacionResponse,
} from '@common/interfaces/seguimiento/proyectos.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.proyectos.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createProject(data: any) {
    const headers = this.getHeaders();
    return this.http.post<ICreateProjectSeguimientoResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .registrarProyecto
      )}`,
      data,
      { headers }
    );
  }

  getProjectById(idProject: number) {
    const headers = this.getHeaders();
    return this.http.get<IConsultaProyectoPorIdResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .consultarProyectoPorID
      )}${idProject}`,
      {
        headers,
      }
    );
  }

  getProyModiByIdAdecuacionSolicitud(idAdecuaciónSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetProModByIdAdecuacionResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .consultarProyectoModificacion
      )}${idAdecuaciónSolicitud}`,
      {
        headers,
      }
    );
  }

  getProjectByAnnio(annio: string, semantica: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .consultarProyectoPorAnhio
      )}${annio}/${semantica}`,
      {
        headers,
      }
    );
  }

  getProjectByAnnioCarga(annio: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .consultarProyectoPorAnhioCarga
      )}${annio}`,
      {
        headers,
      }
    );
  }

  getConsultarProyectos(
    anho: string,
    excluirCortoPlazo: boolean,
    idSolicitud: number,
    priorizarProyectoAsociado?: boolean
  ) {
    let params = `anhio=${anho}&excluirCortoPlazo=${String(
      excluirCortoPlazo
    )}&idSolicitud=${idSolicitud}`;
    if (priorizarProyectoAsociado !== undefined) {
      params += `&priorizarProyectoAsociado=${String(
        priorizarProyectoAsociado
      )}`;
    }
    const headers = this.getHeaders();
    return this.http.get<IConsultarPRoyectosResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .consultarProyectos
      )}?${params}`,
      {
        headers,
      }
    );
  }

  getProyectoCancelacion(idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .consultarProyectoCancelacion
      )}${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  getProjectByAnnioParaValidar(annio: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .consultaProyectosPorAnhioParaValidar
      )}${annio}`,
      {
        headers,
      }
    );
  }

  updateProject(idProject: string, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .modificarProyectoPorID
      )}${idProject}`,
      data,
      {
        headers,
      }
    );
  }

  cancelProject(data: {
    idAdecuacionSolicitud: number;
    idProyectoReferencia: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .cancelarProyecto
      )}`,
      data,
      { headers }
    );
  }

  deleteProject(data: IProyectoPayloadDelete) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .eliminarProyectoPorID
      )}`,
      data,
      { headers }
    );
  }

  getSecuenciaProyectoAnual(idUnidad: number) {
    const headers = this.getHeaders();
    return this.http.get<ISecuenciaProyectoAnual>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .secuencialProyectoAnual
      )}${idUnidad}`,
      {
        headers,
      }
    );
  }

  finalizarRegistro(data: { id: number; usuario: string }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .finalizarRegistro
      )}`,
      data,
      {
        headers,
      }
    );
  }

  enviarARevision(data: { id: number; usuario: string }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .enviarARevisar
      )}`,
      data,
      {
        headers,
      }
    );
  }

  enviarAValidacionTecnica(data: { id: number; usuario: string }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .enviarAValidacionTectica
      )}`,
      data,
      {
        headers,
      }
    );
  }

  deleteAdecuacion(data: {
    idReferencia: number;
    idAdecuacionSolicitud: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.proyectos
          .eliminarAdecuacion
      )}`,
      data,
      { headers }
    );
  }
}
