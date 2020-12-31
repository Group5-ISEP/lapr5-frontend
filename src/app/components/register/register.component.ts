import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required, Validators.minLength(4), Validators.maxLength(20)
    ])
  });

  invalidPass: boolean = false;
  invalidEmail: boolean = false;
  showTerms: boolean = false;
  checked: boolean = false;

  constructor(private userService: UserService,
  private router: Router) { }

  ngOnInit(): void {
  }

  showDataPolicy() {
    this.showTerms = true;
  }

  onSubmit() {
    if (this.user.controls.email.invalid) {
      this.invalidEmail = true;
    }
    if (this.user.controls.password.invalid) {
      this.invalidPass = true;
    }
    if (this.user.controls.email.valid && this.user.controls.password.valid) {
      this.userService.createUser(this.user.value).subscribe(
        res => {
          console.log("New user created");
          this.router.navigate(['login']);
        },
        err => {
          console.error(err);
        });
    }
  }

}
