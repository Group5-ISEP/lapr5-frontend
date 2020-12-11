import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NodeService } from '../../services/node.service';
import Node from '../../domain/Node';
import { MatTableDataSource } from '@angular/material/table';

export interface INode {
  shortName: string,
  name: string,
  isDepot: boolean,
  isReliefPoint: boolean,
  longitude: number,
  latitude: number
}

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  displayedColumns: string[] = ['shortName', 'name', 'isDepot', 'reliefPoint', 'longitude', 'latitude'];
  dataSource: MatTableDataSource<Node>;

  nodes: Node[];

  node = new FormGroup({
    shortName: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    isDepot: new FormControl('', [Validators.required]),
    isReliefPoint: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required])
  })

  constructor(private nodeService: NodeService) {
    this.nodeService.getNodes().subscribe(
      res => {
        this.nodes = res;
        console.log("Fetched nodes from backend");
        this.dataSource = new MatTableDataSource<Node>(this.nodes);
      },
      err => { console.log(err); }
    );
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const body = {
      shortName: this.node.value['shortName'],
      name: this.node.value['name'],
      isDepot: this.node.value['isDepot'],
      isReliefPoint: this.node.value['isReliefPoint'],
      longitude: this.node.value['longitude'],
      latitude: this.node.value['latitude']
    }
    //console.log(body);
    
    this.nodeService.create(body)
      .subscribe(
        res => {

        },
        err => {
          console.log(err);
          alert("The node couldn't be created");
        }
      );
  }

}
