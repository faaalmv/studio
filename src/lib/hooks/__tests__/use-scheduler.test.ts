
import { renderHook, act } from '@testing-library/react';
import { useScheduler } from '../use-scheduler';

describe('useScheduler', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useScheduler());
    expect(result.current.viewMode).toBe('general');
    expect(result.current.filter).toBe('');
    expect(result.current.selectedMonth).toBe('ENERO');
    expect(result.current.selectedService).toBe('PACIENTES');
  });

  it('should filter items', () => {
    const { result } = renderHook(() => useScheduler());

    act(() => {
      result.current.setFilter('leche');
    });

    expect(result.current.items.every(item => item.description.toLowerCase().includes('leche'))).toBe(true);
  });

  it('should calculate daily total', () => {
    const { result } = renderHook(() => useScheduler());
    const itemId = result.current.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 1, 'desayuno', 5);
      result.current.updateQuantity(itemId, 1, 'almuerzo', 10);
    });

    expect(result.current.getDailyTotal(itemId, 1)).toBe(15);
  });
});
