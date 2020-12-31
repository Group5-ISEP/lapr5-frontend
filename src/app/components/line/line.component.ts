import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LineService } from '../../services/line.service';
import { NodeService } from '../../services/node.service';
import { DriverTypeService } from '../../services/driver-type.service';
import { VehicleTypeService } from '../../services/vehicle-type.service';

import VehicleType from '../../domain/VehicleType';
import DriverType from '../../domain/DriverType';
import Node from '../../domain/Node';
import { LineListComponent } from '../line-list/line-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {

  @ViewChild(LineListComponent) lineList: LineListComponent;

  showColor: boolean = false;
  R: number = 0;
  G: number = 0;
  B: number = 0;
  terminalNodes: string[];

  allNodes: Node[];
  allDTs: DriverType[];
  allVTs: VehicleType[];

  ValidColor = [Validators.required, Validators.min(0), Validators.max(255)];

  line = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    terminalNode1: new FormControl('', [Validators.required]),
    terminalNode2: new FormControl('', [Validators.required]),
    colorR: new FormControl(0, this.ValidColor),
    colorG: new FormControl(0, this.ValidColor),
    colorB: new FormControl(0, this.ValidColor),
    allowedDriverTypes: new FormControl('', [Validators.required]),
    allowedVehicleTypes: new FormControl('', [Validators.required])
  })

  constructor(
    private lineService: LineService,
    private nodeService: NodeService,
    private driverTypeService: DriverTypeService,
    private vehicleTypeService: VehicleTypeService,
    private _snackBar: MatSnackBar
  ) {
    this.fetchNetworkData();
  }

  ngOnInit(): void {
  }

  fetchNetworkData() {
    this.nodeService.getNodes().subscribe(
      nodes => {
        this.allNodes = nodes;
        //console.log("Succesfully fetched " + this.allNodes.length + " Nodes");
      },
      err => { console.error(err); }
    );
    this.driverTypeService.getDriverTypes().subscribe(
      drivers => {
        this.allDTs = drivers;
        //console.log("Succesfully fetched " + this.allDTs.length + " Driver Types");
      },
      err => { console.error(err); }
    );
    this.vehicleTypeService.getVehicleTypes().subscribe(
      vehicles => {
        this.allVTs = vehicles;
        //console.log("Succesfully fetched " + this.allVTs.length + " Vehicle Types");
      },
      err => { console.error(err); }
    );
  }

  onSubmit() {
    if (this.line.valid) {
      const body = {
        code: this.line.value['code'],
        name: this.line.value['name'],
        terminalNodes: [this.line.value['terminalNode1'], this.line.value['terminalNode2']],
        colorRGB: {
          red: this.line.value['colorR'],
          green: this.line.value['colorG'],
          blue: this.line.value['colorB']
        },
        allowedDriverTypes: this.line.value['allowedDriverTypes'],
        allowedVehicleTypes: this.line.value['allowedVehicleTypes']
      }

      this.lineService.create(body)
        .subscribe(
          res => {
            this.lineList.fetchLines();
            this.clearForm();
            this._snackBar.open("Line created correctly!", "Ok", { duration: 2000 });
            alert("");
          },
          err => {
            console.error(err);
            alert("The line couldn't be created");
          }
        )
    }
    else { this._snackBar.open("Please fill the form", "Ok", { duration: 2000 }) }
  }

  previewColor() {
    this.showColor = true;
    this.R = this.line.value['colorR'];
    this.G = this.line.value['colorG'];
    this.B = this.line.value['colorB'];
  }

  clearForm() {
    this.line.setValue({
      code: '',
      name: '',
      terminalNodes: '',
      colorR: 0,
      colorG: 0,
      colorB: 0,
      allowedDriverTypes: '',
      allowedVehicleTypes: ''
    })
  }

}
