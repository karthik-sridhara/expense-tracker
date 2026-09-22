import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { AppSessionService } from '../../../common/service/app-session';
import { LoginService } from '../../../common/service/login.service';
import { Button } from '../../../common/ui/button';
import { SvgIcon } from '../../../common/ui/svg-icon';
import { ThemeToggle } from '../../../common/ui/theme-toggle';

@Component({
  selector: 'app-profile-dialog',
  imports: [Button],
  template: `
    <header class="flex items-center gap-3  bg-white px-5 py-4 dark:bg-slate-950">
      <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-base font-bold text-white">
        {{ initial() }}
      </span>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{{ user()?.name }}</p>
        <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ user()?.email }}</p>
        <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ user()?.role }}</p>
      </div>
    </header>

    <nav class="flex flex-col gap-1 border-y border-slate-200 dark:border-slate-800  bg-white p-2 dark:bg-slate-950">
      <button
        uiButton
        type="button"
        variant="ghost"
        color="default"
        size="md"
        class="justify-start!"
        icon="/icons/settings_fill.svg"
        (click)="goToSettings()"
      >
        Settings
      </button>
    </nav>

    <footer class="bg-slate-100 p-2 dark:bg-slate-900">
      <button
        uiButton
        type="button"
        variant="ghost"
        color="error"
        size="md"
        class="w-full justify-start!"
        icon="/icons/logout.svg"
        (click)="signOut()"
      >
        Sign out
      </button>
    </footer>
  `,
  host: {
    class: 'block flex w-72 flex-col text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-800'
  }
})
export class ProfileDialogComponent {
  private readonly dialogRef = inject(DialogRef);
  private readonly appSession = inject(AppSessionService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  protected readonly user = computed(() => this.appSession.getUser());
  protected readonly initial = computed(() => this.user()?.name?.charAt(0)?.toUpperCase() ?? '');

  protected goToSettings(): void {
    this.dialogRef.close();
    this.router.navigateByUrl('/settings');
  }

  protected signOut(): void {
    this.dialogRef.close();
    this.loginService.onLogout();
  }
}