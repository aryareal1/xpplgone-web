import { Suspense } from 'react';
import LeaderboardBoard from './board';

export default function LeaderboardPage() {
  return (
    <Suspense>
      <LeaderboardBoard />
    </Suspense>
  );
}
