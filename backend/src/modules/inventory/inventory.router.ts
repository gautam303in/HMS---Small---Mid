/**
 * ============================================================================
 * INVENTORY & LAUNDRY DOMAIN MODULE
 * Handles Stock Ledgers, Balances Projection, Depletion Alerts, and Linen Turnover
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { LaundryBatch } from '../../types/index.js';
import { outbox } from '../../events/outboxProcessor.js';

export const inventoryRouter = Router();

inventoryRouter.get('/inventory', (req: Request, res: Response) => {
  res.json(store.inventoryItems);
});

inventoryRouter.patch('/inventory/:id/stock', (req: Request, res: Response) => {
  const item = store.inventoryItems.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const oldStock = item.currentStock;
  item.currentStock = Number(req.body.currentStock);
  item.lastRestocked = new Date().toISOString().slice(0, 10);

  outbox.recordEvent('stock.adjusted', 'InventoryItem', item.id, {
    name: item.name,
    oldStock,
    newStock: item.currentStock,
    minThreshold: item.minThreshold
  });

  res.json(item);
});

inventoryRouter.get('/laundry', (req: Request, res: Response) => {
  res.json(store.laundryBatches);
});

inventoryRouter.post('/laundry', (req: Request, res: Response) => {
  const { itemType, quantity, vendor } = req.body;
  const newBatch: LaundryBatch = {
    id: `ld-${Date.now()}`,
    batchNumber: `LB-2026-${Math.floor(100 + Math.random() * 900)}`,
    itemType,
    quantity: Number(quantity),
    status: 'Washing',
    vendor: vendor || 'In-House Hydro-Laundry',
    sentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    expectedReturnDate: 'Same Day 18:00'
  };
  store.laundryBatches.unshift(newBatch);
  res.status(201).json(newBatch);
});

inventoryRouter.patch('/laundry/:id/status', (req: Request, res: Response) => {
  const batch = store.laundryBatches.find(b => b.id === req.params.id);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  batch.status = req.body.status;
  res.json(batch);
});
