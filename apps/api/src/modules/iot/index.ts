import Elysia from 'elysia';
import { IOTModel } from './model';
import { AuthModel } from '../auth/model';
import { Iot } from './service';
import bearer from '@elysia/bearer';

export const iot = new Elysia({ prefix: '/iots' })
  .use(bearer())
  .post(
    '/attendance',
    async ({ bearer, body, status }) => {
      if (bearer !== process.env.IOT_ACCESS_KEY)
        return status(403, { success: false, message: 'Forbidden' });

      const result = await Iot.attendance(body.uid);
      switch (result.status) {
        case 'rfid-not-found':
          return status(404, { success: false, message: 'RFID uid not found' });
        case 'not-checked-in':
          return status(400, { success: false, message: 'Not checked in before' });
        case 'already-checked-in':
          return status(409, { success: false, message: 'Already checked in' });
        case 'already-checked-out':
          return status(409, { success: false, message: 'Already checked out' });
        case 'checkin-success':
          return status(200, {
            success: true,
            message: 'Check in successful',
            data: result.actor,
          });
        case 'checkout-success':
          return status(200, {
            success: true,
            message: 'Check out successful',
            data: result.actor,
          });
      }
    },
    {
      body: IOTModel.attendanceBody,
      response: {
        200: IOTModel.attendanceResponse,
        404: IOTModel.attendanceInvalidUid,
        409: IOTModel.attendanceConflict,
        400: IOTModel.attendanceNoCheckIn,
        403: AuthModel.forbidden,
      },
    },
  );
