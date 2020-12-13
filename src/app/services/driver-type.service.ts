import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverTypeService {

  constructor(private http: HttpClient) { }

  create(driverDesc: string) {
    return this.http.post('http://localhost:3000/api/drivertypes', { description: driverDesc } );
  }

  getDriverTypes() : Observable<string[]> {
    return this.http.get<string[]>(environment.masterDataURL + 'api/driverTypes');
  }
}
