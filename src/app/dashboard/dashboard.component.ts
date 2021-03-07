import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpClientService } from '../services/http-client-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userData: any;

  constructor(private httpClientService: HttpClientService, private router: Router) { }

  ngOnInit(): void {
    this.httpClientService.getUser()
      .pipe(first())
      .subscribe({
        next: (userProfile) => {
          this.userData = userProfile.data;
        },
        error: error => {
          console.log(error);
        }
      });
  }


  updateDetails() {
    this.router.navigate(['update-account']);
  }
}
