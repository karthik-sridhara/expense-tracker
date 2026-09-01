import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { Button } from '../../../../common/ui/button';
import { AppLogo } from "../../../../common/ui/app-logo";
import { SvgIcon } from '../../../../common/ui/svg-icon';
import { ThemeToggle } from '../../../../common/ui/theme-toggle';
import { RouterLink } from "@angular/router";

@Component({
  imports: [Button, AppLogo, SvgIcon, ThemeToggle, RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
  host: {
    class: 'fixed top-0 left-0 w-full z-50'
  }
})
export class Header {
  readonly isMenuOpen = signal(false);
  readonly mobileMenuRef = viewChild<unknown,ElementRef<HTMLElement>>('mobileMenu',{read: ElementRef});
  readonly menuButtonRef = viewChild<unknown,ElementRef<HTMLElement>>('menuButton',{read: ElementRef});


  toggleMenu() { this.isMenuOpen.update(v => !v); }
  closeMenu() { this.isMenuOpen.set(false); }
  
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768) {
      this.closeMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
   
    const isClickInsideMenu = this.mobileMenuRef()?.nativeElement.contains(target);
    const isClickOnButton = this.menuButtonRef()?.nativeElement.contains(target);
    if (!isClickInsideMenu && !isClickOnButton) {
      this.closeMenu();
    }
  }
  
}
