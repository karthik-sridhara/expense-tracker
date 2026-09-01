import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { AppLogo } from '../../common/ui/app-logo';
import { Accordion } from "../../common/ui/accordion";
import { Button } from '../../common/ui/button';
import { SvgIcon } from '../../common/ui/svg-icon';

@Component({
  imports: [Header, AppLogo, Accordion,Button,SvgIcon],
  selector: 'app-product-landing',
  styleUrl: './product-landing.css',
  templateUrl: './product-landing.html',
  host: {
    class: 'relative overflow-y-auto'
  }
})
export class ProductLanding {}
