import type { Item } from './types';

export const initialItems: Item[] = [
  { id: '1', code: 'FR-001', description: 'Manzana', group: 'Fruta', maxDaily: 4 },
  { id: '2', code: 'FR-002', description: 'Banana', group: 'Fruta', maxDaily: 2 },
  { id: '3', code: 'VG-001', description: 'Zanahoria', group: 'Verdura', maxDaily: 5 },
  { id: '4', code: 'VG-002', description: 'Brócoli', group: 'Verdura', maxDaily: 3 },
  { id: '5', code: 'PR-001', description: 'Pechuga de Pollo', group: 'Proteína', maxDaily: 2 },
  { id: '6', code: 'PR-002', description: 'Filete de Salmón', group: 'Proteína', maxDaily: 1 },
  { id: '7', code: 'DA-001', description: 'Yogur', group: 'Lácteo', maxDaily: 3 },
  { id: '8', code: 'DA-002', description: 'Leche', group: 'Lácteo', maxDaily: 2 },
  { id: '9', code: 'GR-001', description: 'Avena', group: 'Granos', maxDaily: 2 },
  { id: '10', code: 'GR-002', description: 'Arroz Integral', group: 'Granos', maxDaily: 3 },
  { id: '11', code: 'SN-001', description: 'Almendras', group: 'Snacks', maxDaily: 1 },
];
