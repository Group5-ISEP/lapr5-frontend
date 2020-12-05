import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Line from './domain/Line';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  mockLines: Line[] = [
    { code: "201", name: "Ezc_Boavista", allowedDriverTypes: [], allowedVehicleTypes: [], colorRGB: { red: 3, green: 252, blue: 240 }, terminalNodes: ["EZC", "BOAV"] }
  ]

  constructor() { }

  //TODO: IMPLEMENT HTTP
  getLines(): Observable<Line[]> {
    return of(this.mockLines)
  }
}
