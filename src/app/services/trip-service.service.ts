import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NodeTimetableDto } from '../domain/NodeTimetableDto';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  mockSchedule: NodeTimetableDto = {
    schedule: [
      { line: "201", destinationName: "Boavista", passingTime: 19800 },
      { line: "201", destinationName: "Boavista", passingTime: 1000 },
      { line: "201", destinationName: "Boavista", passingTime: 10000 },
      { line: "201", destinationName: "Boavista", passingTime: 68400 },
      { line: "201", destinationName: "Boavista", passingTime: 79200 },
      { line: "201", destinationName: "Boavista", passingTime: 500 },
    ]
  }

  constructor() { }

  getScheduleByNode(nodeId: string): Observable<NodeTimetableDto> {
    if (nodeId === "FTM")
      return of(this.mockSchedule)

    return of({ schedule: [] })
  }
}
