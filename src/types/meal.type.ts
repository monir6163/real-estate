export interface SearchParamsType {
  page?: string;
  search?: string;
  cuisine?: string;
  dietary?: string;
  mealType?: string;
  spiceLevel?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface MealServiceType {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  cuisine?: string;
  dietary?: string;
  mealType?: string;
  spiceLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface MealType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  calories: number;
  ingredients: string[];
  cuisine?: string[];
  dietary?: string[];
  mealType: string | null;
  spiceLevel: string | null;
  providerId?: string;
}

export interface MealsClientPropsType {
  initialMeals: MealType[];
  initialPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  cuisines: string[];
  dietaryOptions: string[];
  mealTypes: string[];
}

export interface MealType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  calories: number;
  ingredients: string[];
  cuisine?: string[];
  dietary?: string[];
  mealType: string | null;
  spiceLevel: string | null;
}

export interface MealCardProps {
  meal: MealType;
}
