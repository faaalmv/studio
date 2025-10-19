
"use client";

import { SchedulerProvider } from "@/components/scheduler-provider";
import { SchedulerHeader } from "./scheduler-header";
import { SchedulerTable } from "./scheduler-table";
import { Card, CardContent } from "@/components/ui/card";
import { Item, Group } from "@/lib/types";

export function SchedulerClient({
  items,
  groups,
}: {
  items: Item[];
  groups: Group[];
}) {
  return (
    <SchedulerProvider items={items} groups={groups}>
      <div className="p-2 sm:p-4 lg:p-8 bg-background min-h-screen flex flex-col">
        <header className="bg-card/70 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 mb-8 sticky top-4 z-50">
          <SchedulerHeader />
        </header>
        <main className="flex-grow flex flex-col">
          <Card className="w-full flex-grow overflow-hidden shadow-2xl shadow-primary/10 rounded-2xl border-primary/10 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-0 h-full">
              <SchedulerTable />
            </CardContent>
          </Card>
        </main>
      </div>
    </SchedulerProvider>
  );
}
