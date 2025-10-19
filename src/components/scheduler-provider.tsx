
"use client";

import { useRef } from 'react';
import { SchedulerContext } from '@/lib/context';
import { createSchedulerStore } from '@/lib/store';
import { UseSchedulerProps } from '@/lib/types';

export const SchedulerProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & UseSchedulerProps) => {
  const storeRef = useRef<() => any>();
  if (!storeRef.current) {
    storeRef.current = createSchedulerStore(props);
  }

  return (
    <SchedulerContext.Provider value={storeRef.current}>
      {children}
    </SchedulerContext.Provider>
  );
};
