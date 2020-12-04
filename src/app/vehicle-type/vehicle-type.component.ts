import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VehicleTypeService } from '../vehicle-type.service';

export interface VehicleType {
  name: string,
  autonomy: number,
  costByKm: number,
  averageConsumption: number,
  averageSpeed: number,
  emissions: number,
  energySource: string
}

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent implements OnInit {

  vehicle = new FormGroup({
    name: new FormControl('', [Validators.required]),
    autonomy: new FormControl('', [Validators.required]),
    costByKm: new FormControl('', [Validators.required]),
    averageConsumption: new FormControl('', [Validators.required]),
    averageSpeed: new FormControl('', [Validators.required]),
    emissions: new FormControl('', [Validators.required]),
    energySource: new FormControl('', [Validators.required])
  })

  constructor(private vehicleTypeService: VehicleTypeService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    //console.log("Called vehicle-type.component.onsubmit() function with: "+this.vehicle.value['desc']);
    const body = {
      name: this.vehicle.value['name'],
      autonomy: this.vehicle.value['autonomy'],
      costByKm: this.vehicle.value['costByKm'],
      averageConsumption: this.vehicle.value['averageConsumption'],
      averageSpeed: this.vehicle.value['averageSpeed'],
      emissions: this.vehicle.value['emissions'],
      energySource: this.vehicle.value['energySource']
    }
    this.vehicleTypeService.create(body)
      .subscribe(
        res => {
          console.log("Received response of POST vehicle-type:\n" + res);
//          this.vehicleTypeService.refreshVehicleTypes();
        },
        err => {
          console.log(err);
          alert("The vehicle type couldn't be created");
        }
      )
  }

}
