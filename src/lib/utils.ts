
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Item, Schedule, ViewMode, Totals, Meal } from './types';
import { MEALS, DAYS_IN_MONTH } from './types';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCsv(items: Item[], schedule: Schedule, totals: Totals, viewMode: ViewMode, fileName: string) {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  const headers = ['Descripción', 'Código', 'Grupo', 'Total Planificado', 'Total Restante'];
  const days = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

  if (viewMode === 'general') {
    days.forEach(day => headers.push(`Día ${day}`));
  } else {
    days.forEach(day => {
      MEALS.forEach(meal => headers.push(`Día ${day} ${meal.charAt(0).toUpperCase() + meal.slice(1)}`));
    });
  }
  csvContent += headers.join(',') + '\r\n';

  items.forEach(item => {
    const row = [
      `"${item.description}"`,
      item.code,
      item.group,
      totals[item.id].total,
      totals[item.id].remaining
    ];

    days.forEach(day => {
      if (viewMode === 'general') {
        const dailyTotal = Object.values(schedule[item.id][day]).reduce((a, b) => a + b, 0);
        row.push(String(dailyTotal));
      } else {
        MEALS.forEach(meal => {
          row.push(String(schedule[item.id][day][meal]));
        });
      }
    });
    csvContent += row.join(',') + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

    