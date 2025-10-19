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

  const cellStyles = "border-b border-r p-1";
  const headerCellStyles = cn(cellStyles, "bg-muted/60 p-2");

  const stickyHeaderClass = "sticky z-10 top-0 bg-card/95 backdrop-blur-sm";
  const stickyCellClass = "sticky bg-card/95 backdrop-blur-sm z-[1]";
  
  return (
    <div className="relative border-t">
      <Table className="min-w-max border-separate border-spacing-0">
        <TableHeader className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-0 w-60 z-30")}>Elemento</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-60 w-28 z-30")}>Código</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[22rem] w-24 text-center z-30")}>Total</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[28rem] w-24 text-center z-30")}>Rest.</TableHead>
            <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[34rem] w-24 text-center z-30")}>Estado</TableHead>
            {days.map(day => (
              <TableHead key={day} colSpan={viewMode === 'detailed' ? 3 : 1} className={cn(stickyHeaderClass, headerCellStyles, "text-center w-24")}>
                {day}
              </TableHead>
            ))}
          </TableRow>
          {viewMode === 'detailed' && (
             <TableRow className="hover:bg-transparent sticky z-20 top-[3.2rem] bg-card/95 backdrop-blur-sm">
                <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-0 top-[3.2rem] z-30")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-60 top-[3.2rem] z-30")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[22rem] top-[3.2rem] z-30")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[28rem] top-[3.2rem] z-30")}></TableHead>
                <TableHead className={cn(stickyHeaderClass, headerCellStyles, "left-[34rem] top-[3.2rem] z-30")}></TableHead>
                {days.map(day => (
                    <React.Fragment key={`meals-${day}`}>
                        <TableHead className={cn(stickyHeaderClass, headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-[3.2rem]")}>D</TableHead>
                        <TableHead className={cn(stickyHeaderClass, headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-[3.2rem]")}>A</TableHead>
                        <TableHead className={cn(stickyHeaderClass, headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-[3.2rem]")}>C</TableHead>
                    </React.Fragment>
                ))}
             </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id} className="transition-opacity animate-in fade-in-0" style={{ animationDelay: `${index * 20}ms` }}>
              <TableCell className={cn(stickyCellClass, cellStyles, "left-0 w-60 z-20")}>
                <div className="font-medium px-2 py-1">{item.description}</div>
                <div className="text-xs text-muted-foreground px-2">{item.group}</div>
              </TableCell>
              <TableCell className={cn(stickyCellClass, cellStyles, "left-60 w-28 z-20 align-middle")}>
                <div className='p-2'>
                  <Badge variant="outline">{item.code}</Badge>
                </div>
              </TableCell>
              <TableCell className={cn(stickyCellClass, cellStyles, "text-center left-[22rem] w-24 font-mono z-20 align-middle")}>{totals[item.id].total}</TableCell>
              <TableCell className={cn(stickyCellClass, cellStyles, "text-center left-[28rem] w-24 font-mono z-20 align-middle", totals[item.id].isOverLimit ? "text-destructive" : "text-muted-foreground")}>{totals[item.id].remaining}</TableCell>
              <TableCell className={cn(stickyCellClass, cellStyles, "text-center left-[34rem] w-24 z-20 align-middle")}>
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
                    <TableCell key={`${item.id}-${day}`} className={cn("text-center w-24 align-middle", cellStyles)}>
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
                            <TableCell key={`${item.id}-${day}-${meal}`} className={cn("w-12 align-middle", cellStyles)}>
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
