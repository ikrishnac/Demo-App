import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { HttpClientService } from '../services/http-client-service.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error: any;

  constructor(private formBuilder: FormBuilder, private httpClientService: HttpClientService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    const username = new MDCTextField(document.querySelector('.username'));
    const password = new MDCTextField(document.querySelector('.password'));
    new MDCRipple(document.querySelector('.cancel'));
    new MDCRipple(document.querySelector('.next'));
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    } else {
      this.httpClientService.login(this.loginForm.value.username, this.loginForm.value.password)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['home']);
          },
          error: error => {
            this.error = error;
            this.loginForm.reset();
            setTimeout(() => {
              this.error = '';
            }, 3000);
          }
        });
    }
  }

  signup() {
    if (!!this.loginForm.value.username && !!this.loginForm.value.password) {
      this.httpClientService.register(this.loginForm.value.username, this.loginForm.value.password)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['account-verify']);
          },
          error: error => {
            this.error = error;
            this.loginForm.reset();
            setTimeout(() => {
              this.error = '';
            }, 3000);
          }
        });
    }
  }

}
