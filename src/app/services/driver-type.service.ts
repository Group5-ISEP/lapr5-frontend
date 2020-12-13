import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import DriverType from '../domain/DriverType';

@Injectable({
  providedIn: 'root'
})
export class DriverTypeService {

  constructor(private http: HttpClient) { }

  create(driverDesc: string) {
    return this.http.post(environment.masterDataURL + '/api/drivertypes', { description: driverDesc } );
  }

  getDriverTypes(): Observable<DriverType[]> {
    return this.http.get<DriverType[]>(environment.masterDataURL + '/api/drivertypes');
  }
}
