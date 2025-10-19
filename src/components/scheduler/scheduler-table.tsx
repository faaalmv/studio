"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { useScheduler } from '@/lib/hooks/use-scheduler';
import { CheckCircle, AlertTriangle } from "lucide-react";
import { QuantityStepper } from './quantity-stepper';
import { MEALS } from '@/lib/types';
import { cn, getGroupColorClass } from '@/lib/utils';

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

  const cellStyles = "p-0 h-14";
  const headerCellStyles = "p-2 align-middle text-sm font-semibold text-center bg-card";
  const stickyHeaderClass = "sticky z-10 top-0 shadow-sm";
  const stickyCellClass = "sticky bg-card/95 backdrop-blur-sm z-[1]";
  
  return (
    <div className="relative h-full overflow-auto border-t">
      <Table className="min-w-max border-separate border-spacing-0">
        <TableHeader className="sticky top-0 z-20">
          <TableRow className="hover:bg-transparent">
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-0 w-28 z-30 border-b border-r")}>Código</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-28 w-60 z-30 border-b border-r text-left")}>Elemento</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[21rem] w-24 z-30 border-b border-r")}>Total</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[27rem] w-24 z-30 border-b border-r")}>Rest.</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[33rem] w-24 z-30 border-b")}>Estado</TableHead>
            {days.map(day => (
              <TableHead key={day} colSpan={viewMode === 'detailed' ? 3 : 1} className={cn(stickyHeaderClass, headerCellStyles, "w-24 border-b border-l")}>
                {day}
              </TableHead>
            ))}
          </TableRow>
          {viewMode === 'detailed' && (
             <TableRow className="hover:bg-transparent sticky z-20 top-12">
                <TableHead className={cn(stickyHeaderClass, "left-0 top-12 z-30 border-r", headerCellStyles)}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-28 top-12 z-30 border-r", headerCellStyles)}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-[21rem] top-12 z-30 border-r", headerCellStyles)}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-[27rem] top-12 z-30 border-r", headerCellStyles)}></TableHead>
                <TableHead className={cn(stickyHeaderClass, "left-[33rem] top-12 z-30", headerCellStyles)}></TableHead>
                {days.map(day => (
                    <React.Fragment key={`meals-${day}`}>
                        <TableHead className={cn(stickyHeaderClass, headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 border-l")}>D</TableHead>
                        <TableHead className={cn(stickyHeaderClass, headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 border-l")}>A</TableHead>
                        <TableHead className={cn(stickyHeaderClass, headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 border-l")}>C</TableHead>
                    </React.Fragment>
                ))}
             </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const groupBg = getGroupColorClass(item.group, 'background');
            const groupBorder = getGroupColorClass(item.group, 'border');

            return (
              <TableRow key={item.id} className={cn("transition-colors hover:bg-muted/50")}>
                <TableCell className={cn(stickyCellClass, cellStyles, groupBg, "left-0 w-28 z-20 text-center align-middle border-b border-r border-l-4", groupBorder)}>
                    <Badge variant="secondary" className="font-mono">{item.code}</Badge>
                </TableCell>
                <TableCell className={cn(stickyCellClass, cellStyles, groupBg, "left-28 w-60 z-20 align-top border-b border-r", groupBorder)}>
                  <div className="font-medium p-2">{item.description}</div>
                  <div className="text-xs text-muted-foreground px-2 pb-1">{item.group}</div>
                </TableCell>
                <TableCell className={cn(stickyCellClass, cellStyles, groupBg, "text-center left-[21rem] w-24 font-mono z-20 align-middle text-lg border-b border-r", groupBorder)}>{totals[item.id].total}</TableCell>
                <TableCell className={cn(stickyCellClass, cellStyles, groupBg, "text-center left-[27rem] w-24 font-mono z-20 align-middle text-lg border-b border-r", totals[item.id].isOverLimit ? "text-destructive" : "text-muted-foreground", groupBorder)}>{totals[item.id].remaining}</TableCell>
                <TableCell className={cn(stickyCellClass, cellStyles, groupBg, "text-center left-[33rem] w-24 z-20 align-middle border-b", groupBorder)}>
                  {totals[item.id].isOverLimit ? (
                    <AlertTriangle className="h-5 w-5 text-destructive mx-auto" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  )}
                </TableCell>
                {days.map(day => {
                  if (viewMode === 'general') {
                     const dailyTotal = getDailyTotal(item.id, day);
                     return (
                      <TableCell key={`${item.id}-${day}`} className={cn("text-center w-24 align-middle border-b border-l", cellStyles)}>
                          <QuantityStepper
                            value={dailyTotal}
                            onValueChange={(newValue) => {
                              const diff = newValue - dailyTotal;
                              const currentBreakfast = schedule[item.id][day].desayuno;
                              updateQuantity(item.id, day, 'desayuno', currentBreakfast + diff);
                            }}
                            max={item.maxDaily}
                          />
                      </TableCell>
                     );
                  }
                  return (
                      <React.Fragment key={`${item.id}-${day}-detailed`}>
                          {MEALS.map(meal => (
                              <TableCell key={`${item.id}-${day}-${meal}`} className={cn("w-12 align-middle border-b border-l", cellStyles)}>
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
