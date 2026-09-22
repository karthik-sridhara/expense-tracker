import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { AppLogo } from '../../../../common/ui/app-logo';
import { Button } from '../../../../common/ui/button';
import { Input } from '../../../../common/ui/input';
import { AppSessionService } from '../../../../common/service/app-session';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeToggle } from '../../../../common/ui/theme-toggle';
import { DialogService } from '../../../../common/component/app-dialog/app-dialog.service';
import { ProfileDialogComponent } from '../profile-dialog';
import { DialogType } from '../../../../common/enum/dialog';




@Component({
  selector: 'header[shellHeader]',
  templateUrl: './header.html',
  imports: [
    AppLogo,
    Input,
    Button,
    ReactiveFormsModule,
    UpperCasePipe,
    ThemeToggle,
    NgTemplateOutlet
  ],
  host: {
    class: 'z-30 shrink-0 border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900'
  }
})
export class Header {

  notificationCount = signal<number>(3);
  profileName!: string;
  profileRole!: string;
  searchControl!:FormControl;
  showSearchClose = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private appSession:AppSessionService,
    private dialogService:DialogService
  ) {
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
      this.showSearchClose.set(Boolean(value?.trim()));
    });

  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  openProfileDialog() {
    this.dialogService.open<ProfileDialogComponent>(
      ProfileDialogComponent,
      {
        type: DialogType.ProfilePop
      }
    );
  }
}