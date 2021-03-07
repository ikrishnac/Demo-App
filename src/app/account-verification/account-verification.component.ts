import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { Router } from '@angular/router';
import { HttpClientService } from '../services/http-client-service.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-account-verification',
  templateUrl: './account-verification.component.html',
  styleUrls: ['./account-verification.component.scss']
})
export class AccountVerificationComponent implements OnInit {

  verifyForm: FormGroup;
  registeredUser: any;
  error: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private httpClientService: HttpClientService) { }

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      otp: ['', [Validators.required]]
    });
    const otp = new MDCTextField(document.querySelector('.otp'));
    new MDCRipple(document.querySelector('.next'));
    this.registeredUser = this.httpClientService.registeredValue;
    if (!this.registeredUser) {
      this.router.navigate(['login']);
    }
  }

  verify() {
    if (!this.verifyForm.valid) {
      return;
    } else {
      this.httpClientService.verify(this.verifyForm.value.otp, this.registeredUser.hashToken)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['login']);
          },
          error: error => {
            this.error = error;
            this.verifyForm.reset();
            setTimeout(() => {
              this.error = '';
            }, 3000);
          }
        });
    }
  }

}
