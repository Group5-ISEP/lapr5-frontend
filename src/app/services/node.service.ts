import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { INode } from '../components/node/node.component';
import Node from '../domain/Node';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  mockNodes: Node[] = [
    { shortName: "EZC", name: "Ezequiel Campos", latitude: 41.173550, longitude: -8.654367, isDepot: false, isReliefPoint: false },
    { shortName: "FTM", name: "Fonte da Moura", latitude: 41.163600, longitude: -8.662947, isDepot: false, isReliefPoint: false },
    { shortName: "BOAV", name: "Boavista", latitude: 41.157978, longitude: -8.629242, isDepot: false, isReliefPoint: true },
  ]

  constructor(private http: HttpClient) { }

  //TODO: URL in CONFIG file
  create(node: INode) {
    console.log("Creating node with:");
    console.log(node);
    return this.http.post('http://localhost:3000/api/node', node);
  }

  //TODO: IMPLEMENT HTTP
  getNodes(): Observable<Node[]> {
    //return of(this.mockNodes)
    return this.http.get<Node[]>(environment.masterDataURL + '/api/node')
  }
}
