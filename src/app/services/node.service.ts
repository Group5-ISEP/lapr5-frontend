import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INode } from '../components/node/node.component';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

  create(node: INode) {
    console.log("Creating node with:");
    console.log(node);
    return this.http.post('http://localhost:3000/api/node', node);
  }
}
