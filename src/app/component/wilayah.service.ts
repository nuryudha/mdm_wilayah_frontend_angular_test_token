import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions: Object = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  observe: 'response',
  responseType: 'json',
};
@Injectable({
  providedIn: 'root',
})
export class WilayahService {
  constructor(private http: HttpClient) {}

  getAll(endpoint: string): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(environment.wilayah + endpoint, httpOptions)
      .pipe();
  }

  postAll(endpoint: string, parameter: any): Observable<HttpResponse<any>> {
    return this.http
      .post<any>(environment.wilayah + endpoint, parameter, httpOptions)
      .pipe();
  }

  deleteAll(endpoint: string): Observable<HttpResponse<any>> {
    return this.http
      .delete<any>(environment.wilayah + endpoint, httpOptions)
      .pipe();
  }

  getId(endpoint: string): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(environment.wilayah + endpoint, httpOptions)
      .pipe();
  }

  putId(endpoint: string, parameter: any): Observable<HttpResponse<any>> {
    return this.http
      .put<any>(environment.wilayah + endpoint, parameter, httpOptions)
      .pipe();
  }
}
