import Dexie from "dexie";

export const db = new Dexie("pixel");

db.version(1).stores({
  photos: `++id, photo, info`,
});
