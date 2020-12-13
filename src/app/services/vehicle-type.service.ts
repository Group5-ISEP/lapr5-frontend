import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import VehicleType from '../domain/VehicleType';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {

  constructor(private http: HttpClient) { }

  create(vehicleDesc: VehicleType) {
    //console.log("Creating vehicle-type with:\n"+vehicleDesc);
    return this.http.post('http://localhost:3000/api/vehicletypes', vehicleDesc);//, { responseType: 'json' });
  }

  getVehicleTypes(): Observable<VehicleType[]> {
    return this.http.get<VehicleType[]>(environment.masterDataURL + 'api/vehicleTypes');
  }
}
