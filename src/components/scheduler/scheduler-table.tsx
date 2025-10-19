"use client";

import React, { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { useScheduler } from '@/lib/hooks/use-scheduler';
import { CheckCircle, AlertTriangle } from "lucide-react";
import { QuantityStepper } from './quantity-stepper';
import { MEALS } from '@/lib/types';
import { cn, getGroupColorClass } from '@/lib/utils';
import { SchedulerGroupHeader } from './scheduler-group-header';
import { useCollapsible } from '@/lib/hooks/use-collapsible';

type SchedulerTableProps = ReturnType<typeof useScheduler>;

const MemoizedTableRow = memo(function MemoizedTableRow({ item, schedule, totals, viewMode, days, updateQuantity, getDailyTotal, isLast, style, className }: { item: any, isLast: boolean, style: React.CSSProperties, className: string } & Omit<SchedulerTableProps, 'items' | 'groups'>) {
    const cellStyles = "p-0 h-14";
    const groupBg = getGroupColorClass(item.group, 'background');
    const groupBorder = getGroupColorClass(item.group, 'border');

    return (
        <TableRow className={cn("transition-all duration-200 ease-in-out hover:shadow-lg hover:z-10 hover:-translate-y-px", className, isLast && "border-b-0")} style={style}>
            <TableCell className={cn(cellStyles, "sticky left-0 z-10 w-32 text-center align-middle bg-card/95 backdrop-blur-sm", groupBg, groupBorder, !isLast && "border-b")}>
                <Badge variant="secondary" className="font-mono text-xs">{item.code}</Badge>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky left-32 z-10 w-60 align-top bg-card/95 backdrop-blur-sm", groupBg, groupBorder, !isLast && "border-b")}>
                <div className="font-bold p-2 text-sm">{item.description}</div>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[22rem] w-24 font-mono z-10 align-middle text-lg bg-card/95 backdrop-blur-sm", groupBg, groupBorder, !isLast && "border-b")}>{totals[item.id].total}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[28rem] w-24 font-mono z-10 align-middle text-lg bg-card/95 backdrop-blur-sm", totals[item.id].isOverLimit ? "text-destructive" : "text-muted-foreground", groupBg, groupBorder, !isLast && "border-b")}>{totals[item.id].remaining}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[34rem] w-24 z-10 align-middle bg-card/95 backdrop-blur-sm", groupBg, groupBorder, !isLast && "border-b")}>
                {totals[item.id].isOverLimit ? (
                    <AlertTriangle className="h-5 w-5 text-destructive mx-auto" />
                ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                )}
            </TableCell>
            {days.map(day => {
                const dailyTotal = getDailyTotal(item.id, day);
                if (viewMode === 'general') {
                    return (
                        <TableCell key={`${item.id}-${day}`} className={cn("text-center w-24 align-middle border-l", cellStyles, !isLast && "border-b")}>
                             <QuantityStepper
                                value={dailyTotal}
                                onValueChange={(newValue) => {
                                    const diff = newValue - dailyTotal;
                                    const currentBreakfast = schedule[item.id]?.[day]?.desayuno ?? 0;
                                    updateQuantity(item.id, day, 'desayuno', currentBreakfast + diff, true);
                                }}
                                max={item.maxDaily}
                                dailyTotal={dailyTotal}
                            />
                        </TableCell>
                    );
                }
                return (
                    <React.Fragment key={`${item.id}-${day}-detailed`}>
                        {MEALS.map(meal => (
                            <TableCell key={`${item.id}-${day}-${meal}`} className={cn("w-12 align-middle border-l", cellStyles, !isLast && "border-b")}>
                                <QuantityStepper
                                    value={schedule[item.id]?.[day]?.[meal] ?? 0}
                                    onValueChange={(newValue) => updateQuantity(item.id, day, meal, newValue)}
                                    max={item.maxDaily}
                                    dailyTotal={dailyTotal}
                                />
                            </TableCell>
                        ))}
                    </React.Fragment>
                )
            })}
        </TableRow>
    )
});


