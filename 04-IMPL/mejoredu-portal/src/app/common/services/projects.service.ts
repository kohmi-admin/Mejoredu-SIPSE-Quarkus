import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IGetProjectComplete,
  IGetProjectsAnhioStatus,
  IProjectsResponse,
  IProyectoPayloadDelete,
  IVistaGeneralResponse,
} from '@common/interfaces/projects.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { ISecuenciaProyectoAnual } from '@common/interfaces/secuencia.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createProject(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos.registrarProyecto
      )}`,
      data,
      { headers }
    );
  }

  getProjectById(idProject: number) {
    const headers = this.getHeaders();
    return this.http.get<IProjectsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultarProyectoPorID
      )}${idProject}`,
      {
        headers,
      }
    );
  }

  getProjectByAnnio(annio: string) {
    const headers = this.getHeaders();
    return this.http.get<IProjectsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultarProyectoPorAnhio
      )}${annio}`,
      {
        headers,
      }
    );
  }

  getProjectByAnnioAndStatus(annio: string, status: string) {
    const headers = this.getHeaders();
    return this.http.get<IGetProjectsAnhioStatus>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultaProyectosPorAnhioEstatus
      )}${annio}/${status}`,
      {
        headers,
      }
    );
  }

  getProjectByAnnioCarga(annio: string) {
    const headers = this.getHeaders();
    return this.http.get<IProjectsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultarProyectoPorAnhioCarga
      )}${annio}`,
      {
        headers,
      }
    );
  }

  getProjectByAnnioParaValidar(annio: string) {
    const headers = this.getHeaders();
    return this.http.get<IProjectsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultaProyectosPorAnhioParaValidar
      )}${annio}`,
      {
        headers,
      }
    );
  }

  getSecuenciaProyectoAnual(yearNav: string, idUnidad: string) {
    const headers = this.getHeaders();
    return this.http.get<ISecuenciaProyectoAnual>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .secuencialProyectoAnual
      )}${yearNav}/${idUnidad}`,
      {
        headers,
      }
    );
  }
  getVistaGeneral(yearNav: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.get<IVistaGeneralResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultaProyectosPorAnhioParaVistaGeneral
      )}${yearNav}/${cveUsuario}`,
      {
        headers,
      }
    );
  }
  getVistaGeneralByIdProject(
    yearNav: string,
    cveUsuario: string,
    idProyecto: number
  ) {
    const headers = this.getHeaders();
    return this.http.get<IVistaGeneralResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultaProyectosPorAnhioParaVistaGeneralPorId
      )}${yearNav}/${cveUsuario}/${idProyecto}`,
      {
        headers,
      }
    );
  }

  getProjectComplete(idProyecto: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetProjectComplete>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultarProyectoCompleto
      )}${idProyecto}`,
      {
        headers,
      }
    );
  }

  updateProject(idProject: string, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .modificarProyectoPorID
      )}${idProject}`,
      data,
      {
        headers,
      }
    );
  }

  deleteProject(data: IProyectoPayloadDelete) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .eliminarProyectoPorID
      )}`,
      data,
      { headers }
    );
  }

  uploadExcel(usuario: string, file: File) {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos.excelToMysql
      )}${usuario}`,
      formData,
      {
        headers,
      }
    );
  }

  finalizarRegistro(data: { id: number; usuario: string }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos.finalizarRegistro
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
        environment.endpoints.planeacion.cortoPlazo.proyectos.enviarARevisar
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
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .enviarAValidacionTectica
      )}`,
      data,
      {
        headers,
      }
    );
  }
}
