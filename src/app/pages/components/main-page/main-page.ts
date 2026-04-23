import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule, RouterLink, RouterOutlet],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  protected readonly theme = inject(ThemeService);

  isMobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  logout(): void {
    this.auth.logout();
  }
}
