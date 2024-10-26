import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IItemProductResponse,
  IProductPayload,
  IProductResponse,
  IProductsResponse,
} from '@common/interfaces/products.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createProduct(data: IProductPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.productos.registrar
      )}`,
      data,
      { headers }
    );
  }

  updateProduct(idProducto: string, data: IProductPayload) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.productos.modificar
      )}${idProducto}`,
      data,
      { headers }
    );
  }

  getProductById(idProducto: string) {
    const headers = this.getHeaders();
    return this.http.get<IProductResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.productos.consultarPorId
      )}/${idProducto}`,
      {
        headers,
      }
    );
  }

  getProductByActivityId(idActivity: string) {
    const headers = this.getHeaders();
    return this.http.get<IProductsResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.productos
          .consultaPorActividad
      )}${idActivity}`,
      {
        headers,
      }
    );
  }

  deleteProduct(idProducto: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.productos.eliminar
      )}${idProducto}`,
      {},
      { headers }
    );
  }
}
