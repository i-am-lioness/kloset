const fs = require('fs');

const clothingDB = require('./db.js');

clothingDB.init();

function storeFile(filepath) {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      alert(`An error ocurred reading the file :${err.message}`);
      return;
    }

    clothingDB.add(filepath, data);
  });
}

document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();

  let f;
  for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
    f = e.dataTransfer.files[i];
    const img = document.getElementById('test');
    img.src = `file://${encodeURI(f.path)}`;
    storeFile(f.path);
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});
