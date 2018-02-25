let db;
const CLOTHING_STORE_NAME = 'clothing';

function init() {
  return new Promise((resolve, reject) => {
    const version = 1;
    const request = indexedDB.open('kloset', version);

    // We can only create Object stores in a versionchange transaction.
    request.onupgradeneeded = (e) => {
      db = e.target.result;

      if (db.objectStoreNames.contains(CLOTHING_STORE_NAME)) {
        db.deleteObjectStore(CLOTHING_STORE_NAME);
      }

      const objectStore = db.createObjectStore(
        CLOTHING_STORE_NAME,
        { keyPath: 'timeStamp' }
      );

      objectStore.createIndex('type', 'type', { unique: false });
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve();
    };

    request.onerror = reject;
  });
}

function add(item) {
  return new Promise((resolve, reject) => {
    const trans = db.transaction(CLOTHING_STORE_NAME, 'readwrite');
    const store = trans.objectStore(CLOTHING_STORE_NAME);
    item.timeStamp = new Date().getTime();
    const request = store.put(item);

    request.onsuccess = resolve;

    request.onerror = reject;
  });
}

function list(query) {
  return new Promise((resolve, reject) => {
    const trans = db.transaction(CLOTHING_STORE_NAME, 'readwrite');
    const store = trans.objectStore(CLOTHING_STORE_NAME);

    let request;
    if (query && query.type) {
      const index = store.index('type');
      request = index.openCursor(IDBKeyRange.only(query.type));
    } else {
      request = store.openCursor();
    }

    const results = [];

    request.onsuccess = (e) => {
      const cursor = e.target.result;

      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = reject;
  });
}


function remove(id) {
  return new Promise((resolve, reject) => {
    const trans = db.transaction(CLOTHING_STORE_NAME, 'readwrite');
    const store = trans.objectStore(CLOTHING_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = resolve;

    request.onerror = reject;
  });
}

module.exports = {
  init,
  add,
  remove,
  list,
};
