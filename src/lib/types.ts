export type Meal = 'desayuno' | 'almuerzo' | 'cena';

export const MEALS: Meal[] = ['desayuno', 'almuerzo', 'cena'];

export const DAYS_IN_MONTH = 31;

export interface Item {
  id: string;
  code: string;
  description: string;
  group: string;
  maxDaily: number;
}

export interface Schedule {
  [itemId: string]: {
    [day: number]: {
      [meal in Meal]: number;
    };
  };
}

export interface Totals {
  [itemId: string]: {
    total: number;
    remaining: number;
    isOverLimit: boolean;
  };
}

export type ViewMode = 'general' | 'detailed';
