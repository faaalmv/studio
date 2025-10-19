
import { renderHook, act } from '@testing-library/react';
import { useSchedulerActions } from '../use-scheduler-actions';
import { useToast } from '@/hooks/use-toast';

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('useSchedulerActions', () => {
  const setSchedule = jest.fn();
  const items = [{ id: '1', totalPossible: 10, description: 'Test Item' }];
  const schedule = { '1': { 1: { desayuno: 5 } } };
  const totals = { '1': { total: 5, remaining: 5, isOverLimit: false, totalPossible: 10 } };
  const viewMode = 'detailed';
  const selectedMonth = 'Enero';
  const selectedService = 'Servicio 1';

  beforeEach(() => {
    setSchedule.mockClear();
  });

  it('should update quantity when within limit', () => {
    const { result } = renderHook(() => useSchedulerActions(items, schedule, totals, viewMode, selectedMonth, selectedService, setSchedule));

    act(() => {
      result.current.updateQuantity('1', 1, 'desayuno', 8);
    });

    expect(setSchedule).toHaveBeenCalled();
    expect(result.current.errors).toEqual({});
  });

  it('should not update quantity and set error when exceeding limit', () => {
    const { result } = renderHook(() => useSchedulerActions(items, schedule, totals, viewMode, selectedMonth, selectedService, setSchedule));

    act(() => {
      result.current.updateQuantity('1', 1, 'desayuno', 12);
    });

    expect(setSchedule).not.toHaveBeenCalled();
    expect(result.current.errors).toEqual({ '1-1-desayuno': true });
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useSchedulerActions(items, schedule, totals, viewMode, selectedMonth, selectedService, setSchedule));

    act(() => {
      result.current.updateQuantity('1', 1, 'desayuno', 12);
    });

    expect(result.current.errors).toEqual({ '1-1-desayuno': true });

    act(() => {
      result.current.clearError('1-1-desayuno');
    });

    expect(result.current.errors).toEqual({});
  });
});
