export type RecipeCategory = 'veg' | 'non-veg';

export interface Ingredient {
    id: string;
    name: string;
    amount: string;
  }
  
export interface Recipe {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    ingredients: Ingredient[];
    instructions: string[];
    cookingTime: number;
    category: RecipeCategory;
}