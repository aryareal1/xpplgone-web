import Elysia from 'elysia';
import { IOTModel } from './model';
import { AuthModel } from '../auth/model';
import { UserModel } from '../user/model';
import { Iot } from './service';
import bearer from '@elysia/bearer';
import { requireDev } from '../auth/middleware';

export const iot = new Elysia({ prefix: '/iots', tags: ['Internet of Things'] })
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
      detail: {
        summary: 'RFID Attendance',
        description:
          'Record a check-in or check-out for an RFID card tap. 06:00-14:59 WIB is check-in; 15:00-05:59 is check-out. Requires the IOT access key.',
      },
      body: IOTModel.attendanceBody,
      response: {
        200: IOTModel.attendanceResponse,
        404: IOTModel.attendanceInvalidUid,
        409: IOTModel.attendanceConflict,
        400: IOTModel.attendanceNoCheckIn,
        403: AuthModel.forbidden,
      },
    },
  )
  
  .use(requireDev)
  .put('/card', async ({ body, status }) => {
    const userId = await Iot.setCard(body.uid, body.user);
    if (!userId)
      return status(404, { success: false, message: 'User not found' });

    return status(200, { success: true, message: 'Set RFID card successful' });
  }, {
    detail: {
      summary: 'Set RFID Card',
      description:
        'Assign an RFID uid to a user. The user field accepts either a user id (uuid) or a username. Requires a developer role.',
    },
    body: IOTModel.cardBody,
    response: {
      200: IOTModel.cardResponse,
      404: UserModel.getIdNotFound,
    },
  });
  
