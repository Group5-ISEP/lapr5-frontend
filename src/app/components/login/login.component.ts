import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required, Validators.minLength(4), Validators.maxLength(20)
    ])
  });

  invalidEmail: boolean = false;
  invalidPass: boolean = false;
  showErrorMessage = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.user.controls.email.invalid) {
      this.invalidEmail = true;
    }
    if (this.user.controls.password.invalid) {
      this.invalidPass = true;
    }
    if (this.user.controls.email.valid && this.user.controls.password.valid) {
      this.userService.login(this.user.value)
        .subscribe(
          res => {
            localStorage.setItem('token', res['token']);
            localStorage.setItem('userType', res['userType']);
//            localStorage.setItem('id', res['id']);
            this.router.navigate(['']);
          },
          err => {
            console.error(err);
            this.showErrorMessage = true;
            this._snackBar.open("Login failed: Incorrect email or password", "Ok");
          }
        );
    }
  }

}
