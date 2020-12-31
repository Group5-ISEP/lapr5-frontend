import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodeService } from '../../services/node.service';
import { NodeListComponent } from '../node-list/node-list.component';


@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {

  @ViewChild(NodeListComponent) nodeList: NodeListComponent;

  node = new FormGroup({
    shortName: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    isDepot: new FormControl('', [Validators.required]),
    isReliefPoint: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required])
  })

  constructor(
    private nodeService: NodeService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.node.valid) {
      const body = {
        shortName: this.node.value['shortName'],
        name: this.node.value['name'],
        isDepot: this.node.value['isDepot'],
        isReliefPoint: this.node.value['isReliefPoint'],
        longitude: this.node.value['longitude'],
        latitude: this.node.value['latitude']
      }
    
      this.nodeService.create(body)
        .subscribe(
          res => {
            this.nodeList.fetchNodes();
            this.clearForm();
            this._snackBar.open("Node created succesfully", "Ok", { duration: 2000 })
          },
          err => {
            console.error(err);
            this._snackBar.open("The node couldn't be created", "Ok", { duration: 2000 })
          }
      );
    }
    else { this._snackBar.open("Please fill the form", "Ok", { duration: 2000 }) }
  }

  clearForm() {
    this.node.setValue({
      shortName: '',
      name: '',
      isDepot: '',
      isReliefPoint: '',
      longitude: '',
      latitude: ''
    });
  }
}
