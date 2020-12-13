import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Line from '../domain/Line';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  /**
   * ONLY FOR USE IN TESTING
   */
  mockLines: Line[] = [
    { code: "201", name: "Ezc_Boavista", allowedDriverTypes: [], allowedVehicleTypes: [], colorRGB: { red: 3, green: 252, blue: 240 }, terminalNodes: ["EZC", "BOAV"] }
  ]

  constructor(private http: HttpClient) { }

  getLines(): Observable<Line[]> {
    return this.http.get<Line[]>(environment.masterDataURL + '/api/lines');
  }

  create(line: Line) {
    return this.http.post(environment.masterDataURL + '/api/lines', line);
  }
}
