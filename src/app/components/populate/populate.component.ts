import { Component, OnInit } from '@angular/core';
import { PopulateService } from '../../services/populate.service';

@Component({
  selector: 'app-populate',
  templateUrl: './populate.component.html',
  styleUrls: ['./populate.component.css']
})
export class PopulateComponent implements OnInit {

  file: File;

  constructor(private populateService: PopulateService) { }

  ngOnInit(): void {
  }

  setFile(f) {
    this.file = f.item(0);
    //console.log(file);
  }

  upload() {
    this.populateService.upload(this.file);
  }

}
