import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../common/ui/button';
import { Input } from '../../common/ui/input';
import { AppSelect } from '../../common/ui/select';
import { AppFormControl } from '../../common/ui/form-control';
import { Gender } from '../../common/enum/gender';
import { ToastService } from '../../common/component/toast/toast-service';
import { Profile } from '../../common/interface/profile/profile';
import { ProfileService } from './profile.service';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

@Component({
  imports: [ReactiveFormsModule, Button, Input, AppSelect, AppFormControl],
  selector: 'app-setting',
  styleUrl: './setting.css',
  templateUrl: './setting.html',
  host: {
    class: 'block h-full w-full overflow-auto px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100',
  },
})
export class Setting implements OnInit, OnDestroy {
  protected readonly Gender = Gender;

  protected readonly currencies = this.loadCurrencies();
  protected readonly timezones: string[] = this.loadTimezones();

  profileForm!: FormGroup;
  nameControl!: FormControl;
  genderControl!: FormControl;
  dobControl!: FormControl;
  incomeControl!: FormControl;
  currencyControl!: FormControl;
  timezoneControl!: FormControl;

  /** Object URL of the image returned by GET /api/profile/image. Only set from that response. */
  protected readonly imagePreview = signal<string | null>(null);
  protected readonly imageError = signal<string | null>(null);
  private readonly name = signal('');
  protected readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || '?'
  );

  private loadedProfile: Profile | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastService: ToastService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadImage();
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  private createForm() {
    this.nameControl = this.fb.control(null, [Validators.required, Validators.maxLength(100)]);
    this.genderControl = this.fb.control(null);
    this.dobControl = this.fb.control(null);
    this.incomeControl = this.fb.control(null, [Validators.min(0.01)]);
    this.currencyControl = this.fb.control('USD', [Validators.required]);
    this.timezoneControl = this.fb.control(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      [Validators.required]
    );
    this.profileForm = this.fb.group({
      name: this.nameControl,
      gender: this.genderControl,
      dob: this.dobControl,
      income: this.incomeControl,
      currency: this.currencyControl,
      timezone: this.timezoneControl,
    });
    this.nameControl.valueChanges.subscribe((v) => this.name.set(v ?? ''));
  }

  private loadCurrencies(): { code: string; label: string }[] {
    const codes = ((Intl as any).supportedValuesOf?.('currency') as string[] | undefined) ?? ['USD', 'EUR', 'GBP', 'INR'];
    const names = new Intl.DisplayNames(['en'], { type: 'currency' });
    return codes.map((code) => ({ code, label: names.of(code) ?? code }));
  }

  private loadTimezones(): string[] {
    const zones = (Intl as any).supportedValuesOf?.('timeZone') as string[] | undefined;
    return zones ?? ['UTC', Intl.DateTimeFormat().resolvedOptions().timeZone];
  }

  private loadProfile() {
    this.profileService.getProfile().subscribe((res) => {
      this.loadedProfile = res.data;
      this.applyProfile(res.data);
    });
  }

  private applyProfile(profile: Profile) {
    this.profileForm.reset({
      name: profile.name,
      gender: profile.gender,
      dob: profile.dob,
      income: profile.income,
      currency: profile.currency,
      timezone: profile.timezone,
    });
  }

  private loadImage() {
    this.profileService.getImage().subscribe((blob) => {
      this.revokePreview();
      this.imagePreview.set(blob ? URL.createObjectURL(blob) : null);
    });
  }

  private revokePreview() {
    const current = this.imagePreview();
    if (current) URL.revokeObjectURL(current);
  }

  protected onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.imageError.set('Unsupported file type.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      this.imageError.set('Image must be 2 MB or smaller.');
      return;
    }
    this.imageError.set(null);
    this.profileService.uploadImage(file).subscribe(() => {
      this.toastService.showSuccess('Profile image updated');
      this.loadImage();
    });
  }

  protected removeImage() {
    this.imageError.set(null);
    this.profileService.deleteImage().subscribe(() => {
      this.toastService.showSuccess('Profile image removed');
      this.revokePreview();
      this.imagePreview.set(null);
    });
  }

  protected reset() {
    if (this.loadedProfile) {
      this.applyProfile(this.loadedProfile);
    }
  }

  protected save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const raw = this.profileForm.getRawValue();
    const body: Profile = {
      ...raw,
      gender: raw.gender || null,
      dob: raw.dob || null,
      income: raw.income === '' ? null : raw.income,
    };
    this.profileService.updateProfile(body).subscribe(() => {
      this.loadedProfile = body;
      this.toastService.showSuccess('Profile updated successfully');
    });
  }
}
