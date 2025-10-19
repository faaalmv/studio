
"use client";

import { useState, useMemo, useCallback } from 'react';
import type { Item, Schedule, Meal, ViewMode, Totals, Group } from '@/lib/types';
import { initialItems, initialGroups } from '@/lib/data';
import { MEALS, DAYS_IN_MONTH } from '@/lib/types';
import { useSchedulerActions } from './use-scheduler-actions';

const transformInitialData = (items: Item[]): Schedule => {
  const schedule: Schedule = {};
  items.forEach(item => {
    schedule[item.id] = {};
    for (let day = 1; day <= DAYS_IN_MONTH; day++) {
      schedule[item.id][day] = {
        desayuno: 0,
        almuerzo: 0,
        cena: 0,
      };
    }
  });
  return schedule;
};

const months = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];
const monthOptions = months.map(m => ({ value: m, label: m.charAt(0) + m.slice(1).toLowerCase() }));

const services = ['PACIENTES', 'COMEDOR', 'NUTRICIÓN CLÍNICA'];
const serviceOptions = services.map(s => ({ value: s, label: s }));

export const useScheduler = () => {
  const [items] = useState<Item[]>(initialItems);
  const [groups] = useState<Group[]>(initialGroups);
  const [schedule, setSchedule] = useState<Schedule>(() => transformInitialData(items));
  const [viewMode, setViewMode] = useState<ViewMode>('general');
  const [filter, setFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>(months[0]);
  const [selectedService, setSelectedService] = useState<string>(services[0]);

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
        total += Object.values(schedule[item.id]?.[day] ?? {}).reduce((a, b) => a + b, 0);
      }
      const totalPossible = item.totalPossible;
      const remaining = totalPossible - total;
      newTotals[item.id] = {
        total,
        remaining,
        totalPossible,
        isOverLimit: remaining < 0,
      };
    });
    return newTotals;
  }, [schedule, items]);

  const getDailyTotal = useCallback((itemId: string, day: number) => {
    if (!schedule[itemId] || !schedule[itemId][day]) return 0;
    return Object.values(schedule[itemId][day]).reduce((sum, current) => sum + current, 0);
  }, [schedule]);

  const { updateQuantity, onExport } = useSchedulerActions(
    items,
    schedule,
    totals,
    viewMode,
    selectedMonth,
    selectedService,
    setSchedule
  );

  const selectedMonthLabel = useMemo(() => {
    return monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth;
  }, [selectedMonth]);

  return {
    items: filteredItems,
    groups,
    schedule,
    totals,
    viewMode,
    filter,
    days: Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
    setViewMode: (mode: ViewMode) => setViewMode(mode),
    setFilter,
    updateQuantity,
    getDailyTotal,
    onExport,
    selectedMonth,
    setSelectedMonth,
    monthOptions,
    selectedService,
    setSelectedService,
    serviceOptions,
    selectedMonthLabel,
  };
};
