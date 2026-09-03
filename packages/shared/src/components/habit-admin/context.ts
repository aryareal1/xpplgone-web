'use client';

import { createContext, useContext } from 'react';
import type { HabitAdminCtx } from './types';

const Ctx = createContext<HabitAdminCtx | null>(null);

export const HabitAdminProvider = Ctx.Provider;

export function useHabitAdmin() {
  const value = useContext(Ctx);
  if (!value) throw new Error('AdminDashboard needs a HabitAdminProvider');
  return value;
}
