import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Path from '../domain/Path';


@Injectable({
  providedIn: 'root'
})
export class PathService {

  /**
   * ONLY USE FOR TESTING
   */
  mockPaths: Path[] = [
    {
      lineCode: "201",
      direction: "To",
      firstNode: "EZC",
      lastNode: "BOAV",
      segmentList: [
        { startNode: "EZC", endNode: "FTM", distance: 1319, duration: 20, order: 1 },
        { startNode: "FTM", endNode: "BOAV", distance: 2850, duration: 15, order: 2 }
      ],
      isEmpty: false
    }
  ]

  constructor(private http: HttpClient) { }

  getPaths(lineCode: string): Observable<Path[]> {
    return this.http.get<Path[]>(environment.masterDataURL + `/api/path/${lineCode}`)
  }
}
