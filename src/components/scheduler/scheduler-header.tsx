"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FileDown, Search } from "lucide-react";

interface SchedulerHeaderProps {
  filter: string;
  setFilter: (filter: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onExport: () => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  monthOptions: { value: string; label: string }[];
  selectedService: string;
  setSelectedService: (service: string) => void;
  serviceOptions: { value: string; label: string }[];
  selectedMonthLabel: string;
}

export function SchedulerHeader({
  filter,
  setFilter,
  viewMode,
  setViewMode,
  onExport,
  selectedMonth,
  setSelectedMonth,
  monthOptions,
  selectedService,
  setSelectedService,
  serviceOptions,
  selectedMonthLabel,
}: SchedulerHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-left">
              <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                Programación Mensual
              </h1>
              <p className="text-primary mt-1 text-lg font-bold uppercase tracking-wider">
                {selectedMonthLabel} - {selectedService}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <label htmlFor="month-select" className="block text-sm font-medium text-muted-foreground">Mes</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month-select" className="mt-1 glass-select-button">
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
                 <label htmlFor="service-select" className="block text-sm font-medium text-muted-foreground">Servicio</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger id="service-select" className="mt-1 glass-select-button">
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Filtrar por código, descripción o grupo..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 bg-background/50"
                />
            </div>
            <div className="flex items-center gap-4">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <TabsList className="bg-muted/80">
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
