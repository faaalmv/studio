"use client";

import React, { memo, useState, useRef, useCallback } from 'react';
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

const MemoizedTableRow = memo(function MemoizedTableRow({ item, schedule, totals, viewMode, days, updateQuantity, getDailyTotal, isLast, style, className, isScrolled, hoveredColumn }: { item: any, isLast: boolean, style: React.CSSProperties, className: string, isScrolled: boolean, hoveredColumn: number | null } & Omit<SchedulerTableProps, 'items' | 'groups'>) {
    const cellStyles = "p-0 h-14 transition-colors duration-200";
    const stickyCellStyles = "group-hover:bg-primary/5";
    
    const groupBg = cn("bg-card");
    const groupBorder = cn(
        "border-l-4",
        {
            'border-chart-1': item.group === 'Fruta',
            'border-chart-2': item.group === 'Verdura',
            'border-chart-3': item.group === 'Proteína',
            'border-chart-4': item.group === 'Lácteo',
            'border-chart-5': item.group === 'Granos',
            'border-accent': item.group === 'Snacks',
        }
    );

    const remaining = totals[item.id].remaining;
    const totalPossible = totals[item.id].totalPossible;
    const percentage = totalPossible > 0 ? (remaining / totalPossible) * 100 : 100;
    
    const remainingCellBg = cn({
        'bg-green-500/10 text-green-700': percentage > 75,
        'bg-sky-500/10 text-sky-700': percentage > 50 && percentage <= 75,
        'bg-amber-400/10 text-amber-700': percentage > 25 && percentage <= 50,
        'bg-orange-500/10 text-orange-700': percentage > 0 && percentage <= 25,
        'bg-rose-500/10 text-rose-700': percentage <= 0,
    });

    const total = totals[item.id].total;

    return (
        <TableRow className={cn("group row-transition animate-slide-down-fade-in bg-card hover:z-20", className, isLast && "border-b-0")} style={style}>
            <TableCell className={cn(cellStyles, "sticky left-0 z-10 w-32 text-center align-middle", stickyCellStyles, groupBorder, isLast ? "border-b-0" : "border-b", isScrolled && "shadow-lg", groupBg)}>
                <Badge variant="secondary" className="font-mono text-xs">{item.code}</Badge>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky left-32 z-10 w-48 text-left p-2 align-middle", stickyCellStyles, isLast ? "border-b-0" : "border-b", isScrolled && "shadow-lg", groupBg)}>
                 <div className="font-bold text-sm">{item.description}</div>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[20rem] w-24 font-mono z-10 align-middle text-lg", stickyCellStyles, isLast ? "border-b-0" : "border-b", isScrolled && "shadow-lg", groupBg, totals[item.id].isOverLimit && "text-destructive")}>{total}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[26rem] w-24 font-mono z-10 align-middle text-lg", stickyCellStyles, remainingCellBg, isLast ? "border-b-0" : "border-b", isScrolled && "shadow-lg", "font-bold")}>{remaining}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[32rem] w-24 z-10 align-middle", stickyCellStyles, isLast ? "border-b-0" : "border-b", isScrolled && "shadow-lg", groupBg)}>
                <div className="flex justify-center items-center">
                    <div className={cn('h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300', 
                        totals[item.id].isOverLimit ? 'bg-rose-500/20' : (total > 0 ? 'bg-green-500/20' : 'bg-transparent')
                    )}>
                        {totals[item.id].isOverLimit ? (
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        ) : (
                           total > 0 && <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                    </div>
                </div>
            </TableCell>
            {days.map(day => {
                const dailyTotal = getDailyTotal(item.id, day);
                const isHovered = hoveredColumn === day;

                if (viewMode === 'general') {
                    return (
                        <TableCell key={`${item.id}-${day}`} className={cn("text-center w-24 align-middle border-l", cellStyles, isLast ? "border-b-0" : "border-b", isHovered && "bg-primary/5", (dailyTotal > 0 && !isHovered) && 'bg-primary/5')}>
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
                        {MEALS.map((meal, mealIndex) => {
                            const mealValue = schedule[item.id]?.[day]?.[meal] ?? 0;
                            return (
                                <TableCell key={`${item.id}-${day}-${meal}`} className={cn("w-12 align-middle border-l", cellStyles, isLast ? "border-b-0" : "border-b", isHovered && "bg-primary/5", (mealValue > 0 && !isHovered) && 'bg-primary/5')}>
                                    <QuantityStepper
                                        value={mealValue}
                                        onValueChange={(newValue) => updateQuantity(item.id, day, meal, newValue)}
                                        max={item.maxDaily}
                                        dailyTotal={dailyTotal}
                                    />
                                </TableCell>
                            );
                        })}
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            setIsScrolled(scrollContainerRef.current.scrollLeft > 5);
        }
    }, []);

    const headerCellStyles = "p-2 align-middle text-sm font-semibold text-center bg-card shadow-inner-white";
    const stickyHeaderBase = "sticky z-20 bg-card";
    
    return (
        <div ref={scrollContainerRef} onScroll={handleScroll} className="h-full w-full overflow-auto">
            <Table className="min-w-max border-separate border-spacing-0">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-0 w-32 z-30 border-b text-center top-0", isScrolled && "shadow-lg")}>Código</TableHead>
                        <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-32 w-48 z-30 border-b text-left top-0", isScrolled && "shadow-lg")}>Elemento</TableHead>
                        <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-[20rem] w-24 z-30 border-b top-0", isScrolled && "shadow-lg")}>Total</TableHead>
                        <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-[26rem] w-24 z-30 border-b top-0", isScrolled && "shadow-lg")}>Rest.</TableHead>
                        <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-[32rem] w-24 z-30 border-b top-0", isScrolled && "shadow-lg")}>Estado</TableHead>
                        {days.map(day => (
                            <TableHead 
                                key={day} 
                                colSpan={viewMode === 'detailed' ? 3 : 1} 
                                className={cn(headerCellStyles, "w-24 border-b border-l top-0 sticky transition-colors duration-200", hoveredColumn === day && "bg-primary/5")}
                                onMouseEnter={() => setHoveredColumn(day)}
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                {day}
                            </TableHead>
                        ))}
                    </TableRow>
                    {viewMode === 'detailed' && (
                        <TableRow className="hover:bg-transparent">
                            <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-0 top-12 z-30", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-32 top-12 z-30", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-[20rem] top-12 z-30", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-[26rem] top-12 z-30", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, stickyHeaderBase, "left-[32rem] top-12 z-30", isScrolled && "shadow-lg")}></TableHead>
                            {days.map(day => (
                                <React.Fragment key={`meals-${day}`}>
                                    <TableHead className={cn(headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 sticky border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} onMouseEnter={() => setHoveredColumn(day)} onMouseLeave={() => setHoveredColumn(null)}>D</TableHead>
                                    <TableHead className={cn(headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 sticky border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} onMouseEnter={() => setHoveredColumn(day)} onMouseLeave={() => setHoveredColumn(null)}>A</TableHead>
                                    <TableHead className={cn(headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 top-12 sticky border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} onMouseEnter={() => setHoveredColumn(day)} onMouseLeave={() => setHoveredColumn(null)}>C</TableHead>
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
                                    isScrolled={isScrolled}
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
                                        className=""
                                        isScrolled={isScrolled}
                                        hoveredColumn={hoveredColumn}
                                    />
                                ))}
                            </React.Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
