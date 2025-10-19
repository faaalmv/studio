
import { create } from 'zustand';
import {
  SchedulerState,
  SchedulerStore,
  UseSchedulerProps,
} from '@/lib/types';
import {
  getInitialSchedulerState,
  calculateTotals,
  applyInitialAndFilters,
} from '@/lib/utils';

export const createSchedulerStore = (props: UseSchedulerProps) => {
  const initialState = getInitialSchedulerState(props);

  return create<SchedulerStore>((set, get) => ({
    ...initialState,

    // Actions
    setItems: (items: any[]) => set({ items }),
    setFilters: (filters: any) => set({ filters }),
    setViewMode: (viewMode: 'detailed' | 'general') => set({ viewMode }),
    setCollapsedGroups: (collapsedGroups: any) => set({ collapsedGroups }),

    updateQuantity: (
      itemId: string,
      day: number,
      mealType: string,
      value: number
    ) => {
      const { items, viewMode } = get();
      const newItems = items.map((item) => {
        if (item.id === itemId) {
          const newDailyData = { ...item.dailyData };
          if (viewMode === 'detailed') {
            newDailyData[day] = {
              ...newDailyData[day],
              [mealType]: value,
            };
          } else {
            newDailyData[day] = {
              ...newDailyData[day],
              total: value,
            };
          }
          return { ...item, dailyData: newDailyData };
        }
        return item;
      });

      const newTotals = calculateTotals(newItems);
      set({ items: newItems, totals: newTotals });
    },

    toggleGroupCollapsed: (groupName: string) => {
      const { collapsedGroups } = get();
      const newCollapsedGroups = { ...collapsedGroups };
      if (newCollapsedGroups[groupName]) {
        delete newCollapsedGroups[groupName];
      } else {
        newCollapsedGroups[groupName] = true;
      }
      set({ collapsedGroups: newCollapsedGroups });
    },

    // Derived state
    getFilteredItems: () => {
      const { items, filters } = get();
      return applyInitialAndFilters(items, filters);
    },
  }));
};
