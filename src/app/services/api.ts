import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(private http: HttpClient) {}

  getApi(endpoint: string) {
    return this.http.get(environment.apiUrl + endpoint);
  }

    postApi(endpoint: string, params: any) {
    return this.http.post(environment.apiUrl + endpoint, params);
  }
}
