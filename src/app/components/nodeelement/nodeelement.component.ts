import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nodeelement',
  templateUrl: './nodeelement.component.html',
  styleUrls: ['./nodeelement.component.css']
})
export class NodeelementComponent implements OnInit {

  @Input()
  shortName: string;
  @Input()
  name: string;
  @Input()
  isDepot: boolean;
  @Input()
  isReliefPoint: boolean;
  @Input()
  longitude: number;
  @Input()
  latitude: number;

  constructor() { }

  ngOnInit(): void {
  }

}
