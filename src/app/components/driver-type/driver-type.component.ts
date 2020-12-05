import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DriverTypeService } from '../../services/driver-type.service';


@Component({
  selector: 'app-driver-type',
  templateUrl: './driver-type.component.html',
  styleUrls: ['./driver-type.component.css']
})
export class DriverTypeComponent implements OnInit {

  driverdesc = new FormControl('', [Validators.required]);

  constructor(private driverTypeService: DriverTypeService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("Called onSubmit of driver-type component with:\n" + this.driverdesc.value);
    this.driverTypeService.create(this.driverdesc.value)
      .subscribe(
        res => {
          console.log("Received response of POST driver-type:\n" + res);
          //          this.vehicleTypeService.refreshVehicleTypes();
        },
        err => {
          console.log(err);
          alert("The driver type couldn't be created");
        }
      )
  }

}
