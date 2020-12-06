import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LineService } from '../../services/line.service';

export interface ILine {
  code: string,
  name: string,
  terminalNodes: string[],
  colorRGB: {
    red: number,
    green: number,
    blue: number
  },
  allowedDriverTypes: string[],
  allowedVehicleTypes: string[]
}

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {

  created: boolean = false;

  line = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    terminalNodes: new FormControl('', [Validators.required]),
    colorR: new FormControl('', [Validators.required]),
    colorG: new FormControl('', [Validators.required]),
    colorB: new FormControl('', [Validators.required]),
    allowedDriverTypes: new FormControl('', [Validators.required]),
    allowedVehicleTypes: new FormControl('', [Validators.required])
  })

  constructor(private lineService: LineService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const body = {
      code: this.line.value['code'],
      name: this.line.value['name'],
      terminalNodes: this.line.value['terminalNodes'],
      colorRGB: this.line.value['colorRGB'],
      allowedDriverTypes: this.line.value['allowedDriverTypes'],
      allowedVehicleTypes: this.line.value['allowedVehicleTypes']
    }

    this.lineService.create(body)
      .subscribe(
        res => {
          this.created = true;
        },
        err => {
          console.log(err);
          alert("The line couldn't be created");
        }
      )
  }

}
