
import { SchedulerClient } from "./scheduler-client";
import { initialItems, initialGroups } from "@/lib/data";

export default function Scheduler() {
  return <SchedulerClient items={initialItems} groups={initialGroups} />;
}
