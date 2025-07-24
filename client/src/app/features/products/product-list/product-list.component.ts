import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="page-container">
      <h1>Products</h1>
      <mat-card>
        <mat-card-content>
          <p>Product list will be implemented here.</p>
          <button mat-raised-button color="primary" (click)="goBack()">
            Back to Dashboard
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProductListComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}