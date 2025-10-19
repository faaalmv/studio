"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { useScheduler } from '@/lib/hooks/use-scheduler';
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { QuantityStepper } from './quantity-stepper';
import { MEALS } from '@/lib/types';
import { cn } from '@/lib/utils';

type SchedulerTableProps = ReturnType<typeof useScheduler>;

export function SchedulerTable({ 
  items, 
  schedule, 
  totals, 
  viewMode, 
  days,
  updateQuantity,
  getDailyTotal
}: SchedulerTableProps) {

  const stickyHeaderClass = "sticky z-10 bg-card/95 backdrop-blur-sm top-0";
  const stickyCellClass = "sticky z-10 bg-card";
  
  return (
    <div className="w-full relative max-h-[70vh] overflow-auto border-t">
      <Table className="min-w-max border-separate border-spacing-0">
        <TableHeader className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className={cn(stickyHeaderClass, "left-0 w-60")}>Item</TableHead>
            <TableHead className={cn(stickyHeaderClass, "left-60 w-28")}>Code</TableHead>
            <TableHead className={cn(stickyHeaderClass, "left-[22rem] w-24 text-center")}>Total</TableHead>
            <TableHead className={cn(stickyHeaderClass, "left-[28rem] w-24 text-center")}>Rem.</TableHead>
            <TableHead className={cn(stickyHeaderClass, "left-[34rem] w-24 text-center")}>Status</TableHead>
            {days.map(day => (
              <TableHead key={day} colSpan={viewMode === 'detailed' ? 3 : 1} className="text-center w-24">
                {day}
              </TableHead>
            ))}
          </TableRow>
          {viewMode === 'detailed' && (
             <TableRow className="hover:bg-transparent sticky z-20 top-[3.2rem] bg-card/95 backdrop-blur-sm">
                <TableHead className={cn(stickyHeaderClass, "left-0 top-[3.2rem]")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-60 top-[3.2rem]")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-[22rem] top-[3.2rem]")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-[28rem] top-[3.2rem]")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-[34rem] top-[3.2rem]")}></TableHead>
                {days.map(day => (
                    <React.Fragment key={`meals-${day}`}>
                        <TableHead className="text-center text-xs font-medium text-muted-foreground w-12 p-2">B</TableHead>
                        <TableHead className="text-center text-xs font-medium text-muted-foreground w-12 p-2">L</TableHead>
                        <TableHead className="text-center text-xs font-medium text-muted-foreground w-12 p-2">D</TableHead>
                    </React.Fragment>
                ))}
             </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id} className="transition-opacity animate-in fade-in-0" style={{ animationDelay: `${index * 20}ms` }}>
              <TableCell className={cn(stickyCellClass, "left-0 w-60")}>
                <div className="font-medium">{item.description}</div>
                <div className="text-xs text-muted-foreground">{item.group}</div>
              </TableCell>
              <TableCell className={cn(stickyCellClass, "left-60 w-28")}>
                <Badge variant="outline">{item.code}</Badge>
              </TableCell>
              <TableCell className={cn(stickyCellClass, "text-center left-[22rem] w-24 font-mono")}>{totals[item.id].total}</TableCell>
              <TableCell className={cn(stickyCellClass, "text-center left-[28rem] w-24 font-mono", totals[item.id].isOverLimit ? "text-destructive" : "text-muted-foreground")}>{totals[item.id].remaining}</TableCell>
              <TableCell className={cn(stickyCellClass, "text-center left-[34rem] w-24")}>
                {totals[item.id].isOverLimit ? (
                  <TriangleAlert className="h-5 w-5 text-destructive mx-auto" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                )}
              </TableCell>
              {days.map(day => {
                if (viewMode === 'general') {
                   const dailyTotal = getDailyTotal(item.id, day);
                   return (
                    <TableCell key={`${item.id}-${day}`} className="p-1 text-center w-24">
                        <QuantityStepper
                          value={dailyTotal}
                          onValueChange={(newValue) => {
                            const diff = newValue - dailyTotal;
                            const currentBreakfast = schedule[item.id][day].breakfast;
                            updateQuantity(item.id, day, 'breakfast', currentBreakfast + diff);
                          }}
                          max={item.maxDaily}
                        />
                    </TableCell>
                   );
                }
                return (
                    <React.Fragment key={`${item.id}-${day}-detailed`}>
                        {MEALS.map(meal => (
                            <TableCell key={`${item.id}-${day}-${meal}`} className="p-1 w-12">
                                <QuantityStepper 
                                    value={schedule[item.id][day][meal]}
                                    onValueChange={(newValue) => updateQuantity(item.id, day, meal, newValue)}
                                    max={item.maxDaily}
                                />
                            </TableCell>
                        ))}
                    </React.Fragment>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
