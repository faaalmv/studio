"use client";

import { useScheduler } from "@/lib/hooks/use-scheduler";
import { SchedulerHeader } from "./scheduler-header";
import { SchedulerTable } from "./scheduler-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Scheduler() {
  const scheduler = useScheduler();

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-muted/30 min-h-screen">
      <Card className="w-full overflow-hidden shadow-2xl shadow-primary/10 h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] flex flex-col rounded-2xl">
        <CardHeader className="p-4 sm:p-6 border-b">
          <CardTitle className="text-2xl font-bold tracking-tight">Planificador Mensual</CardTitle>
          <CardDescription>Planifica tus consumos de alimentos para todo el mes.</CardDescription>
          <SchedulerHeader
            filter={scheduler.filter}
            setFilter={scheduler.setFilter}
            viewMode={scheduler.viewMode}
            setViewMode={scheduler.setViewMode}
            onExport={scheduler.handleExport}
          />
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-auto relative">
            <SchedulerTable {...scheduler} />
        </CardContent>
      </Card>
    </div>
  );
}
