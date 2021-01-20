import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopulateService } from '../../services/populate.service';

@Component({
  selector: 'app-populate',
  templateUrl: './populate.component.html',
  styleUrls: ['./populate.component.css']
})
export class PopulateComponent implements OnInit {

  file: File;

  constructor(
    private populateService: PopulateService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  setFile(f) {
    this.file = f.item(0);
    //console.log(file);
  }

  upload() {
    this.populateService.upload(this.file);
    this._snackBar.open("File sent", "Ok", { duration: 3000 });
  }

}
