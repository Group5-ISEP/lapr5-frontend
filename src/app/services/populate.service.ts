import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PopulateService {

  constructor(private http: HttpClient) { }

  upload(f: File) {
    //console.log('Uploading file to masterDataViagens: ' + f.name);
    return this.http.post(environment.masterDataViagensURL + '/api/importdata', f);
  }
}
