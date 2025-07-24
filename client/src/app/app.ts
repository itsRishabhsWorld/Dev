import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="app-container">
      @if (authService.isLoading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading Bhatt Pharma...</p>
        </div>
      } @else {
        <router-outlet></router-outlet>
      }
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      gap: 16px;
    }
    
    .loading-container p {
      color: #666;
      font-size: 16px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Bhatt Pharma';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Authentication is initialized in the service constructor
  }
}
