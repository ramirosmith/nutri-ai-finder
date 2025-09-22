export interface Ingredient {
  id: string;
  name: string;
  category: 'Proteínas' | 'Vegetales' | 'Frutas' | 'Granos' | 'Lácteos' | 'Especias' | 'Otros';
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: number;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  dietaryInfo: string[];
  healthBenefits: string[];
  isAIGenerated: boolean;
  imagePrompt: string;
}

export interface SearchFilters {
  mealType: string;
  ingredientQuery: string;
  dietaryPreferences: string[];
}

export interface UserProfile {
  favorites: string[];
  history: Recipe[];
}

export type ActiveView = 'search' | 'pantry';

export const MEAL_TYPES = [
  'Desayuno',
  'Almuerzo', 
  'Cena',
  'Snack',
  'Postre',
  'Bebida'
] as const;

export const DIETARY_PREFERENCES = [
  'Sin Gluten',
  'Vegano',
  'Vegetariano',
  'Keto',
  'Paleo',
  'Bajo en Sodio',
  'Alto en Proteína',
  'Bajo en Carbohidratos'
] as const;

export const INGREDIENT_CATEGORIES = [
  'Proteínas',
  'Vegetales', 
  'Frutas',
  'Granos',
  'Lácteos',
  'Especias',
  'Otros'
] as const;

export const SUGGESTED_INGREDIENTS: Omit<Ingredient, 'id'>[] = [
  { name: 'Pollo', category: 'Proteínas' },
  { name: 'Salmón', category: 'Proteínas' },
  { name: 'Tofu', category: 'Proteínas' },
  { name: 'Huevos', category: 'Proteínas' },
  { name: 'Quinoa', category: 'Granos' },
  { name: 'Arroz integral', category: 'Granos' },
  { name: 'Avena', category: 'Granos' },
  { name: 'Espinaca', category: 'Vegetales' },
  { name: 'Brócoli', category: 'Vegetales' },
  { name: 'Zanahorias', category: 'Vegetales' },
  { name: 'Aguacate', category: 'Frutas' },
  { name: 'Manzana', category: 'Frutas' },
  { name: 'Plátano', category: 'Frutas' },
  { name: 'Yogur griego', category: 'Lácteos' },
  { name: 'Queso cottage', category: 'Lácteos' },
  { name: 'Cúrcuma', category: 'Especias' },
  { name: 'Jengibre', category: 'Especias' },
  { name: 'Ajo', category: 'Especias' }
];