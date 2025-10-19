
"use client";

import React, { memo, useState, useRef, useCallback, useMemo, useId } from 'react';
import { useScheduler } from "@/lib/hooks/use-scheduler";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { QuantityStepper } from './quantity-stepper';
import { MEALS, Meal } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SchedulerGroupHeader } from './scheduler-group-header';
import { useVirtualizer } from '@tanstack/react-virtual';
import { GROUP_STYLES, STICKY_CELL_CLASSES, REMAINING_CELL_BG_CLASSES } from '@/lib/styles';

const StickyTableCell = React.forwardRef<HTMLTableCellElement, { isScrolled: boolean, position: string, width: string, children: React.ReactNode, className?: string, isHeader?: boolean, [key: string]: any }>(({ isScrolled, position, width, children, className, isHeader, ...props }, ref) => (
    <TableCell 
        ref={ref}
        className={cn(
            STICKY_CELL_CLASSES, 
            position, 
            width, 
            isScrolled && "shadow-lg", 
            isHeader ? "bg-card" : "bg-card/95 backdrop-blur-sm",
            "shadow-[inset_0_-1px_0_0_hsl(var(--border))]",
            className
        )} 
        {...props}
    >
        {children}
    </TableCell>
));
StickyTableCell.displayName = 'StickyTableCell';

