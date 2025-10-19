"use client";

import { useScheduler } from "@/lib/hooks/use-scheduler";
import { SchedulerHeader } from "./scheduler-header";
import { SchedulerTable } from "./scheduler-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Scheduler() {
  const scheduler = useScheduler();

  return (
    <Card className="w-full overflow-hidden shadow-lg h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary-foreground">Planificador Mensual</CardTitle>
        <SchedulerHeader
          filter={scheduler.filter}
          setFilter={scheduler.setFilter}
          viewMode={scheduler.viewMode}
          setViewMode={scheduler.setViewMode}
          onExport={scheduler.handleExport}
        />
      </CardHeader>
      <CardContent className="p-0 flex-grow">
          <SchedulerTable {...scheduler} />
      </CardContent>
    </Card>
  );
}
