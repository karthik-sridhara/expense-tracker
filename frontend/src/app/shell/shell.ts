import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AppLogo } from '../../common/ui/app-logo';
import { Button } from '../../common/ui/button';
import { Input } from '../../common/ui/input';
import { NgTemplateOutlet, UpperCasePipe, NgClass } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AppSessionService } from '../../common/service/app-session';
import { DividerLine } from '../../common/ui/divider-line';
import { SvgIcon } from '../../common/ui/svg-icon';


@Component({
  imports: [RouterOutlet, AppLogo, Input, Button, NgTemplateOutlet, ReactiveFormsModule, UpperCasePipe, DividerLine, NgClass],
  selector: 'app-shell',
  styleUrl: './shell.css',
  templateUrl: './shell.html',
})
export class Shell {
  
  notificationCount = 3;
  profileName!: string;
  profileRole!: string;
  searchControl!:FormControl;
  showSearch = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);

  constructor(private fb: FormBuilder,private appSession:AppSessionService) {
    const user = this.appSession.getUser();
    this.profileName = user?.name || '';
    this.profileRole = user?.role || '';


    this.searchControl = this.fb.control('');
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      takeUntilDestroyed()
    )
    .subscribe(value => {
      this.showSearch.set(Boolean(value?.trim()));
    });

  }


  clearSearch() {
    this.searchControl.setValue('');
    this.showSearch.set(false);
  }

  onMenuClick() {
    this.isMenuOpen.update(value => !value);
  }
}
