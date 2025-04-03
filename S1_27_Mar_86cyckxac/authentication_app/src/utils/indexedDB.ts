export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("AuthDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "email" });
        }
      };
  
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = () => {
        reject("Failed to open IndexedDB");
      };
    });
  };
  
  // 🔹 Add a new user (Sign-Up)
  export const addUser = async (email: string, password: string): Promise<boolean> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");
  
      // Check if user already exists
      const getRequest = store.get(email);
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          reject("User already exists");
        } else {
          store.add({ email, password });
          resolve(true);
        }
      };
  
      getRequest.onerror = () => reject("Error checking user");
    });
  };
  
  // 🔹 Get a user (Login validation)
  export const getUser = async (email: string): Promise<{ email: string; password: string } | null> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("users", "readonly");
      const store = transaction.objectStore("users");
  
      const request = store.get(email);
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject("Error fetching user");
    });
  };
  