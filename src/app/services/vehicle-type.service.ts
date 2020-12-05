import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VehicleType } from '../components/vehicle-type/vehicle-type.component';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {

  constructor(private http: HttpClient) { }

  create(vehicleDesc: VehicleType) {
    //console.log("Creating vehicle-type with:\n"+vehicleDesc);
    return this.http.post('http://localhost:3000/api/vehicletypes', vehicleDesc);//, { responseType: 'json' });
  }
}
