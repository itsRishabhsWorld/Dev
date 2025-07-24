export interface Product {
  _id: string;
  name: string;
  genericName: string;
  brandName?: string;
  manufacturer: string;
  category: ProductCategory;
  dosageForm: DosageForm;
  strength: string;
  packSize: string;
  batchNumber: string;
  expiryDate: Date;
  manufacturingDate: Date;
  price: {
    mrp: number;
    costPrice: number;
    sellingPrice: number;
  };
  stock: {
    quantity: number;
    minStockLevel: number;
    unit: StockUnit;
  };
  supplier: {
    name: string;
    contact?: string;
    email?: string;
  };
  description?: string;
  sideEffects?: string[];
  contraindications?: string[];
  storage?: {
    temperature?: string;
    conditions?: string;
  };
  prescriptionRequired: boolean;
  status: ProductStatus;
  images?: string[];
  barcode?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual properties
  isExpired?: boolean;
  isLowStock?: boolean;
}

export type ProductCategory = 
  | 'Antibiotics'
  | 'Analgesics'
  | 'Antacids'
  | 'Antihistamines'
  | 'Cardiovascular'
  | 'Diabetes'
  | 'Respiratory'
  | 'Dermatology'
  | 'Neurology'
  | 'Oncology'
  | 'Pediatrics'
  | 'Vitamins & Supplements'
  | 'Other';

export type DosageForm = 
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Injection'
  | 'Cream'
  | 'Ointment'
  | 'Drops'
  | 'Inhaler'
  | 'Patch'
  | 'Other';

export type StockUnit = 
  | 'Pieces'
  | 'Bottles'
  | 'Boxes'
  | 'Strips'
  | 'Vials';

export type ProductStatus = 
  | 'Active'
  | 'Inactive'
  | 'Discontinued';

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  expiredProducts: number;
  categoriesStats: Array<{
    _id: string;
    count: number;
  }>;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  lowStock?: boolean;
  expired?: boolean;
}

export interface CreateProductRequest {
  name: string;
  genericName: string;
  brandName?: string;
  manufacturer: string;
  category: ProductCategory;
  dosageForm: DosageForm;
  strength: string;
  packSize: string;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  price: {
    mrp: number;
    costPrice: number;
    sellingPrice: number;
  };
  stock: {
    quantity: number;
    minStockLevel: number;
    unit: StockUnit;
  };
  supplier: {
    name: string;
    contact?: string;
    email?: string;
  };
  description?: string;
  sideEffects?: string[];
  contraindications?: string[];
  storage?: {
    temperature?: string;
    conditions?: string;
  };
  prescriptionRequired: boolean;
  status?: ProductStatus;
  images?: string[];
  barcode?: string;
}

export interface UpdateStockRequest {
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}