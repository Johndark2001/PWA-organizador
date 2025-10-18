// src/db/indexedDB.js
import Dexie from "dexie";

export const db = new Dexie("PWAOrganizadorDB");

// Version 2: añadimos campos para sincronización
db.version(2).stores({
  tasks: "id, userSub, title, dueDate, status, synced",
  metrics: "userSub, date",
  syncQueue: "++id, type, payload, userSub, status" // 'pending' | 'done' | 'error'
});
