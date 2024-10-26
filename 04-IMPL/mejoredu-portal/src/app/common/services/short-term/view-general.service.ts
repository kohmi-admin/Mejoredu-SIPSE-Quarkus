import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewGeneralService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  getViewGeneral(anhio: string, usuario: string){
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.proyectos
          .consultaProyectosPorAnhioParaVistaGeneral
      )}${anhio}/${usuario}`,
      {
        headers,
      }
    );
  }

}
