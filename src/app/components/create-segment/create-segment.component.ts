import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import HaversineGeolocation from 'haversine-geolocation';
import Node from '../../domain/Node';
import Segment from '../../domain/Segment';


@Component({
  selector: 'app-create-segment',
  templateUrl: './create-segment.component.html',
  styleUrls: ['./create-segment.component.css']
})
export class CreateSegmentComponent implements OnInit {

  distance: number;
  duration: number;
  calculated: boolean = false;

  //List of existing nodes
  @Input()
  nodes: Node[];

  //Nodes to validate correction
  @Input()
  firstN: string;

  @Input()
  lastN: string;

  iN: string = null;

  //List of created segments
  segments: Segment[] = [];
  order: number = 1;
  fullPath: boolean = false;

  //Segment current start and end node
  n1: Node;
  n2: Node;

  segment = new FormGroup({
    startNode: new FormControl('', Validators.required),
    endNode: new FormControl('', Validators.required),
    order: new FormControl('', Validators.required)
  });  

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.segment.setValue({ startNode: this.firstN, endNode: this.lastN, order: this.order })
    this.iN = this.firstN;
  }

  createForm() {
    this.segment = new FormGroup({
      startNode: new FormControl('', Validators.required),
      endNode: new FormControl('', Validators.required),
      order: new FormControl('', Validators.required)
    });
  }

  calculateDistance() {
    if (this.segment.value.startNode.invalid || this.segment.value.endNode.invalid) {
      this._snackBar.open("Please select start and end node", "Ok", { duration: 2000 })
    }
    this.n1 = this.segment.value['startNode'];
    this.n2 = this.segment.value['endNode'];

    let c1 = {
      latitude: this.n1.latitude,
      longitude: this.n1.longitude
    }
    let c2 = {
      latitude: this.n2.latitude,
      longitude: this.n2.longitude
    }

    this.distance = HaversineGeolocation.getDistanceBetween(c1, c2, 'm');
    this.duration = (this.distance / 40000) * 60;
    this.calculated = true;
  }

  addSegment() {
    if (!this.calculated) {
      this._snackBar.open("Please calculate the rest of properties", "Ok", { duration: 2000 })
      return;
    }
    else {
      //this.calculateDistance();
    }

    if (!this.fullPath && this.verifySegmentNodes()) {
      let s: Segment = {
        startNode: this.n1.shortName,
        endNode: this.n2.shortName,
        distance: this.distance,
        duration: this.duration,
        order: this.order-1
      }
      this.segments.push(s);
      this.createForm();
      this.calculated = false;
      this._snackBar.open("Added segment to the path", "Ok", { duration: 2000 })
      //console.log(this.segments);
    }
  }

  verifySegmentNodes(): boolean {
    //First case, iN not initialized || Rest of cases, last previous node is now the first one
    if (this.order == 1) {
      if (this.firstN == this.n1.shortName) {
        this.iN = this.n2.shortName;
        this.order++;
        if (this.n2.shortName == this.lastN) {
          //Reached last stop of the line
          this._snackBar.open("Added last segment of the path", "Ok", { duration: 2000 })
          this.fullPath = true;
        }
        return true;
      }
      else { this._snackBar.open("First segment must have same starting node as the line", "Ok", { duration: 2000 }); return false; }
    }
    else if (this.iN == this.n1.shortName) {
      this.iN = this.n2.shortName;
      this.order++;
      if (this.n2.shortName == this.lastN) {
        //Reached last stop of the line
        this._snackBar.open("Added last segment of the path", "Ok", { duration: 2000 })
        this.fullPath = true;
        return true;
      }
      return true;
    }
    else {  //Bad initialization, 
      this._snackBar.open("End node of a segment must be the start node of the next", "Ok", { duration: 2000 })
      return false;
    }
  }

  onSubmit() {}

}
