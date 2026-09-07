import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  imports: [RouterOutlet],
  providers:[LoginService],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {}
