import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    // TODO: Check better hash (goodreads login)
    if(window.location.hash) {
      this.auth.parseHash();
      this.router.navigate(['dashboard']);
    }
  }
}
