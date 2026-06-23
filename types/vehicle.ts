export interface Vehicle {
  id: number | string;
  name: string;
  type: string;
  transmission: string;
  capacity: number;
  price: string | number;
  location: string;
  image: string;
  category: string;
  rating: string | number;
  reviews: number;
  fuel: string;
  gallery: string[];
  features: any[];
  rules: string[];
  brand_id?: number | string;
  category_id?: number | string;
  model?: string;
}

export interface VehicleResponse {
  data: Vehicle[];
  total?: number;
  page?: number;
  limit?: number;
}
