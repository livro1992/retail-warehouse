import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Router } from '@angular/router';
import {
  UiAlertService,
  UiCardComponent,
  UiPasswordFieldComponent,
  UiTextFieldComponent,
} from '../../../shared/ui';
import { TokenStorageService } from '../../../core/auth/token-storage.service';
import { LoginService } from '../../services/login_service';

@Component({
  selector: 'app-login',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    UiCardComponent,
    UiTextFieldComponent,
    UiPasswordFieldComponent
  ],
  styleUrls: ['./login.style.scss'],
  templateUrl: './login.html',
  standalone: true,
})
export class LoginComponent {
  email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)]
  });

  constructor(
    private router: Router,
    private loginService: LoginService,
    private uiAlert: UiAlertService,
    private tokenStorage: TokenStorageService,
  ) {}

  form = new FormGroup({
    email: this.email,
    password: this.password
  });

  loading = signal(false);
  disabled = computed(() => this.loading() || this.form.invalid);

  async onSubmit() {
    this.router.navigate(['/backoffice']);
    /*this.loginService.login(this.form.value.email ?? '', this.form.value.password ?? '').subscribe({
      next: (res) => {
        this.tokenStorage.setToken(res.access_token);
        void this.router.navigate(['/backoffice']);
      },
      error: (err: unknown) => {
        console.error(err);
        this.uiAlert.error(this.httpErrorMessage(err));
      },
    });*/
  }

  fillDemo() {
    this.form.setValue({ email: 'demo@retail.local', password: 'demo1234' });
  }

  private httpErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (typeof body === 'string' && body.trim()) {
        return body;
      }
      if (body && typeof body === 'object' && 'message' in body) {
        return String((body as { message: unknown }).message);
      }
      return err.message || `Errore di rete (${err.status}).`;
    }
    return 'Si è verificato un errore imprevisto.';
  }
}

