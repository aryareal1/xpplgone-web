import { useEffect, useState } from 'react';
import api from '@fe/lib/api';
import {
  type Check,
  type CheckinRecap,
  fmtMonth,
  type StreakData,
  streakForCheckStatus,
} from '../../data/habit-data';

/**
 * The streak shown in the header. Uses the same endpoint and rules as the
 * journal page so the numbers never differ.
 */
export function useStreak(enabled: boolean) {
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const today = new Date();
    const previous = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    Promise.all([
      api.checkins.streak.get(),
      api.checkins.recap.get({ query: { month: fmtMonth(today) } }),
      api.checkins.recap.get({ query: { month: fmtMonth(previous) } }),
    ])
      .then(([s, current, prev]) => {
        if (!alive) return;
        const checks: Check[] = [
          ...((prev.data?.data as CheckinRecap | undefined)?.recap ?? []),
          ...((current.data?.data as CheckinRecap | undefined)?.recap ?? []),
        ];
        setStreak(streakForCheckStatus(s.data?.data ?? null, checks, today));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [enabled]);

  return streak;
}
