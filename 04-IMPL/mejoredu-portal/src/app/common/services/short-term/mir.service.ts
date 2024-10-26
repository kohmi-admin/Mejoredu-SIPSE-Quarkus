import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableMirService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}${environment.endpoints.planeacion.cortoPlazo.mir.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  getTableDataMir(anhio: string, usuario: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.mir.consultaTablaMirPorAnhio
      )}${anhio}/${usuario}`,
      {
        headers,
      }
    );
  }

  getTableProducts(anhio: string, usuario: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.mir
          .consultarProductosPorIdAnhio
      )}${anhio}/${usuario}`,
      {
        headers,
      }
    );
  }
}
