import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from '../common/component/toast/toast-container';
import { Loader } from '../common/component/loader/loader';

@Component({
  imports: [RouterOutlet, ToastContainer, Loader],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('expense-tracker');
}
