"use client";

import { useScheduler } from "@/lib/hooks/use-scheduler";
import { SchedulerHeader } from "./scheduler-header";
import { SchedulerTable } from "./scheduler-table";
import { Card, CardContent } from "@/components/ui/card";

export default function Scheduler() {
  const scheduler = useScheduler();

  return (
    <div className="p-2 sm:p-4 lg:p-8 bg-background min-h-screen flex flex-col">
      <header className="bg-card/70 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 mb-8 sticky top-4 z-50">
        <SchedulerHeader {...scheduler} />
      </header>
      <main className="flex-grow flex flex-col">
        <Card className="w-full flex-grow overflow-hidden shadow-2xl shadow-primary/10 rounded-2xl border-primary/10">
          <CardContent className="p-0 h-full">
              <SchedulerTable {...scheduler} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
