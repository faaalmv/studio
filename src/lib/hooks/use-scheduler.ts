"use client";

import { useState, useMemo, useCallback } from 'react';
import type { Item, Schedule, Meal, ViewMode, Totals } from '@/lib/types';
import { initialItems } from '@/lib/data';
import { MEALS, DAYS_IN_MONTH } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { exportToCsv } from '@/lib/utils';

const transformInitialData = (items: Item[]): Schedule => {
  const schedule: Schedule = {};
  items.forEach(item => {
    schedule[item.id] = {};
    for (let day = 1; day <= DAYS_IN_MONTH; day++) {
      schedule[item.id][day] = {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      };
    }
  });
  return schedule;
};

export const useScheduler = () => {
  const [items] = useState<Item[]>(initialItems);
  const [schedule, setSchedule] = useState<Schedule>(() => transformInitialData(items));
  const [viewMode, setViewMode] = useState<ViewMode>('general');
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  const filteredItems = useMemo(() => {
    if (!filter) return items;
    const lowercasedFilter = filter.toLowerCase();
    return items.filter(
      item =>
        item.description.toLowerCase().includes(lowercasedFilter) ||
        item.code.toLowerCase().includes(lowercasedFilter) ||
        item.group.toLowerCase().includes(lowercasedFilter)
    );
  }, [items, filter]);

  const totals = useMemo<Totals>(() => {
    const newTotals: Totals = {};
    items.forEach(item => {
      let total = 0;
      for (let day = 1; day <= DAYS_IN_MONTH; day++) {
        total += Object.values(schedule[item.id][day]).reduce((a, b) => a + b, 0);
      }
      const remaining = item.maxDaily * DAYS_IN_MONTH - total;
      newTotals[item.id] = {
        total,
        remaining,
        isOverLimit: remaining < 0,
      };
    });
    return newTotals;
  }, [schedule, items]);

  const getDailyTotal = useCallback((itemId: string, day: number) => {
    if (!schedule[itemId] || !schedule[itemId][day]) return 0;
    return Object.values(schedule[itemId][day]).reduce((sum, current) => sum + current, 0);
  }, [schedule]);

  const updateQuantity = useCallback((itemId: string, day: number, meal: Meal, newQuantity: number) => {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const dailyTotal = getDailyTotal(itemId, day);
      const otherMealsTotal = dailyTotal - (schedule[itemId][day][meal] || 0);

      if (otherMealsTotal + newQuantity > item.maxDaily) {
        toast({
          title: "Daily Limit Exceeded",
          description: `You can only schedule up to ${item.maxDaily} units of ${item.description} per day.`,
          variant: "destructive",
        });
        return;
      }

      setSchedule(prevSchedule => {
        const newSchedule = { ...prevSchedule };
        newSchedule[itemId] = { ...newSchedule[itemId] };
        newSchedule[itemId][day] = { ...newSchedule[itemId][day], [meal]: newQuantity };
        return newSchedule;
      });
    }, [getDailyTotal, items, schedule, toast]);

  const handleExport = useCallback(() => {
    exportToCsv(filteredItems, schedule, totals, viewMode);
    toast({
      title: "Export Successful",
      description: "Your schedule has been exported to CSV.",
    });
  }, [filteredItems, schedule, totals, viewMode, toast]);

  return {
    items: filteredItems,
    schedule,
    totals,
    viewMode,
    filter,
    days: Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
    setViewMode: (mode: ViewMode) => setViewMode(mode),
    setFilter,
    updateQuantity,
    getDailyTotal,
    handleExport,
  };
};
