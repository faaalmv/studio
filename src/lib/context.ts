
import { createContext } from 'react';
import { SchedulerStore } from '@/lib/types';

export const SchedulerContext = createContext<(() => SchedulerStore) | null>(
  null
);
