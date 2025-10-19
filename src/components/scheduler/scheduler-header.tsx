
"use client";

import { useId } from 'react';
import { useScheduler } from "@/lib/hooks/use-scheduler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Search } from "lucide-react";

export function SchedulerHeader() {
  const id = useId();
  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    onExport,
    monthOptions,
    serviceOptions,
    selectedMonthLabel,
  } = useScheduler();

  const handleFilterChange = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handleMonthChange = (value: string) => {
    setFilters({ ...filters, month: value });
  };

  const handleServiceChange = (value: string) => {
    setFilters({ ...filters, service: value });
  };

  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-left">
              <h1 id="main-heading" className="text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                Programación Mensual
              </h1>
              <p className="text-primary mt-1 text-lg font-bold uppercase tracking-wider">
                {selectedMonthLabel} - {filters.service}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <label htmlFor={`${id}-month-select`} className="block text-sm font-medium text-muted-foreground">Mes</label>
                <Select value={filters.month} onValueChange={handleMonthChange}>
                    <SelectTrigger id={`${id}-month-select`} className="mt-1 glass-select-button">
                        <SelectValue placeholder="Seleccionar Mes" />
                    </SelectTrigger>
                    <SelectContent className="glass-select-menu">
                        {monthOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-48">
                 <label htmlFor={`${id}-service-select`} className="block text-sm font-medium text-muted-foreground">Servicio</label>
                <Select value={filters.service} onValueChange={handleServiceChange}>
                    <SelectTrigger id={`${id}-service-select`} className="mt-1 glass-select-button">
                        <SelectValue placeholder="Seleccionar Servicio" />
                    </SelectTrigger>
                    <SelectContent className="glass-select-menu">
                        {serviceOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
          </div>


        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
                <label htmlFor={`${id}-filter-input`} className="sr-only">Filtrar</label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`${id}-filter-input`}
                  placeholder="Filtrar por código, descripción o grupo..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="pl-10 bg-background/50"
                />
            </div>
            <div className="flex items-center gap-4">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'general' | 'detailed')}>
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="detailed">Detallado</TabsTrigger>
                    </TabsList>
                </Tabs>
                 <Button onClick={onExport} variant="outline">
                    <FileDown className="mr-2 h-4 w-4 text-primary" />
                    Exportar
                </Button>
            </div>
        </div>
    </div>
  );
}
