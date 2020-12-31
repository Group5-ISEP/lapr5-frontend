import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Line from '../../domain/Line';
import Node from '../../domain/Node';
import Path from '../../domain/Path';
import Segment from '../../domain/Segment';
import { LineService } from '../../services/line.service';
import { NodeService } from '../../services/node.service';
import { PathService } from '../../services/path.service';
import { CreateSegmentComponent } from '../create-segment/create-segment.component';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit {

  @ViewChild(CreateSegmentComponent) createSegments: CreateSegmentComponent;

  selectedLine: boolean = false;
  actualLine: Line = null;

  selectedOrientation: boolean = false;

  segments: Segment[];

  lines: Line[];
  nodes: Node[];
  paths: Path[];

  path = new FormGroup({
    line: new FormControl('', [Validators.required]),
    direction: new FormControl('', [Validators.required]),
    firstNode: new FormControl('', [Validators.required]),
    lastNode: new FormControl('', [Validators.required]),
    isEmpty: new FormControl('', [Validators.required])
  })

  constructor(
    private pathService: PathService,
    private lineService: LineService,
    private nodeService: NodeService,
    private _snackBar: MatSnackBar
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
    if (this.path.valid) {
      const body = {
        lineCode: this.actualLine.code,
        direction: this.path.value['direction'],
        segmentList: this.createSegments.segments,
        firstNode: this.path.value['firstNode'],
        lastNode: this.path.value['lastNode'],
        isEmpty: this.path.value['isEmpty']
      }

      this.pathService.create(body).subscribe(
        res => {
          this._snackBar.open("Path created succesfully!", "Ok", { duration: 2000 })
        },
        err => { console.error(err) }
      )
    }
    else { this._snackBar.open("Please fill the form correctly", "Ok", { duration: 2000 }) }
  }

  selectLine() {
    this.selectedLine = true;
    this.selectedOrientation = false;
    this.actualLine = this.path.value['line'];
  }

  lineOrientation() {
    if (this.path.value['direction'] == "go") {
      this.path.setValue({
        line: this.actualLine,
        direction: 'go',
        firstNode: this.actualLine.terminalNodes[0],
        lastNode: this.actualLine.terminalNodes[1],
        isEmpty: ''
      })
    }
    else {
      this.path.setValue({
        line: this.actualLine,
        direction: 'return',
        firstNode: this.actualLine.terminalNodes[1],
        lastNode: this.actualLine.terminalNodes[0],
        isEmpty: ''
      })
    }
    this.selectedOrientation = true;
  }

}
