import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Line from '../../domain/Line';
import Node from '../../domain/Node';
import Path from '../../domain/Path';
import Segment from '../../domain/Segment';
import { LineService } from '../../services/line.service';
import { NodeService } from '../../services/node.service';
import { PathService } from '../../services/path.service';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit {

  selectedLine: boolean = false;

  segments: Segment[];

  lines: Line[];
  nodes: Node[];
  paths: Path[];

  path = new FormGroup({
    lineCode: new FormControl('', [Validators.required]),
    direction: new FormControl('', [Validators.required]),
    segmentList: new FormControl('', [Validators.required]),
    firstNode: new FormControl('', [Validators.required]),
    lastNode: new FormControl('', [Validators.required]),
    isEmpty: new FormControl('', [Validators.required])
  })

  constructor(
    private pathService: PathService,
    private lineService: LineService,
    private nodeService: NodeService
  ) {
    this.fetchNetworkData();
  }

  ngOnInit(): void {
  }

  fetchNetworkData() {
    this.lineService.getLines().subscribe(
      res => {
        this.lines = res;
      },
      err => { console.error(err) }
    )
    this.nodeService.getNodes().subscribe(
      res => {
        this.nodes = res;
      },
      err => { console.error(err) }
    )
  }

  fetchPathsOfLine() {
    this.pathService.getPaths(this.path.value['lineCode']).subscribe(
      paths => {
        this.paths = paths;
      },
      err => { console.error(err); }
    )
  }

  onSubmit() {
    const body = {
      lineCode: this.path.value['lineCode'],
      direction: this.path.value['direction'],
      segmentList: this.path.value['segmentList'],
      firstNode: this.path.value['firstNode'],
      lastNode: this.path.value['lastNode'],
      isEmpty: this.path.value['isEmpty']
    }

    this.pathService.create(body).subscribe(
      res => {
        alert("Path succesfully created!")
      },
      err => { console.error(err) }
    )
  }

}
