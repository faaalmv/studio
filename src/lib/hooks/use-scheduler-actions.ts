"use client";

import { useCallback } from 'react';
import type { Item, Schedule, Meal, ViewMode, Totals } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { exportToCsv } from '@/lib/utils';

export const useSchedulerActions = (
  items: Item[],
  schedule: Schedule,
  totals: Totals,
  viewMode: ViewMode,
  selectedMonth: string,
  selectedService: string,
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>
) => {
  const { toast } = useToast();

  const updateQuantity = useCallback((itemId: string, day: number, meal: Meal, newQuantity: number, isGeneral: boolean = false) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const currentMealQuantity = schedule[itemId]?.[day]?.[meal] ?? 0;
    const totalScheduled = totals[itemId]?.total ?? 0;
    const available = item.totalPossible - (totalScheduled - currentMealQuantity);

    const finalQuantity = Math.max(0, newQuantity);

    if (finalQuantity > available && !isGeneral) {
        toast({
            title: "Límite Total Excedido",
            description: `No puedes planificar más de ${item.totalPossible} unidades de ${item.description}.`,
            variant: "destructive",
        });
        
        setSchedule(prevSchedule => ({
          ...prevSchedule,
          [itemId]: {
            ...prevSchedule[itemId],
            [day]: {
              ...prevSchedule[itemId][day],
              [meal]: available > 0 ? available : 0,
            },
          },
        }));
        return;
    }

    setSchedule(prevSchedule => {
      const newDaySchedule = isGeneral
        ? { desayuno: finalQuantity, almuerzo: 0, cena: 0 }
        : { ...prevSchedule[itemId][day], [meal]: finalQuantity };

      return {
        ...prevSchedule,
        [itemId]: {
          ...prevSchedule[itemId],
          [day]: newDaySchedule,
        },
      };
    });
  }, [items, schedule, totals, toast, setSchedule]);

  const handleExport = useCallback(() => {
    const fileName = `Programacion_${selectedMonth}_${selectedService.replace(/\s+/g, '_')}.csv`;
    exportToCsv(items, schedule, totals, viewMode, fileName);
    toast({
      title: "Exportación Exitosa",
      description: "Tu planificación ha sido exportada a CSV.",
    });
  }, [items, schedule, totals, viewMode, toast, selectedMonth, selectedService]);

  return { updateQuantity, onExport: handleExport };
};
