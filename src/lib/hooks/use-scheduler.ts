
"use client";

import { useContext } from 'react';
import { SchedulerContext } from '@/lib/context';
import { UseSchedulerProps } from '@/lib/types';

export const useScheduler = () => {
  const store = useContext(SchedulerContext);
  if (!store) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return store();
};
