import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PopulateService {

  constructor(private http: HttpClient) { }

  upload(f: File) {
    const formData = new FormData();
    formData.append('file', f);
    return this.http.post(environment.masterDataURL + '/api/importdata', formData);
  }
}
