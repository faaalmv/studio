"use client";

import { useScheduler } from "@/lib/hooks/use-scheduler";
import { SchedulerHeader } from "./scheduler-header";
import { SchedulerTable } from "./scheduler-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Scheduler() {
  const scheduler = useScheduler();

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-background min-h-screen">
      <Card className="w-full overflow-hidden shadow-2xl shadow-primary/20 h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] flex flex-col rounded-2xl border-primary/20">
        <CardHeader className="p-4 sm:p-6 border-b">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Planificador Mensual</CardTitle>
          <CardDescription className="uppercase font-bold text-accent">
            {scheduler.selectedMonthLabel} - {scheduler.selectedService}
          </CardDescription>
          <SchedulerHeader
            {...scheduler}
          />
        </CardHeader>
        <CardContent className="p-0 flex-grow relative overflow-auto">
          <SchedulerTable {...scheduler} />
        </CardContent>
      </Card>
    </div>
  );
}
