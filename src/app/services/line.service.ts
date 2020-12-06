import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Line from '../domain/Line';
import { HttpClient } from '@angular/common/http';
import { ILine } from '../components/line/line.component';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  mockLines: Line[] = [
    { code: "201", name: "Ezc_Boavista", allowedDriverTypes: [], allowedVehicleTypes: [], colorRGB: { red: 3, green: 252, blue: 240 }, terminalNodes: ["EZC", "BOAV"] }
  ]

  constructor(private http: HttpClient) { }

  //TODO: IMPLEMENT HTTP
  getLines(): Observable<Line[]> {
    return of(this.mockLines)
  }

  //TODO: change the url to use the one on CONFIG
  create(line: ILine) {
    console.log("Creating line with:");
    console.log(line);
    return this.http.post('http://localhost:3000/api/line', line);
  }
}
