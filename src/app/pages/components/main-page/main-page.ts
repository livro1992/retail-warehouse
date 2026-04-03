import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';  
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenStorageService } from '../../../core/auth/token-storage.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule, RouterLink, RouterOutlet],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {

  isMobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  logout(): void {
    this.tokenStorage.clear();
    void this.router.navigate(['/login']);
  }
}
