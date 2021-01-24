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
    this.populateService.upload(this.file).subscribe(
      res => {
        this._snackBar.open("File received", "Ok", { duration: 3000 });
      },
      err => {
        this._snackBar.open("An error has ocurred uploading the file", "Ok", { duration: 3000 });
        console.error(err);
      });
  }

}
