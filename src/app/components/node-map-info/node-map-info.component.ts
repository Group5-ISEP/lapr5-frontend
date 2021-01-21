import { Component, Input, OnInit } from '@angular/core';
import Node from '../../domain/Node';

@Component({
  selector: 'app-node-map-info',
  templateUrl: './node-map-info.component.html',
  styleUrls: ['./node-map-info.component.css']
})
export class NodeMapInfoComponent implements OnInit {

  @Input()
  node: Node;

  //TODO: add trips

  constructor() { }

  ngOnInit(): void {
  }

  updateSchedule() {
    if (this.node) {
      console.log("Fetching schedule...");
    }
  }

}
