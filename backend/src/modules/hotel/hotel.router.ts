/**
 * ============================================================================
 * HOTEL & ROOM DOMAIN MODULE
 * Handles Room Catalog, Room State Machine, and Lodgify Dashboard Metrics
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { RoomStatus } from '../../types/index.js';
import { outbox } from '../../events/outboxProcessor.js';

export const hotelRouter = Router();

hotelRouter.get('/rooms', (req: Request, res: Response) => {
  res.json(store.rooms);
});

hotelRouter.get('/rooms/:id', (req: Request, res: Response) => {
  const room = store.rooms.find(r => r.id === req.params.id || r.roomNumber === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

hotelRouter.patch('/rooms/:id/status', (req: Request, res: Response) => {
  const { status } = req.body as { status: RoomStatus };
  const roomIndex = store.rooms.findIndex(r => r.id === req.params.id || r.roomNumber === req.params.id);

  if (roomIndex === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const oldStatus = store.rooms[roomIndex].status;
  store.rooms[roomIndex].status = status;

  if (status === 'Available') {
    store.rooms[roomIndex].currentGuest = undefined;
    store.rooms[roomIndex].currentReservationId = undefined;
  }

  outbox.recordEvent('room.status_changed', 'Room', store.rooms[roomIndex].id, {
    roomNumber: store.rooms[roomIndex].roomNumber,
    oldStatus,
    newStatus: status
  });

  store.logAudit('Staff', 'Operations', 'ROOM_STATUS_CHANGED', `Room ${store.rooms[roomIndex].roomNumber} transitioned from ${oldStatus} to ${status}`);

  res.json(store.rooms[roomIndex]);
});

hotelRouter.get('/dashboard', (req: Request, res: Response) => {
  const total = store.rooms.length;
  const occupied = store.rooms.filter(r => r.status === 'Occupied').length;
  const reserved = store.rooms.filter(r => r.status === 'Dirty' || r.status === 'Cleaning').length;
  const available = store.rooms.filter(r => r.status === 'Available' || r.status === 'Inspected').length;
  const notReady = store.rooms.filter(r => r.status === 'OutOfOrder').length;

  const directBookings = store.reservations.filter(r => r.source === 'Direct').length;
  const bookingCom = store.reservations.filter(r => r.source === 'Booking.com').length;
  const airbnb = store.reservations.filter(r => r.source === 'Airbnb').length;
  const expedia = store.reservations.filter(r => r.source === 'Expedia').length;

  const totalRev = store.folios.reduce((sum, f) => sum + f.grandTotal, 0);

  res.json({
    metrics: {
      newBookings: 840,
      newBookingsTrend: '+8.70%',
      checkIn: 231,
      checkInTrend: '+3.56%',
      checkOut: 124,
      checkOutTrend: '-1.06%',
      totalRevenue: totalRev || 123980,
      totalRevenueTrend: '+5.70%'
    },
    roomAvailability: {
      total,
      occupied,
      reserved,
      available,
      notReady
    },
    ratings: {
      score: 4.6,
      status: 'Impressive',
      categories: [
        { name: 'Facilities', score: 4.4 },
        { name: 'Cleanliness', score: 4.7 },
        { name: 'Services', score: 4.6 },
        { name: 'Comfort', score: 4.8 },
        { name: 'Location', score: 4.5 }
      ]
    },
    bookingByPlatform: [
      { name: 'Direct Booking', percentage: 61, count: directBookings || 48 },
      { name: 'Booking.com', percentage: 12, count: bookingCom || 12 },
      { name: 'Agoda', percentage: 11, count: 8 },
      { name: 'Airbnb', percentage: 9, count: airbnb || 6 },
      { name: 'Hotels.com', percentage: 5, count: expedia || 3 },
      { name: 'Others', percentage: 2, count: 2 }
    ]
  });
});
