"use client";

import React, { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { useScheduler } from '@/lib/hooks/use-scheduler';
import { CheckCircle, AlertTriangle } from "lucide-react";
import { QuantityStepper } from './quantity-stepper';
import { MEALS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SchedulerGroupHeader } from './scheduler-group-header';
import { useCollapsible } from '@/lib/hooks/use-collapsible';

type SchedulerTableProps = ReturnType<typeof useScheduler>;

const MemoizedTableRow = memo(function MemoizedTableRow({ item, schedule, totals, viewMode, days, updateQuantity, getDailyTotal, isLast, style, className }: { item: any, isLast: boolean, style: React.CSSProperties, className: string } & Omit<SchedulerTableProps, 'items' | 'groups'>) {
    const cellStyles = "p-0 h-14";
    const groupBg = cn({
        'bg-chart-1/5': item.group === 'Fruta',
        'bg-chart-2/5': item.group === 'Verdura',
        'bg-chart-3/5': item.group === 'Proteína',
        'bg-chart-4/5': item.group === 'Lácteo',
        'bg-chart-5/5': item.group === 'Granos',
        'bg-accent/5': item.group === 'Snacks',
    });
     const groupBorder = cn({
        'border-l-4 border-chart-1': item.group === 'Fruta',
        'border-l-4 border-chart-2': item.group === 'Verdura',
        'border-l-4 border-chart-3': item.group === 'Proteína',
        'border-l-4 border-chart-4': item.group === 'Lácteo',
        'border-l-4 border-chart-5': item.group === 'Granos',
        'border-l-4 border-accent': item.group === 'Snacks',
    });

    return (
        <TableRow className={cn("transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-px", className, isLast && "border-b-0")} style={style}>
            <TableCell className={cn(cellStyles, "sticky left-0 z-10 w-60 align-top bg-card/95 backdrop-blur-sm", groupBg, groupBorder, !isLast && "border-b")}>
                <div className="font-bold p-2 text-sm">{item.description}</div>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky left-60 z-10 w-28 text-center align-middle bg-card/95 backdrop-blur-sm", groupBg, !isLast && "border-b")}>
                <Badge variant="secondary" className="font-mono text-xs">{item.code}</Badge>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[22rem] w-24 font-mono z-10 align-middle text-lg bg-card/95 backdrop-blur-sm", groupBg, !isLast && "border-b")}>{totals[item.id].total}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[28rem] w-24 font-mono z-10 align-middle text-lg bg-card/95 backdrop-blur-sm", totals[item.id].isOverLimit ? "text-destructive" : "text-muted-foreground", groupBg, !isLast && "border-b")}>{totals[item.id].remaining}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[34rem] w-24 z-10 align-middle bg-card/95 backdrop-blur-sm", groupBg, !isLast && "border-b")}>
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
                        <TableCell key={`${item.id}-${day}`} className={cn("text-center w-24 align-middle border-l", cellStyles, !isLast && "border-b")}>
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
                            <TableCell key={`${item.id}-${day}-${meal}`} className={cn("w-12 align-middle border-l", cellStyles, !isLast && "border-b")}>
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
                    <TableHead className={cn(stickyHeaderCellStyles, "left-0 w-60 z-40 border-b text-left")}>Elemento</TableHead>
                    <TableHead className={cn(stickyHeaderCellStyles, "left-60 w-28 z-40 border-b")}>Código</TableHead>
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
                        <TableHead className={cn(stickyHeaderCellStyles, "left-60 top-12 z-40")}></TableHead>
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

    