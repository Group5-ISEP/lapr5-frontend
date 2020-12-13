import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NodeService } from '../../services/node.service';
import Node from '../../domain/Node';

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.css']
})
export class NodeListComponent implements OnInit {
  displayedColumns: string[] = ['shortName', 'name', 'isDepot', 'reliefPoint', 'longitude', 'latitude'];
  dataSource: MatTableDataSource<Node>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  nodes: Node[];

  constructor(private nodeService: NodeService) {
    this.fetchNodes();
  }

  ngOnInit(): void {
  }

  fetchNodes() {
    this.nodeService.getNodes().subscribe(
      res => {
        this.nodes = res;
        console.log("Fetched nodes from backend");
        this.dataSource = new MatTableDataSource<Node>(this.nodes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => { console.log(err); }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
