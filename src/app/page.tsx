import Scheduler from "@/components/scheduler/scheduler";

export default function Home() {
  return (
    <main className="bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Scheduler />
    </main>
  );
}