export function SchedulerTable({
    items,
    groups,
    schedule,
    totals,
    viewMode,
    days,
    updateQuantity,
    getDailyTotal
}: SchedulerTableProps) {

    const { expandedItems, toggleItem } = useCollapsible(groups.map(g => g.name));

    const headerCellStyles = "p-2 align-middle text-sm font-semibold text-center bg-card shadow-inner-white";
    const stickyHeaderClass = "sticky top-0 z-30";
    const stickyHeaderCellStyles = cn(stickyHeaderClass, headerCellStyles);

    return (
        <Table className="min-w-max border-separate border-spacing-0">
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className={cn(stickyHeaderCellStyles, "left-0 w-32 z-40 border-b text-left")}>Código</TableHead>
                    <TableHead className={cn(stickyHeaderCellStyles, "left-32 w-60 z-40 border-b text-left")}>Elemento</TableHead>
                    <TableHead className={cn(stickyHeaderCellStyles, "left-[22rem] w-24 z-40 border-b")}>Total</TableHead>
                    <TableHead className={cn(stickyHeaderCellStyles, "left-[28rem] w-24 z-40 border-b")}>Rest.</TableHead>
                    <TableHead className={cn(stickyHeaderCellStyles, "left-[34rem] w-24 z-40 border-b")}>Estado</TableHead>
                    {days.map(day => (
                        <TableHead key={day} colSpan={viewMode === 'detailed' ? 3 : 1} className={cn(stickyHeaderCellStyles, "w-24 border-b border-l")}>
                            {day}
                        </TableHead>
                    ))}
                </TableRow>
                {viewMode === 'detailed' && (
                    <TableRow className="hover:bg-transparent">
                        <TableHead className={cn(stickyHeaderCellStyles, "left-0 top-12 z-40")}></TableHead>
                        <TableHead className={cn(stickyHeaderCellStyles, "left-32 top-12 z-40")}></TableHead>
                        <TableHead className={cn(stickyHeaderCellStyles, "left-[22rem] top-12 z-40")}></TableHead>
                        <TableHead className={cn(stickyHeaderCellStyles, "left-[28rem] top-12 z-40")}></TableHead>
                        <TableHead className={cn(stickyHeaderCellStyles, "left-[34rem] top-12 z-40")}></TableHead>
                        {days.map(day => (
                            <React.Fragment key={`meals-${day}`}>
                                <TableHead className={cn(stickyHeaderCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 border-l")}>D</TableHead>
                                <TableHead className={cn(stickyHeaderCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 border-l")}>A</TableHead>
                                <TableHead className={cn(stickyHeaderCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 border-l")}>C</TableHead>
                            </React.Fragment>
                        ))}
                    </TableRow>
                )}
            </TableHeader>
            <TableBody>
                {groups.map((group) => {
                    const isExpanded = expandedItems.includes(group.name);
                    const groupItems = items.filter(item => item.group === group.name);
                    
                    if (groupItems.length === 0) return null;

                    return (
                        <React.Fragment key={group.name}>
                            <SchedulerGroupHeader
                                group={group}
                                items={groupItems}
                                totals={totals}
                                isExpanded={isExpanded}
                                onToggle={() => toggleItem(group.name)}
                                colSpan={5 + (viewMode === 'detailed' ? days.length * 3 : days.length)}
                            />

                            {isExpanded && groupItems.map((item, index) => (
                                <MemoizedTableRow
                                    key={item.id}
                                    item={item}
                                    schedule={schedule}
                                    totals={totals}
                                    viewMode={viewMode}
                                    days={days}
                                    updateQuantity={updateQuantity}
                                    getDailyTotal={getDailyTotal}
                                    isLast={index === groupItems.length - 1}
                                    style={{ animationDelay: `${index * 30}ms` }}
                                    className="animate-slide-down-fade-in"
                                />
                            ))}
                        </React.Fragment>
                    )
                })}
            </TableBody>
        </Table>
    );
}
