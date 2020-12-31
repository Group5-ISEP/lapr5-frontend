import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Line from '../../domain/Line';
import Path from '../../domain/Path';
import { PathService } from '../../services/path.service';

@Component({
  selector: 'app-path-list',
  templateUrl: './path-list.component.html',
  styleUrls: ['./path-list.component.css']
})
export class PathListComponent implements OnInit {
  displayedColumns: string[] = ['direction', 'segments', 'firstNode', 'lastNode', 'isEmpty'];
  dataSource: MatTableDataSource<Path>;

  @Input()
  lines: Line[];

  selectedLine: Line;
  paths: Path[];

  lineSelected: boolean = false;
  emptyLine: boolean = false;

  constructor(private pathService: PathService) { }

  ngOnInit(): void {
  }

  selectLine(l: Line) {
    this.selectedLine = l;
    this.lineSelected = true;
    this.fetchPaths(this.selectedLine.code);
  }

  fetchPaths(lineCode: string) {
    this.pathService.getPaths(lineCode).subscribe(
      res => {
        this.paths = res;
        console.log("Fetched " + this.paths.length + " PATHS");
        this.dataSource = new MatTableDataSource<Path>(this.paths);
        if (this.paths.length < 1) { this.emptyLine = true; }
        else { this.emptyLine = false; }
      },
      err => { this.emptyLine = true; console.error(err) }
    )
  }

}
