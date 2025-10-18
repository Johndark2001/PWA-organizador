// src/db/syncService.js
import { db } from "./indexedDB";

/**
 * En esta versión, simularemos una API REST con endpoints:
 *  - POST /api/sync/task
 *  - POST /api/sync/metric
 *
 * Puedes reemplazar las URLs con tus rutas Flask reales.
 */

const API_BASE = "http://localhost:5000/api/sync"; // Ajusta si usas otra URL

export async function enqueueChange(type, payload, userSub) {
  await db.syncQueue.add({
    type,
    payload,
    userSub,
    status: "pending",
  });
}

/**
 * Sincroniza todos los elementos pendientes cuando haya conexión
 */
export async function syncPendingData() {
  const pendingItems = await db.syncQueue.where("status").equals("pending").toArray();
  if (pendingItems.length === 0) return;

  console.log(`🔄 Intentando sincronizar ${pendingItems.length} cambios...`);

  for (const item of pendingItems) {
    try {
      const endpoint = item.type === "task" ? `${API_BASE}/task` : `${API_BASE}/metric`;
      // Intentar obtener token de la sesión guardada en localStorage
      let headers = { "Content-Type": "application/json" };
      try {
        const raw = localStorage.getItem('pwa_organizador_session');
        if (raw) {
          const session = JSON.parse(raw);
          if (session?.credential) headers["Authorization"] = `Bearer ${session.credential}`;
        }
<<<<<<< HEAD
      } catch (err) {
        console.warn('Error leyendo session desde localStorage en syncService:', err);
=======
      } catch (e) {
        // ignore
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(item.payload),
      });

      if (!res.ok) throw new Error("Error en la API");

      await db.syncQueue.update(item.id, { status: "done" });
      console.log(`✅ Sincronizado ${item.type} (${item.id})`);
    } catch (err) {
      console.warn(`⚠️ Error al sincronizar ${item.type} (${item.id})`, err);
      await db.syncQueue.update(item.id, { status: "error" });
    }
  }
}

/**
 * Detecta cambios de conexión
 */
export function initSyncListener() {
  window.addEventListener("online", () => {
    console.log("🌐 Conexión restaurada, intentando sincronizar...");
    syncPendingData();
  });

  // sincroniza también al iniciar la app si hay conexión
  if (navigator.onLine) syncPendingData();
}
