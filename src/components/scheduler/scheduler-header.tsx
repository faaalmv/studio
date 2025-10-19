"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewMode } from "@/lib/types";
import { FileDown, Search } from "lucide-react";

interface SchedulerHeaderProps {
  filter: string;
  setFilter: (filter: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onExport: () => void;
}

export function SchedulerHeader({
  filter,
  setFilter,
  viewMode,
  setViewMode,
  onExport,
}: SchedulerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
      <div className="relative w-full sm:w-auto sm:flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter by description, code, or group..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={onExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
