import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ILoginPayload,
  ILoginResponse,
} from '@common/interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.auth.host}`;

  getHeaders() {
    return new HttpHeaders({
      authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  login(data: ILoginPayload): Observable<any> {
    let fullUrl = `${this.basePath}${environment.endpoints.auth.login}`;
    if (environment.production) {
      fullUrl = `${this.basePath}${environment.endpoints.auth.loginLdap}`;
    }
    return this.http.post<ILoginResponse>(
      fullUrl,
      data
    );
  }

  consultarFirma(cveUsuario: string) {
    return this.http.get<ILoginResponse>(
      `${this.basePath}${environment.endpoints.auth.consultarFirma}?clave=${cveUsuario}`
    );
  }
}
