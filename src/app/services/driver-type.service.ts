import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriverTypeService {

  constructor(private http: HttpClient) { }

  create(driverDesc: string) {
    console.log("Creating driver-type with:\n" + driverDesc);
    const body = {
      description: driverDesc
    }
    return this.http.post('http://localhost:3000/api/drivertypes', body);
  }
}
