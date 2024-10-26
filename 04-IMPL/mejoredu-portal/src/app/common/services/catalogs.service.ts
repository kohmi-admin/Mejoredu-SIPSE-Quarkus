import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ICatalogPayload,
  ICatalogResponse,
} from '@common/interfaces/catalog.interface';
import { IMessageApi } from '@common/interfaces/response-api.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.catalogs.host}`;
  private contextCatalogsAccion = environment.endpoints.catalogs.configuration.catalogos.path;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  async getCatalogById(idCatalog: string) {
    const headers = this.getHeaders();
    return await lastValueFrom(
      this.http.get<ICatalogResponse>(`${this.basePath}${environment.endpoints.catalogs.path}${idCatalog}`, {
        headers,
      })
    );
  }

  consultarCatalogosPadre(){
    const headers = this.getHeaders();
    return this.http.get<ICatalogResponse>(
      `${this.basePath}${this.contextCatalogsAccion.concat(
        environment.endpoints.catalogs.configuration.catalogos.consultarCatalogoPadres
      )}`,
      {
        headers,
      }
    );
  }

  consultarCatalogosHijos(idCatalogoPadre: number){
    const headers = this.getHeaders();
    return this.http.get<ICatalogResponse>(
      `${this.basePath}${this.contextCatalogsAccion.concat(
        environment.endpoints.catalogs.configuration.catalogos.consultarCatalogoID
      )}${idCatalogoPadre}`,
      {
        headers,
      }
    );
  }

  agregarRegistroCatalgo(data: ICatalogPayload){
    const headers = this.getHeaders();
    return this.http.post<IMessageApi>(
      `${this.basePath}${this.contextCatalogsAccion.concat(
        environment.endpoints.catalogs.configuration.catalogos.agregarRegistroCatalgo
      )}`,
      data,
      { headers }
    );
  }

  actualizarCatalogo(idCatalog: number, data: ICatalogPayload){
    const headers = this.getHeaders();
    return this.http.put<ICatalogResponse>(
      `${this.basePath}${this.contextCatalogsAccion.concat(
        environment.endpoints.catalogs.configuration.catalogos.actualizarCatalogo
      )}${idCatalog}`,
      data,
      { headers }
    );
  }

  eliminarCatalogo(idCatalog: number){
    const headers = this.getHeaders();
    return this.http.put<ICatalogResponse>(
      `${this.basePath}${this.contextCatalogsAccion.concat(
        environment.endpoints.catalogs.configuration.catalogos.eliminarCatalogo
      )}${idCatalog}`,
      {},
      { headers }
    );
  }

}
