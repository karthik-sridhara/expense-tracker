import { Component, signal } from '@angular/core';
import { RouterOutlet,  RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Button } from '../../common/ui/button';
import { NgTemplateOutlet,  NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerLine } from '../../common/ui/divider-line';
import { SideMenu } from '../../common/interface/app/side-menu';
import { Header } from "./components/header/header";
import { MENUS, MENUS_BY_ROLE } from './consts/menu';
import { AppSessionService } from '../../common/service/app-session';


@Component({
  imports: [RouterOutlet, Button, NgTemplateOutlet, ReactiveFormsModule, DividerLine, NgClass, RouterLink, RouterLinkActive, Header],
  selector: 'app-shell',
  styleUrl: './shell.css',
  templateUrl: './shell.html',
})
export class Shell {

  isMenuOpen = signal<boolean>(false);
  menus!: SideMenu[];

  constructor(private appSession:AppSessionService,private router: Router) {
    const user = this.appSession.getUser();
    if(!user ||!user.role) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadMenu(user.role);
  }

  private loadMenu(role: string){
    const menus: SideMenu[] = [];
    for (const menu of MENUS) {
      if (MENUS_BY_ROLE[role].has(menu.id)) {
        menus.push(menu);
      }
    }
    this.menus = menus;
  }

  onMenuClick() {
    this.isMenuOpen.update(value => !value);
  }

  onMenuItemClick(menu:SideMenu) {
    this.isMenuOpen.update(value => false);
  }
}
