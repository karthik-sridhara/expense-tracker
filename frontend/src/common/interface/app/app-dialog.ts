import { Observable } from "rxjs";
import { InjectionToken } from '@angular/core';
import { DialogType, MessageDialogKind, MessageDialogTheme } from "../../enum/dialog";

export interface DialogConfig<Data = unknown> {
  data?: Data;
  type?: DialogType;
  width?: string;
  maxWidth?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
  class?: string;
}

export interface DialogResult<Result> {
  afterClosed(): Observable<Result | undefined>;
  close(result?: Result): void;
}

export const DIALOG_DATA = new InjectionToken<unknown>('DIALOG_DATA');


export interface MessageDialogData {
  title: string;
  message: string;
  kind?: MessageDialogKind;
  theme?: MessageDialogTheme;
  iconSrc?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface MessageDialogResult {
  confirmed: boolean;
}