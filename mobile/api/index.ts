import axios from '../utils/axios';

export interface ApiResponse<T> {
  message?: string;
  result: T;
  code?: number;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  imageUrl?: string;
  productCount?: number;
}

export interface ProductVariantResponse {
  id: number;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
  color?: string;
  size?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  rating: number;
  soldCount: number;
  discountPercentage: number;
  imageUrls: string[];
  isNew: boolean;
  category?: CategoryResponse;
  variants?: ProductVariantResponse[];
}

export const getCategories = async () => {
  const response = await axios.get<ApiResponse<CategoryResponse[]>>('/categories');
  return response.data.result || [];
};

export const getProducts = async (params?: any) => {
  const response = await axios.get<ApiResponse<Page<ProductResponse>>>('/products', { params });
  return response.data.result;
};

export const getFlashSaleProducts = async () => {
  const response = await axios.get<ApiResponse<Page<ProductResponse>>>('/products', {
    params: { size: 10, sort: 'id,desc' } // Dùng id,desc cho chắc chắn
  });
  return response.data.result?.content || [];
};

export const getProductBySlug = async (slug: string) => {
  const response = await axios.get<ApiResponse<ProductResponse>>(`/products/${slug}`);
  return response.data.result;
};

// --- Auth ---
export const loginApi = async (data: any) => {
  const response = await axios.post('/auth/authenticate', data);
  return response.data;
};

export const registerApi = async (data: any) => {
  const response = await axios.post('/auth/register', data);
  return response.data;
};

// --- Orders ---
export const checkoutApi = async (data: any) => {
  const response = await axios.post('/orders/checkout', data);
  return response.data;
};

export const getMyOrdersApi = async () => {
  const response = await axios.get('/orders/my-orders');
  return response.data;
};
