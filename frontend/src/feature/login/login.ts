import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppSessionService } from '../../common/service/app-session';

@Component({
  imports: [RouterOutlet],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  
 constructor(
    appSessionService: AppSessionService,
    private router: Router,
  ) {
    if (!this.router.url.includes('/change-password')) {
      appSessionService.clearSession();
    }
  }
}
