export interface Category {
  id: number;
  name: string;
}

export interface ProductWeightVariant {
  id?: number;
  weight_value: string;
  weight_unit: 'g' | 'kg';
  price: string;
  promotional_price: string;
  stock_quantity: string;
  is_available: boolean;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  detailed_description: string;
  ingredients: string;
  marketing_tags: string;
  image: File | null;
  category_id: string;
  is_featured: boolean;
  calories_kcal: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
  fiber_g: string;
  weight_variants: ProductWeightVariant[];
}

export interface ProductFormErrors {
  name?: string;
  slug?: string;
  description?: string;
  detailed_description?: string;
  ingredients?: string;
  marketing_tags?: string;
  image?: string;
  category_id?: string;
  is_featured?: string;
  calories_kcal?: string;
  protein_g?: string;
  carbs_g?: string;
  fat_g?: string;
  fiber_g?: string;
  weight_variants?: string;
  [key: `weight_variants.${number}.${string}`]: string;
}

export interface NutritionalInfo {
  calories_kcal: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
  fiber_g: string;
}