const MemoizedTableRow = memo(function MemoizedTableRow({ item, isLast, style, className, isScrolled, hoveredColumn }: { item: any, isLast: boolean, style: React.CSSProperties, className: string, isScrolled: boolean, hoveredColumn: number | null }) {
    const id = useId();
    const {
        schedule,
        totals,
        viewMode,
        days,
        updateQuantity,
        getDailyTotal,
    } = useScheduler();
    
    const cellStyles = "p-0 h-14 transition-colors duration-200";
    
    const groupStyle = GROUP_STYLES[item.group] || {};
    const groupBorder = cn("shadow-[inset_4px_0_6px_-4px_var(--group-color)]", groupStyle.groupColor);

    const { remaining, totalPossible, percentage } = useMemo(() => {
        const remaining = totals[item.id].remaining;
        const totalPossible = totals[item.id].totalPossible;
        const percentage = totalPossible > 0 ? (remaining / totalPossible) * 100 : 100;
        return { remaining, totalPossible, percentage };
    }, [totals, item.id]);
    
    const getRemainingCellBg = (percentage: number) => {
        if (percentage > 75) return REMAINING_CELL_BG_CLASSES.gt75;
        if (percentage > 50) return REMAINING_CELL_BG_CLASSES.gt50;
        if (percentage > 25) return REMAINING_CELL_BG_CLASSES.gt25;
        if (percentage > 0) return REMAINING_CELL_BG_CLASSES.gt0;
        return REMAINING_CELL_BG_CLASSES.lte0;
    };
    
    const remainingCellBg = useMemo(() => getRemainingCellBg(percentage), [percentage]);

    const total = totals[item.id].total;
    const rowClasses = "group row-transition animate-slide-down-fade-in hover:z-10";

    const onDetailedValueChange = useCallback((day, meal) => (newValue) => {
        updateQuantity(item.id, day, meal, newValue)
    }, [item.id, updateQuantity]);

    const onGeneralValueChange = useCallback((day, dailyTotal) => (newValue) => {
        const diff = newValue - dailyTotal;
        const currentBreakfast = schedule[item.id]?.[day]?.desayuno ?? 0;
        updateQuantity(item.id, day, 'desayuno', currentBreakfast + diff);
    }, [item.id, schedule, updateQuantity]);

    return (
        <TableRow className={cn(rowClasses, className, "relative")} style={style}>
            <StickyTableCell isScrolled={isScrolled} position="left-0" width="w-32" className="p-2 text-left align-middle">
                <Badge variant="secondary" className="font-mono text-xs">{item.code}</Badge>
            </StickyTableCell>
            <StickyTableCell isScrolled={isScrolled} position="left-32" width="w-64" className="p-2 text-left align-middle">
                <div className="font-bold text-sm">{item.description}</div>
            </StickyTableCell>
            <StickyTableCell isScrolled={isScrolled} position="left-96" width="w-24">{item.unit}</StickyTableCell>
            <StickyTableCell isScrolled={isScrolled} position="left-[30rem]" width="w-24" className={cn("font-mono text-lg", totals[item.id].isOverLimit && "text-destructive")}>{total}</StickyTableCell>
            <StickyTableCell isScrolled={isScrolled} position="left-[36rem]" width="w-24" className={cn("font-mono text-lg font-bold", remainingCellBg)}>{remaining}</StickyTableCell>
            <StickyTableCell isScrolled={isScrolled} position="left-[42rem]" width="w-24" className={groupBorder}>
                <div className="flex justify-center items-center">
                    <div className={cn('h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300', 
                        totals[item.id].isOverLimit ? 'bg-rose-500/20' : (total > 0 ? 'bg-green-500/20' : 'bg-transparent')
                    )}>
                        {totals[item.id].isOverLimit ? <AlertTriangle className="h-5 w-5 text-destructive" /> : (total > 0 && <CheckCircle className="h-5 w-5 text-green-500" />)}
                    </div>
                </div>
            </StickyTableCell>
            {days.map(day => {
                const dailyTotal = getDailyTotal(item.id, day);
                const isHovered = hoveredColumn === day;
                const isFocusContainerActive = hoveredColumn !== null;
                const opacityClass = isFocusContainerActive && !isHovered ? 'opacity-40' : 'opacity-100';
                const stepperId = `${id}-stepper-${day}`;

                if (viewMode === 'general') {
                    return (
                        <TableCell key={`${item.id}-${day}`} className={cn("text-center w-24 align-middle border-l", cellStyles, isHovered && "bg-primary/5", (dailyTotal > 0 && !isHovered) && 'bg-primary/5', "shadow-[inset_0_-1px_0_0_hsl(var(--border))]")}>
                            <label htmlFor={stepperId} className="sr-only">{`Cantidad para ${item.description} en día ${day}`}</label>
                             <QuantityStepper
                                aria-labelledby={stepperId}
                                value={dailyTotal}
                                onValueChange={onGeneralValueChange(day, dailyTotal)}
                                max={item.totalPossible}
                            />
                        </TableCell>
                    );
                }

                return (
                    <React.Fragment key={`${item.id}-${day}-detailed`}>
                        {MEALS.map((meal: Meal) => {
                            const mealValue = schedule[item.id]?.[day]?.[meal] ?? 0;
                            const borderClass = meal === 'cena' ? 'border-r-slate-300' : 'border-r-dotted border-r-slate-200';
                            const backgroundClass = (day - 1) % 2 === 0 ? 'bg-slate-50/50' : 'bg-card';
                            const mealStepperId = `${id}-stepper-${day}-${meal}`;

                            return (
                                <TableCell 
                                    key={`${item.id}-${day}-${meal}`} 
                                    className={cn("w-12 align-middle border-l", cellStyles, borderClass, backgroundClass, isHovered && "bg-primary/5", (mealValue > 0 && !isHovered) && 'bg-primary/5', "shadow-[inset_0_-1px_0_0_hsl(var(--border))]", "transition-opacity duration-300", opacityClass)}
                                >
                                    <label htmlFor={mealStepperId} className="sr-only">{`Cantidad para ${item.description} en día ${day}, ${meal}`}</label>
                                    <QuantityStepper
                                        aria-labelledby={mealStepperId}
                                        value={mealValue}
                                        onValueChange={onDetailedValueChange(day, meal)}
                                        max={item.totalPossible}
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

export function SchedulerTable() {
    const {
        items,
        groups,
        viewMode,
        days,
        totals,
        toggleGroupCollapsed,
        collapsedGroups,
        getFilteredItems,
    } = useScheduler();

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

    const filteredItems = getFilteredItems();

    const allItems = useMemo(() => {
      return groups.flatMap(group => {
        const groupItems = filteredItems.filter(item => item.group === group.name);
        if (groupItems.length === 0) return [];

        const isExpanded = !collapsedGroups[group.name];
        const groupNode = { type: 'group', group, groupItems, isExpanded, id: group.name };
        const itemNodes = isExpanded ? groupItems.map(item => ({ type: 'item', item, id: item.id })) : [];
        
        return [groupNode, ...itemNodes];
      });
    }, [groups, filteredItems, collapsedGroups]);
    
    const rowVirtualizer = useVirtualizer({
        count: allItems.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: (index) => allItems[index].type === 'group' ? 48 : 56,
        overscan: 5,
        key: (index) => allItems[index].id,
    });

    const headerTop = `top-0`;
    const mealHeaderTop = `top-[2.5rem]`;
    const groupHeaderTop = viewMode === 'detailed' ? 'top-[5rem]' : 'top-[2.5rem]';
    
    return (
      <div ref={scrollContainerRef} onScroll={handleScroll} className="h-full w-full overflow-auto relative">
        <style>{`
          .row-transition {
            transition: background-color 0.2s ease-in-out;
          }
          .animate-slide-down-fade-in {
            animation: slide-down-fade-in 0.3s ease-out forwards;
          }
          @keyframes slide-down-fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
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
                <TableHead key={day} colSpan={viewMode === 'detailed' ? 3 : 1} className={cn(headerCellStyles, "w-24 border-b border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} onMouseEnter={() => handleColumnHover(day)} onMouseLeave={() => handleColumnHover(null)}>
                  {day}
                </TableHead>
              ))}
            </TableRow>
            {viewMode === 'detailed' && (
              <TableRow className="hover:bg-transparent">
                <TableHead className={cn(headerCellStyles, "sticky left-0 z-40 border-b", isScrolled && "shadow-lg")} style={{ top: mealHeaderTop }} />
                <TableHead className={cn(headerCellStyles, "sticky left-32 z-40 border-b", isScrolled && "shadow-lg")} style={{ top: mealHeaderTop }} />
                <TableHead className={cn(headerCellStyles, "sticky left-96 z-40 border-b", isScrolled && "shadow-lg")} style={{ top: mealHeaderTop }} />
                <TableHead className={cn(headerCellStyles, "sticky left-[30rem] z-40 border-b", isScrolled && "shadow-lg")} style={{ top: mealHeaderTop }} />
                <TableHead className={cn(headerCellStyles, "sticky left-[36rem] z-40 border-b", isScrolled && "shadow-lg")} style={{ top: mealHeaderTop }} />
                <TableHead className={cn(headerCellStyles, "sticky left-[42rem] z-40 border-b", isScrolled && "shadow-lg")} style={{ top: mealHeaderTop }} />
                {days.map(day => (
                  <React.Fragment key={`meals-${day}`}>
                    {MEALS.map(meal => (
                      <TableHead key={meal} className={cn(headerCellStyles, "text-center text-xs font-medium text-muted-foreground w-12 border-b border-l transition-colors duration-200", hoveredColumn === day && "bg-primary/5")} style={{ top: mealHeaderTop }} onMouseEnter={() => handleColumnHover(day)} onMouseLeave={() => handleColumnHover(null)}>
                        {meal.charAt(0).toUpperCase()}
                      </TableHead>
                    ))}
                  </React.Fragment>
                ))}
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const row = allItems[virtualItem.index];
              const commonStyle = {
                transform: `translateY(${virtualItem.start}px)`,
                position: 'absolute' as const,
                top: 0,
                left: 0,
                width: '100%',
              };

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
                    onToggle={() => toggleGroupCollapsed(group.name)}
                    colSpan={colSpan}
                    stickyTopClass={groupHeaderTop}
                    style={commonStyle}
                  />
                );
              }
              
              const { item } = row;
              return (
                <MemoizedTableRow
                    key={virtualItem.key}
                    item={item}
                    isLast={false}
                    style={{...commonStyle, animationDelay: `${virtualItem.index * 30}ms` }}
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
