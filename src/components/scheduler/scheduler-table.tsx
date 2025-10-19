
"use client";

import React, { memo, useState, useRef, useCallback, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { useScheduler } from '@/lib/hooks/use-scheduler';
import { CheckCircle, AlertTriangle } from "lucide-react";
import { QuantityStepper } from './quantity-stepper';
import { MEALS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SchedulerGroupHeader } from './scheduler-group-header';
import { useCollapsible } from '@/lib/hooks/use-collapsible';
import { initialGroups } from '@/lib/data';
import { useVirtualizer } from '@tanstack/react-virtual';

type SchedulerTableProps = ReturnType<typeof useScheduler>;

const MemoizedTableRow = memo(function MemoizedTableRow({ item, schedule, totals, viewMode, days, updateQuantity, getDailyTotal, isLast, style, className, isScrolled, hoveredColumn }: { item: any, isLast: boolean, style: React.CSSProperties, className: string, isScrolled: boolean, hoveredColumn: number | null } & Omit<SchedulerTableProps, 'items' | 'groups'>) {
    const cellStyles = "p-0 h-14 transition-colors duration-200";
    
    const groupBg = cn("bg-card");
    const groupBorder = cn(
        "shadow-[inset_4px_0_6px_-4px_var(--group-color)]",
        {
            '[--group-color:hsl(var(--chart-1))]': item.group === 'Abarrotes',
            '[--group-color:hsl(var(--chart-2))]': item.group === 'Carnes',
            '[--group-color:hsl(var(--chart-3))]': item.group === 'Embutidos',
            '[--group-color:hsl(var(--chart-4))]': item.group === 'Frutas',
            '[--group-color:hsl(var(--chart-5))]': item.group === 'Lacteos',
            '[--group-color:hsl(var(--cyan-500))]': item.group === 'Aves y Huevo',
            '[--group-color:hsl(var(--indigo-500))]': item.group === 'Pescados y Mariscos',
            '[--group-color:hsl(var(--amber-500))]': item.group === 'Panaderia y Tortilleria',
            '[--group-color:hsl(var(--lime-500))]': item.group === 'Semillas y Cereales',
            '[--group-color:hsl(var(--emerald-500))]': item.group === 'Verduras y Hortalizas',
            '[--group-color:hsl(var(--sky-500))]': item.group === 'Congelados',
        }
    );

    const { remaining, totalPossible, percentage } = useMemo(() => {
        const remaining = totals[item.id].remaining;
        const totalPossible = totals[item.id].totalPossible;
        const percentage = totalPossible > 0 ? (remaining / totalPossible) * 100 : 100;
        return { remaining, totalPossible, percentage };
    }, [totals, item.id]);
    
    const remainingCellBg = useMemo(() => cn({
        'bg-green-500/10 text-green-700': percentage > 75,
        'bg-sky-500/10 text-sky-700': percentage > 50 && percentage <= 75,
        'bg-amber-400/10 text-amber-700': percentage > 25 && percentage <= 50,
        'bg-orange-500/10 text-orange-700': percentage > 0 && percentage <= 25,
        'bg-rose-500/10 text-rose-700': percentage <= 0,
    }), [percentage]);

    const total = totals[item.id].total;
    const rowClasses = "group row-transition animate-slide-down-fade-in bg-card hover:z-10";

    const onDetailedValueChange = useCallback((day, meal) => (newValue) => {
        updateQuantity(item.id, day, meal, newValue)
    }, [item.id, updateQuantity]);

    return (
        <TableRow className={cn(rowClasses, className, "relative")} style={style}>
            <TableCell className={cn(cellStyles, "sticky left-0 z-10 w-32 p-2 text-left align-middle", isScrolled && "shadow-lg", groupBg, "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>
                 <Badge variant="secondary" className="font-mono text-xs">{item.code}</Badge>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky left-32 z-10 w-64 p-2 text-left align-middle", isScrolled && "shadow-lg", groupBg, "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>
                <div className="font-bold text-sm">{item.description}</div>
            </TableCell>
            <TableCell className={cn(cellStyles, "sticky left-96 z-10 w-24 text-center align-middle", isScrolled && "shadow-lg", groupBg, "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>{item.unit}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[30rem] w-24 font-mono z-10 align-middle text-lg", isScrolled && "shadow-lg", groupBg, totals[item.id].isOverLimit && "text-destructive", "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>{total}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[36rem] w-24 font-mono z-10 align-middle text-lg", remainingCellBg, isScrolled && "shadow-lg", "font-bold", "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>{remaining}</TableCell>
            <TableCell className={cn(cellStyles, "sticky text-center left-[42rem] z-10 align-middle w-24", isScrolled && "shadow-lg", groupBg, groupBorder, "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>
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
                
                const isDayFocused = hoveredColumn === day;
                const isFocusContainerActive = hoveredColumn !== null;
                const opacityClass = isFocusContainerActive && !isDayFocused ? 'opacity-40' : 'opacity-100';


                if (viewMode === 'general') {
                    return (
                        <TableCell key={`${item.id}-${day}`} className={cn("text-center w-24 align-middle border-l", cellStyles, isHovered && "bg-primary/5", (dailyTotal > 0 && !isHovered) && 'bg-primary/5', "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>
                             <QuantityStepper
                                value={dailyTotal}
                                onValueChange={(newValue) => {
                                    const diff = newValue - dailyTotal;
                                    const currentBreakfast = schedule[item.id]?.[day]?.desayuno ?? 0;
                                    updateQuantity(item.id, day, 'desayuno', currentBreakfast + diff, true);
                                }}
                                max={item.totalPossible}
                                dailyTotal={dailyTotal}
                            />
                        </TableCell>
                    );
                }

                const isEvenDay = (day - 1) % 2 === 0;

                return (
                    <React.Fragment key={`${item.id}-${day}-detailed`}>
                        {MEALS.map((meal, mealIndex) => {
                            const mealValue = schedule[item.id]?.[day]?.[meal] ?? 0;
                            const borderClass = mealIndex === 2 ? 'border-r-slate-300' : 'border-r-dotted border-r-slate-200';
                            const backgroundClass = isEvenDay ? 'bg-slate-50/50' : 'bg-card';

                            return (
                                <TableCell 
                                    key={`${item.id}-${day}-${meal}`} 
                                    className={cn(
                                        "w-12 align-middle border-l", 
                                        cellStyles,
                                        borderClass,
                                        backgroundClass,
                                        isHovered && "bg-primary/5",
                                        (mealValue > 0 && !isHovered) && 'bg-primary/5',
                                        "shadow-[inset_0_-1px_0_0_hsl(var(--border))]",
                                        "transition-opacity duration-300",
                                        opacityClass
                                    )}
                                >
                                    <QuantityStepper
                                        value={mealValue}
                                        onValueChange={onDetailedValueChange(day, meal)}
                                        max={item.totalPossible}
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
    const { expandedItems, toggleItem } = useCollapsible(initialGroups.map(g => g.name));
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            setIsScrolled(scrollContainerRef.current.scrollLeft > 5);
        }
    }, []);

    const headerCellStyles = "p-2 align-middle text-sm font-semibold text-center bg-card shadow-inner-white";
    
    const handleColumnHover = useCallback((day: number | null) => {
        setHoveredColumn(day);
    }, []);

    const headerHeight = viewMode === 'detailed' ? 'top-12' : 'top-0';
    const groupHeaderTop = viewMode === 'detailed' ? 'top-[8rem]' : 'top-[4rem]';
    
    const allItems = useMemo(() => {
        const all = [];
        for (const group of groups) {
            const isExpanded = expandedItems.includes(group.name);
            const groupItems = items.filter(item => item.group === group.name);
            if (groupItems.length === 0) continue;
            
            all.push({ type: 'group', group, groupItems, isExpanded });
            if (isExpanded) {
                for (const item of groupItems) {
                    all.push({ type: 'item', item });
                }
            }
        }
        return all;
    }, [groups, items, expandedItems]);
    
    const rowVirtualizer = useVirtualizer({
        count: allItems.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: (index) => allItems[index].type === 'group' ? 48 : 56,
        overscan: 5,
    });


    return (
        <div ref={scrollContainerRef} onScroll={handleScroll} className="h-full w-full overflow-auto">
            <Table style={{ height: `${rowVirtualizer.getTotalSize()}px`}} className="min-w-max border-separate border-spacing-0 relative">
                <TableHeader className="sticky top-0 z-30 bg-card">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className={cn(headerCellStyles, "sticky left-0 w-32 z-40 border-b text-left", isScrolled && "shadow-lg")}>Código</TableHead>
                        <TableHead className={cn(headerCellStyles, "sticky left-32 w-64 z-40 border-b text-left", isScrolled && "shadow-lg")}>Descripción</TableHead>
                        <TableHead className={cn(headerCellStyles, "sticky left-96 w-24 z-40 border-b text-center", isScrolled && "shadow-lg")}>Unidad</TableHead>
                        <TableHead className={cn(headerCellStyles, "sticky left-[30rem] w-24 z-40 border-b", isScrolled && "shadow-lg")}>Total</TableHead>
                        <TableHead className={cn(headerCellStyles, "sticky left-[36rem] w-24 z-40 border-b", isScrolled && "shadow-lg")}>Rest.</TableHead>
                        <TableHead className={cn(headerCellStyles, "sticky left-[42rem] w-24 z-40 border-b", isScrolled && "shadow-lg")}>Estado</TableHead>
                        {days.map(day => (
                            <TableHead 
                                key={day} 
                                colSpan={viewMode === 'detailed' ? 3 : 1} 
                                className={cn(headerCellStyles, "w-24 border-b border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")}
                                onMouseEnter={() => handleColumnHover(day)}
                                onMouseLeave={() => handleColumnHover(null)}
                            >
                                {day}
                            </TableHead>
                        ))}
                    </TableRow>
                    {viewMode === 'detailed' && (
                        <TableRow className="hover:bg-transparent">
                            <TableHead className={cn(headerCellStyles, "sticky left-0 z-40 border-b", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, "sticky left-32 z-40 border-b", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, "sticky left-96 z-40 border-b", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, "sticky left-[30rem] z-40 border-b", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, "sticky left-[36rem] z-40 border-b", isScrolled && "shadow-lg")}></TableHead>
                            <TableHead className={cn(headerCellStyles, "sticky left-[42rem] z-40 border-b", isScrolled && "shadow-lg")}></TableHead>
                            {days.map(day => (
                                <React.Fragment key={`meals-${day}`}>
                                    <TableHead className={cn(headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 border-b border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} onMouseEnter={() => handleColumnHover(day)} onMouseLeave={() => handleColumnHover(null)}>D</TableHead>
                                    <TableHead className={cn(headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 border-b border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} onMouseEnter={() => handleColumnHover(day)} onMouseLeave={() => handleColumnHover(null)}>A</TableHead>
                                    <TableHead className={cn(headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 border-b border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} onMouseEnter={() => handleColumnHover(day)} onMouseLeave={() => handleColumnHover(null)}>C</TableHead>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    )}
                </TableHeader>
                <TableBody>
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const row = allItems[virtualItem.index];
                        if (row.type === 'group') {
                            const { group, groupItems, isExpanded } = row;
                            const colSpan = 6 + (viewMode === 'detailed' ? days.length * 3 : days.length);
                            return (
                                <SchedulerGroupHeader
                                    key={virtualItem.key}
                                    group={group}
                                    items={groupItems}
                                    totals={totals}
                                    isExpanded={isExpanded}
                                    onToggle={() => toggleItem(group.name)}
                                    colSpan={colSpan}
                                    stickyTopClass={viewMode === 'detailed' ? 'top-[5rem]' : 'top-[2.srem]'}
                                    style={{
                                        transform: `translateY(${virtualItem.start}px)`,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                    }}
                                />
                            );
                        }
                        
                        const { item } = row;
                        return (
                            <MemoizedTableRow
                                key={virtualItem.key}
                                item={item}
                                schedule={schedule}
                                totals={totals}
                                viewMode={viewMode}
                                days={days}
                                updateQuantity={updateQuantity}
                                getDailyTotal={getDailyTotal}
                                isLast={false}
                                style={{
                                    transform: `translateY(${virtualItem.start}px)`,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    animationDelay: `${virtualItem.index * 30}ms`
                                }}
                                className=""
                                isScrolled={isScrolled}
                                hoveredColumn={hoveredColumn}
                            />
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
