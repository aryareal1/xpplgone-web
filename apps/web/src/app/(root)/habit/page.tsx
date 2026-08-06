import { Suspense } from 'react';
import HabitJournal from './journal';

export default function HabitPage() {
  return (
    <Suspense>
      <HabitJournal />
    </Suspense>
  );
}
