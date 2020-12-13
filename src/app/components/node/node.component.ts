import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private nodeService: NodeService) {
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
    
    this.nodeService.create(body)
      .subscribe(
        res => {
          this.nodeList.fetchNodes();
          alert("Node created succesfully!");
        },
        err => {
          console.log(err);
          alert("The node couldn't be created");
        }
      );
  }

}
