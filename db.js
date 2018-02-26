let db;
const CLOTHING_STORE_NAME = 'clothing';
const OUTFIT_STORE_NAME = 'outfits';

function init() {
  return new Promise((resolve, reject) => {
    const version = 2;
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
      objectStore.createIndex('season', 'seasons', { unique: false });

      const outfitStore = db.createObjectStore(
        OUTFIT_STORE_NAME,
        { keyPath: 'timeStamp' }
      );

      outfitStore.createIndex('top', 'top', { unique: false });
      outfitStore.createIndex('bottom', 'bottom', { unique: false });
      outfitStore.createIndex('outer', 'outer', { unique: false });
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve();
    };

    request.onerror = reject;
  });
}


function put(item, isNew) {
  return new Promise((resolve, reject) => {
    const trans = db.transaction(CLOTHING_STORE_NAME, 'readwrite');
    const store = trans.objectStore(CLOTHING_STORE_NAME);

    if (isNew) {
      item.timeStamp = new Date().getTime();
    }
    const request = store.put(item);

    request.onsuccess = resolve;

    request.onerror = reject;
  });
}

function add(item) {
  return put(item, true);
}

function update(item) {
  return put(item, false);
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
  update,
  remove,
  list,
};
