import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Node from './domain/Node';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  mockNodes: Node[] = [
    { shortname: "EZC", name: "Ezequiel Campos", latitude: 41.173550, longitude: -8.654367, isDepot: false, isReliefPoint: false },
    { shortname: "BOAV", name: "Boavista", latitude: 41.157978, longitude: -8.629242, isDepot: false, isReliefPoint: true },
  ]

  constructor() { }

  //TODO: IMPLEMENT HTTP
  getNodes(): Observable<Node[]> {
    return of(this.mockNodes)
  }
}
