import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NodeTimetableDto } from '../domain/NodeTimetableDto';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  mockSchedule: NodeTimetableDto = {
    schedule: [
      { line: "201", destinationName: "Boavista", timeInstant: 19800 },
      { line: "201", destinationName: "Boavista", timeInstant: 1000 },
      { line: "201", destinationName: "Boavista", timeInstant: 10000 },
      { line: "201", destinationName: "Boavista", timeInstant: 68400 },
      { line: "201", destinationName: "Boavista", timeInstant: 79200 },
      { line: "201", destinationName: "Boavista", timeInstant: 500 },
    ]
  }

  constructor(private http: HttpClient) { }

  getScheduleByNode(nodeId: string): Observable<NodeTimetableDto> {
    return this.http.get<NodeTimetableDto>(environment.masterDataViagensURL + '/api/trips/timetable/' + nodeId)
      .pipe(
        catchError(err => of(null))
      )
  }
}
