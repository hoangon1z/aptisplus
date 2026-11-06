function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("aptis-audio", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("recordings");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function storeRecording(key: string, blob: Blob) {
  const database = await db();
  return new Promise<void>((resolve, reject) => {
    const tx = database.transaction("recordings", "readwrite");
    tx.objectStore("recordings").put(blob, key);
    tx.oncomplete = () => {
      database.close();
      resolve();
    };
    tx.onerror = () => {
      database.close();
      reject(tx.error);
    };
  });
}
export async function getRecording(key: string): Promise<Blob | undefined> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction("recordings");
    const req = tx.objectStore("recordings").get(key);
    req.onsuccess = () => {
      database.close();
      resolve(req.result);
    };
    req.onerror = () => {
      database.close();
      reject(req.error);
    };
  });
}
