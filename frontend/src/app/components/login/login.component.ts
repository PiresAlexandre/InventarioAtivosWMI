import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;

  error_login: string | null = null;
  error_register: string | null = null;
  loginForm: FormGroup;
  registerForm: FormGroup;
  toggle: boolean;
  activeLogin = 'nav-link active';
  activeRegister = 'nav-link ';
  hide = true;
  hide2 = true;

  constructor(private auth: AuthenticationService, private router: Router, public userService: UserService, private fb: FormBuilder) {
    this.toggle = false;

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      password: ['', [Validators.required]],  
    });
  }

  toggleRegister() {
    this.toggle = true;
    this.activeLogin = 'nav-link ';
    this.activeRegister = 'nav-link active';
    this.loginForm.reset();
  }

  toggleLogin() {
    this.toggle = false;
    this.activeLogin = 'nav-link active';
    this.activeRegister = 'nav-link ';
    this.registerForm.reset();
  }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .subscribe(
        data => {
          this.error_login = null
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.router.navigate(['client'])

        },
        error => {
          console.log(error.error.message);
          if (error.status == 401) {
            if (error.error.message === "Email don't exist") {
              this.error_login = "Email não existe"
            }
            if (error.error.message === "Password Incorrect") {
              this.error_login = "Palavra-passe incorreta"
            }
          }

        }
      )
  }

  register() {
    console.log(this.registerForm.value);
    
    this.auth.registerUser(this.registerForm.value)
      .subscribe(
        data => {
       
            this.error_register = null
            this.toggleLogin();
          
        },
        error => {
          if (error.status == 400) {
            this.error_register = error.error.message
          }
        }

      );
  }
}
