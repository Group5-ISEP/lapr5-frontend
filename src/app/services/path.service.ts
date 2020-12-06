import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Path from '../domain/Path';


@Injectable({
  providedIn: 'root'
})
export class PathService {

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

  constructor() { }

  //TODO: IMPLEMENT HTTP
  getPaths(): Observable<Path[]> {
    return of(this.mockPaths)
  }
}
