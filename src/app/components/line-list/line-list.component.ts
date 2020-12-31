import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Line from '../../domain/Line';
import { LineService } from '../../services/line.service';

@Component({
  selector: 'app-line-list',
  templateUrl: './line-list.component.html',
  styleUrls: ['./line-list.component.css']
})
export class LineListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'name', 'terminalNodes', 'colorRGB', 'driverTypes', 'vehicleTypes'];
  dataSource: MatTableDataSource<Line>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  lines: Line[];

  constructor(private lineService: LineService) {
    this.fetchLines();
  }

  ngOnInit(): void {
  }

  fetchLines() {
    this.lineService.getLines().subscribe(
      lines => {
        this.lines = lines;
        this.dataSource = new MatTableDataSource<Line>(this.lines);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => { console.error(err) }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
