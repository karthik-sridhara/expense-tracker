import { Component } from '@angular/core';
import { Button } from '../../common/ui/button';
import { Input } from '../../common/ui/input';

@Component({
  imports: [Button,Input],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {}
