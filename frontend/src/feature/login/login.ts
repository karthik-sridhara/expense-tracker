import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSessionService } from '../../common/service/app-session';

@Component({
  imports: [RouterOutlet],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  
  constructor(private appSessionService: AppSessionService) {
    appSessionService.clearSession();
  }
}
