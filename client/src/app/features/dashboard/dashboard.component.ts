import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Navigation -->
      <mat-toolbar color="primary" class="toolbar">
        <span>Bhatt Pharma - Dashboard</span>
        <span class="spacer"></span>
        <span class="user-info">Welcome, {{authService.currentUser?.name}}</span>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="main-content">
        <div class="page-container">
          <h1>Dashboard</h1>
          
          <!-- Quick Stats -->
          <div class="stats-grid">
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">inventory</mat-icon>
                  <div class="stat-info">
                    <h3>Total Products</h3>
                    <p class="stat-number">Loading...</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">warning</mat-icon>
                  <div class="stat-info">
                    <h3>Low Stock</h3>
                    <p class="stat-number">Loading...</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">schedule</mat-icon>
                  <div class="stat-info">
                    <h3>Expired</h3>
                    <p class="stat-number">Loading...</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">check_circle</mat-icon>
                  <div class="stat-info">
                    <h3>Active Products</h3>
                    <p class="stat-number">Loading...</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Quick Actions -->
          <div class="actions-section">
            <h2>Quick Actions</h2>
            <div class="actions-grid">
              <mat-card class="action-card" (click)="navigateTo('/products')">
                <mat-card-content>
                  <mat-icon>inventory_2</mat-icon>
                  <h3>View Products</h3>
                  <p>Browse and manage pharmaceutical products</p>
                </mat-card-content>
              </mat-card>

              <mat-card class="action-card" (click)="navigateTo('/products/new')">
                <mat-card-content>
                  <mat-icon>add_circle</mat-icon>
                  <h3>Add Product</h3>
                  <p>Add new pharmaceutical product to inventory</p>
                </mat-card-content>
              </mat-card>

              @if (authService.isAdmin) {
                <mat-card class="action-card" (click)="navigateTo('/users')">
                  <mat-card-content>
                    <mat-icon>people</mat-icon>
                    <h3>Manage Users</h3>
                    <p>Add and manage system users</p>
                  </mat-card-content>
                </mat-card>
              }

              <mat-card class="action-card" (click)="navigateTo('/profile')">
                <mat-card-content>
                  <mat-icon>person</mat-icon>
                  <h3>Profile</h3>
                  <p>Update your profile information</p>
                </mat-card-content>
              </mat-card>
            </div>
          </div>

          <!-- User Role Info -->
          <div class="role-info">
            <mat-card>
              <mat-card-content>
                <h3>Your Role: {{authService.currentUser?.role | titlecase}}</h3>
                <p>Email: {{authService.currentUser?.email}}</p>
                <p>Last Login: {{authService.currentUser?.lastLogin | date:'medium'}}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      margin-right: 16px;
      font-size: 14px;
    }

    .main-content {
      padding: 24px;
    }

    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      cursor: default;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .stat-info h3 {
      margin: 0;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-number {
      margin: 4px 0 0 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .actions-section {
      margin-bottom: 32px;
    }

    .actions-section h2 {
      color: #333;
      margin-bottom: 16px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .action-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .action-card mat-card-content {
      text-align: center;
      padding: 24px;
    }

    .action-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .action-card h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .role-info {
      margin-top: 32px;
    }

    .role-info mat-card-content {
      text-align: center;
    }

    .role-info h3 {
      margin: 0 0 16px 0;
      color: #1976d2;
    }

    .role-info p {
      margin: 8px 0;
      color: #666;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    // Load dashboard data
    this.loadStats();
  }

  loadStats() {
    // This will be implemented when we have the backend running
    // For now, we'll show loading...
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
  }
}