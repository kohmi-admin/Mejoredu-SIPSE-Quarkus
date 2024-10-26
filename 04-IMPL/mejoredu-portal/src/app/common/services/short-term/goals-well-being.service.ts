import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableGoalsWellBeingService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}${environment.endpoints.planeacion.cortoPlazo.metasbienestar.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  getTableDataGoalsWellBeing(anhio: string, usuario: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.metasbienestar
          .consultarPorAnhio
      )}${anhio}/${usuario}`,
      {
        headers,
      }
    );
  }

  getTableConsultarPorIdCatalogoIndicadorPI(anhio: string, usuario: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.metasbienestar
          .productosConsultarPorIdCatalogoIndicadorPI
      )}${anhio}/${usuario}`,
      {
        headers,
      }
    );
  }

}
