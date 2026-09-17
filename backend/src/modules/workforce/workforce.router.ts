/**
 * ============================================================================
 * WORKFORCE & ATTENDANCE DOMAIN MODULE
 * Handles Staff Rosters, Biometric Clock-in/out, and Leave Approvals
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { outbox } from '../../events/outboxProcessor.js';

export const workforceRouter = Router();

workforceRouter.get('/staff', (req: Request, res: Response) => {
  res.json(store.staffMembers);
});

workforceRouter.get('/staff/attendance', (req: Request, res: Response) => {
  res.json(store.attendanceRecords);
});

workforceRouter.post('/staff/attendance/punch', (req: Request, res: Response) => {
  const { staffId, method } = req.body;
  const staff = store.staffMembers.find(s => s.id === staffId);
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });

  const now = new Date();
  const timeString = now.toTimeString().slice(0, 8);
  const dateString = now.toISOString().slice(0, 10);

  const existingPunch = store.attendanceRecords.find(a => a.staffId === staffId && a.date === dateString);
  if (existingPunch && !existingPunch.clockOut) {
    existingPunch.clockOut = timeString;
    staff.status = 'Off Duty';

    outbox.recordEvent('attendance.recorded', 'Staff', staff.id, {
      staffName: staff.name,
      type: 'ClockOut',
      time: timeString
    });

    store.logAudit(staff.name, staff.role, 'STAFF_CLOCK_OUT', `Clocked out at ${timeString}`);
    return res.json({ message: 'Clocked out successfully', record: existingPunch });
  }

  const newRecord = {
    id: `att-${Date.now()}`,
    staffId: staff.id,
    staffName: staff.name,
    date: dateString,
    clockIn: timeString,
    method: method || 'Mobile App GPS',
    status: 'Present' as const
  };

  store.attendanceRecords.unshift(newRecord);
  staff.status = 'On Duty';
  staff.punchInTime = timeString;

  outbox.recordEvent('attendance.recorded', 'Staff', staff.id, {
    staffName: staff.name,
    type: 'ClockIn',
    time: timeString
  });

  store.logAudit(staff.name, staff.role, 'STAFF_CLOCK_IN', `Clocked in at ${timeString} via ${method}`);
  res.json({ message: 'Clocked in successfully', record: newRecord });
});

workforceRouter.get('/staff/leave', (req: Request, res: Response) => {
  res.json(store.leaveRequests);
});
