import { Component, Input, OnInit } from '@angular/core';
import Node from '../../domain/Node';

@Component({
  selector: 'app-node-map-info',
  templateUrl: './node-map-info.component.html',
  styleUrls: ['./node-map-info.component.css']
})
export class NodeMapInfoComponent implements OnInit {

  //Placeholder, on real time the node will be filled through parent component
  //@Input()
  node: Node = {
      shortName: "AGL4 - placeholder",
      name: "Augusto Lessa 4",
      latitude: 41.1696,
      longitude: -8.5968,
      isReliefPoint: true,
      isDepot: false
  };

  constructor() { }

  ngOnInit(): void {
    //Obtain passing times for each line with this stop
    //At last two buses for each path with this stop
  }

}
