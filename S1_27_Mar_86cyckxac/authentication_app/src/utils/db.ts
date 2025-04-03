import { openDB } from "idb";

const DB_NAME = "UserDatabase";
const STORE_NAME = "users";

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "email" });
      }
    },
  });
};

// Add new user
export const addUser = async (email: string, password: string) => {
  const db = await initDB();
  await db.put(STORE_NAME, { email, password });
};

// Check if user exists
export const getUser = async (email: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, email);
};
