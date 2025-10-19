
"use client";

import { useCallback, useState, useEffect } from 'react';
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
  const [downloadLink, setDownloadLink] = useState<{ href: string; download: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const updateQuantity = useCallback((itemId: string, day: number, meal: Meal, newQuantity: number, isGeneral: boolean = false) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const currentMealQuantity = schedule[itemId]?.[day]?.[meal] ?? 0;
    const totalScheduled = totals[itemId]?.total ?? 0;
    const available = item.totalPossible - (totalScheduled - currentMealQuantity);

    const finalQuantity = Math.max(0, newQuantity);
    const errorKey = `${itemId}-${day}-${meal}`;

    if (finalQuantity > available && !isGeneral) {
        toast({
            title: "Límite Total Excedido",
            description: `No puedes planificar más de ${item.totalPossible} unidades de ${item.description}.`,
            variant: "destructive",
        });
        
        setErrors(prev => ({...prev, [errorKey]: true}));
        return;
    }

    setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[errorKey];
        return newErrors;
    });

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
    const { encodedUri } = exportToCsv(items, schedule, totals, viewMode, fileName);
    setDownloadLink({ href: encodedUri, download: fileName });
    toast({
      title: "Exportación Exitosa",
      description: "Tu planificación ha sido exportada a CSV.",
    });
  }, [items, schedule, totals, viewMode, toast, selectedMonth, selectedService]);
  
  useEffect(() => {
    if (downloadLink) {
      const link = document.createElement("a");
      link.setAttribute("href", downloadLink.href);
      link.setAttribute("download", downloadLink.download);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadLink(null);
    }
  }, [downloadLink]);
  
  const clearError = useCallback((errorKey: string) => {
      setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[errorKey];
          return newErrors;
      });
  }, []);


  return { updateQuantity, onExport: handleExport, errors, clearError };
};
