import { Component } from '@angular/core';
import { Header } from './components/header/header';

@Component({
  imports: [Header],
  selector: 'app-product-landing',
  styleUrl: './product-landing.css',
  templateUrl: './product-landing.html',
})
export class ProductLanding {}
