"use client";

import React, { useMemo } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";
import type { Group, Item, Totals } from '@/lib/types';
import { cn, getGroupColorClass } from '@/lib/utils';

interface GroupHeaderProps {
  group: Group;
  items: Item[];
  totals: Totals;
  isExpanded: boolean;
  onToggle: () => void;
  colSpan: number;
}

export const SchedulerGroupHeader: React.FC<GroupHeaderProps> = ({ group, items, totals, isExpanded, onToggle, colSpan }) => {
  const summary = useMemo(() => {
    if (!items || items.length === 0) {
      return { itemCount: 0, availablePercent: 100, progressBarClass: 'bg-green-500' };
    }

    const totalMax = items.reduce((acc, item) => acc + (totals[item.id]?.totalPossible ?? 0), 0);
    const totalScheduled = items.reduce((acc, item) => acc + (totals[item.id]?.total ?? 0), 0);

    if (totalMax === 0) {
        return { itemCount: items.length, availablePercent: 100, progressBarClass: 'bg-green-500' };
    }

    const scheduledPercent = (totalScheduled / totalMax) * 100;
    const availablePercent = 100 - scheduledPercent;

    let progressBarClass = 'bg-rose-500'; // 0% available
    if (availablePercent > 75) progressBarClass = 'bg-green-500'; // 75-100%
    else if (availablePercent > 50) progressBarClass = 'bg-sky-500'; // 50-75%
    else if (availablePercent > 25) progressBarClass = 'bg-amber-400'; // 25-50%
    else if (availablePercent > 0) progressBarClass = 'bg-orange-500'; // 0-25%

    return { 
      itemCount: items.length, 
      availablePercent: Math.max(0, availablePercent), 
      progressBarClass 
    };
  }, [items, totals]);

  const groupBg = getGroupColorClass(group.name, 'background');
  const groupBorder = getGroupColorClass(group.name, 'border');

  return (
    <TableRow
      className={cn("cursor-pointer group hover:z-20 transition-all duration-200 ease-in-out", isExpanded ? 'sticky top-[8.1rem] z-20' : 'z-10')}
      onClick={onToggle}
      style={{
        boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
      }}
      aria-expanded={isExpanded}
    >
      <TableCell colSpan={colSpan} className={cn("p-0 border-b", groupBg, groupBorder)}>
        <div className="flex items-center justify-between w-full px-4 py-2">
          <div className="flex items-center gap-4">
            <ChevronDown
              className={cn('h-5 w-5 text-current opacity-80 transform transition-transform duration-300 ease-out', {
                'rotate-0': isExpanded,
                '-rotate-90': !isExpanded,
              })}
            />
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm uppercase tracking-wider">{group.name}</span>
              <span className="text-xs text-muted-foreground font-normal">{summary.itemCount} artículos</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-1/3 max-w-xs" title={`Disponibilidad: ${Math.round(summary.availablePercent)}%`}>
            <Progress value={summary.availablePercent} className="h-2" indicatorClassName={summary.progressBarClass} />
            <span className="text-sm font-semibold w-16 text-right tabular-nums">{Math.round(summary.availablePercent)}%</span>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};