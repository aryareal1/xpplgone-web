import { eq } from 'drizzle-orm';
import { db, rfidUidsTable, usersTable } from '@xirpl/db';
import { toDateStr, wibHour } from '@be/lib/utils';
import { Checkins } from '../checkins/service';
import { User } from '../user/service';

const ATTENDANCE_TYPE: 'school' | 'morning' = 'school';
const CHECKOUT_FROM_HOUR = 15;

type AttendanceResult =
  | { ok: true; status: 'checkin-success' | 'checkout-success'; actor: { rfuid: string; id: string; name: string } }
  | { ok: false; status: 'rfid-not-found' | 'already-checked-in' | 'already-checked-out' | 'not-checked-in' };

export const Iot = {
  async attendance(uid: string): Promise<AttendanceResult> {
    const [rfid] = await db
      .select({
        userId: rfidUidsTable.user_id,
        name: usersTable.display_name,
      })
      .from(rfidUidsTable)
      .innerJoin(usersTable, eq(usersTable.id, rfidUidsTable.user_id))
      .where(eq(rfidUidsTable.uid, uid))
      .limit(1);
    if (!rfid)
      return { ok: false, status: 'rfid-not-found' };

    const actor = {
      rfuid: uid,
      id: rfid.userId,
      name: rfid.name ?? '',
    };

    const isCheckOutTime = wibHour(new Date()) >= CHECKOUT_FROM_HOUR;
    const today = toDateStr(new Date());
    const existing = await Checkins.getByDate(rfid.userId, today);

    if (isCheckOutTime) {
      if (!existing?.checked_in_at)
        return { ok: false, status: 'not-checked-in' };
      if (existing.checked_out_at)
        return { ok: false, status: 'already-checked-out' };
      await Checkins.checkOut(rfid.userId);
      return { ok: true, status: 'checkout-success', actor };
    }

    if (existing?.checked_in_at)
      return { ok: false, status: 'already-checked-in' };
    const checkedIn = await Checkins.checkIn(rfid.userId, ATTENDANCE_TYPE);
    if (!checkedIn)
      return { ok: false, status: 'already-checked-in' };

    return { ok: true, status: 'checkin-success', actor };
  },

  async setCard(uid: string, user: string) {
    const found = await User.getByIdentifier(user);
    if (!found) return null;
    await db
      .insert(rfidUidsTable)
      .values({ uid, user_id: found.id })
      .onConflictDoUpdate({ target: rfidUidsTable.uid, set: { user_id: found.id } });
    return found.id;
  },
};
