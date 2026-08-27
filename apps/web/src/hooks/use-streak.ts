import api from '@fe/lib/api';
import { useEffect, useState } from 'react';
import type { StreakData } from '../../data/habit-data';

/**
 * The streak shown in the header. Uses the same endpoint and rules as the
 * journal page so the numbers never differ.
 */
export function useStreak(enabled: boolean) {
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    api.checkins.streak
      .get()
      .then(({ data }) => {
        if (alive) setStreak(data?.data ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [enabled]);

  return streak;
}
