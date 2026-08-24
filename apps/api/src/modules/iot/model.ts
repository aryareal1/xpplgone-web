import { r } from "@be/lib/schema";
import { t } from "elysia";

const Actor = t.Object({
  rfuid: t.String(),
  id: t.String(),
  name: t.String(),
})

export const IOTModel = {
  attendanceBody: t.Object({
    uid: t.String()
  }),
  attendanceResponse: t.Union([
    r.Data('Check in successful', Actor),
    r.Data('Check out successful', Actor)
  ]),
  attendanceConflict: t.Union([
    r.Failed('Already checked in'),
    r.Failed('Already checked out')
  ]),
  attendanceInvalidUid: r.Failed('RFID uid not found'),
  attendanceNoCheckIn: r.Failed('Not checked in before')
}
