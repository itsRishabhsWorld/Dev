import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Product, 
  ProductsResponse, 
  ProductStats, 
  ProductFilters, 
  CreateProductRequest,
  UpdateStockRequest 
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = '/api/products';

  constructor(private http: HttpClient) {}

  getProducts(filters?: ProductFilters): Observable<ProductsResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProductsResponse>(this.API_URL, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  getProductStats(): Observable<ProductStats> {
    return this.http.get<ProductStats>(`${this.API_URL}/stats`);
  }

  createProduct(product: CreateProductRequest): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(this.API_URL, product);
  }

  updateProduct(id: string, product: Partial<CreateProductRequest>): Observable<{ message: string; product: Product }> {
    return this.http.put<{ message: string; product: Product }>(`${this.API_URL}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }

  updateStock(id: string, stockUpdate: UpdateStockRequest): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(`${this.API_URL}/${id}/update-stock`, stockUpdate);
  }

  // Utility methods
  isExpired(product: Product): boolean {
    return new Date(product.expiryDate) < new Date();
  }

  isLowStock(product: Product): boolean {
    return product.stock.quantity <= product.stock.minStockLevel;
  }

  getDaysUntilExpiry(product: Product): number {
    const today = new Date();
    const expiryDate = new Date(product.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}