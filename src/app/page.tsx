
import { SchedulerClient } from "@/components/scheduler/scheduler-client";
import { initialItems, initialGroups } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <SchedulerClient items={initialItems} groups={initialGroups} />
    </main>
  );
}
