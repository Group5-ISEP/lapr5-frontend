import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const prefix = "/api/user/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(user) {
    var body = { email: user.email, password: user.password, type: "user" };
    console.log("Creating user with:");
    console.log(body);
    return this.http.post(environment.masterDataURL + prefix, body);
  }

  login(user) {
    var body = { email: user.email, password: user.password};
    console.log("Loging user with:");
    console.log(body);
    return this.http.post(environment.masterDataURL + prefix + 'login', body);
  }

  //Actual user, it's id is in the localstorage of the app
  getUser(email) {
    return this.http.get(environment.masterDataURL + prefix);
  }
}
