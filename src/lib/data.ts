import type { Item } from './types';

export const initialItems: Item[] = [
  { id: '1', code: 'FR-001', description: 'Apple', group: 'Fruit', maxDaily: 4 },
  { id: '2', code: 'FR-002', description: 'Banana', group: 'Fruit', maxDaily: 2 },
  { id: '3', code: 'VG-001', description: 'Carrot', group: 'Vegetable', maxDaily: 5 },
  { id: '4', code: 'VG-002', description: 'Broccoli', group: 'Vegetable', maxDaily: 3 },
  { id: '5', code: 'PR-001', description: 'Chicken Breast', group: 'Protein', maxDaily: 2 },
  { id: '6', code: 'PR-002', description: 'Salmon Fillet', group: 'Protein', maxDaily: 1 },
  { id: '7', code: 'DA-001', description: 'Yogurt', group: 'Dairy', maxDaily: 3 },
  { id: '8', code: 'DA-002', description: 'Milk', group: 'Dairy', maxDaily: 2 },
  { id: '9', code: 'GR-001', description: 'Oats', group: 'Grains', maxDaily: 2 },
  { id: '10', code: 'GR-002', description: 'Brown Rice', group: 'Grains', maxDaily: 3 },
  { id: '11', code: 'SN-001', description: 'Almonds', group: 'Snacks', maxDaily: 1 },
];
