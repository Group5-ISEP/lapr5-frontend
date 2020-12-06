import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILine } from '../components/line/line.component';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  constructor(private http: HttpClient) { }

  create(line: ILine) {
    console.log("Creating line with:");
    console.log(line);
    return this.http.post('http://localhost:3000/api/line', line);
  }
}
