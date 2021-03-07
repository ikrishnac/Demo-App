import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { HttpClientService } from '../services/http-client-service.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent implements OnInit {

  updateForm: FormGroup;
  userProfile: any
  error: any;

  constructor(private formBuilder: FormBuilder, private httpClientService: HttpClientService, private router: Router) { }

  ngOnInit(): void {
    const username = new MDCTextField(document.querySelector('.username'));
    const lastname = new MDCTextField(document.querySelector('.lastname'));
    const bio = new MDCTextField(document.querySelector('.bio'));
    const country = new MDCTextField(document.querySelector('.country'));
    const email = new MDCTextField(document.querySelector('.email'));
    new MDCRipple(document.querySelector('.next'));

    this.updateForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      bio: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });

    this.userProfile = this.httpClientService.userProfileValue.data;
    this.updateForm.patchValue({
      firstname: this.userProfile.firstname,
      lastname: this.userProfile.lastname,
      bio: this.userProfile.bio,
      country: this.userProfile.country,
      email: this.userProfile.email
    })
  }

  updateInfo() {
    if (!this.updateForm.valid) {
      return;
    } else {
      this.httpClientService.updateUser(this.updateForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['home']);
          },
          error: error => {
            this.error = error;
            setTimeout(() => {
              this.error = '';
            }, 3000);
          }
        });
    }
  }
}
