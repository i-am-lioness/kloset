import React from 'react';
import ListView from './list-view';
import Resizer from './resizer';

const fs = require('fs');
const clothingDB = require('../db.js');

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clothing: [],
      displayedPath: '',
    };

    this.storeFile = this.storeFile.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
  }

  componentWillMount() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.onNewImage(e.dataTransfer.files);
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  onNewImage(files) {
    let f;
    for (let i = 0; i < files.length; i += 1) {
      f = files[i];
      const displayedPath = `file://${encodeURI(f.path)}`;
      this.setState({ displayedPath });
      // this.storeFile(f.path);
    }
  }

  storeFile(filepath) {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        return Promise.reject(err);
      }

      return clothingDB.add(filepath, data).then(this.loadData);
    });
  }

  loadData() {
    clothingDB.list().then((clothing) => {
      this.setState({ clothing });
    });
  }

  componentDidMount() {
    clothingDB.init().then(this.loadData);
  }

  render() {
    return (
      <div>
        <Resizer src={this.state.displayedPath} />
        <ListView items={this.state.clothing} />
      </div>
    );
  }
}

export default Home;
